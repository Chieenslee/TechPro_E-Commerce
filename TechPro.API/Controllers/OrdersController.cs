using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TechPro.API.Data;
using TechPro.API.Models;
using TechPro.API.Models.DTOs;

namespace TechPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly TechProDbContext _db;
        public OrdersController(TechProDbContext db) => _db = db;

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // GET /api/orders
        [HttpGet]
        public async Task<ActionResult<List<OrderSummaryDto>>> GetMyOrders()
        {
            var orders = await _db.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
                .Where(o => o.UserId == GetUserId())
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderSummaryDto
                {
                    Id = o.Id,
                    OrderCode = o.OrderCode,
                    Status = o.Status,
                    PaymentMethod = o.PaymentMethod,
                    PaymentStatus = o.PaymentStatus,
                    TotalAmount = o.TotalAmount,
                    ItemCount = o.Items.Count,
                    FirstProductImage = o.Items.FirstOrDefault()!.Product.Images
                        .Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault(),
                    CreatedAt = o.CreatedAt
                }).ToListAsync();
            return Ok(orders);
        }

        // GET /api/orders/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderDetailDto>> GetDetail(int id)
        {
            var o = await _db.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.StatusHistory)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == GetUserId());
            if (o == null) return NotFound();

            return Ok(new OrderDetailDto
            {
                Id = o.Id, OrderCode = o.OrderCode, Status = o.Status,
                PaymentMethod = o.PaymentMethod, PaymentStatus = o.PaymentStatus,
                ShippingFullName = o.ShippingFullName, ShippingPhone = o.ShippingPhone,
                ShippingAddress = o.ShippingAddress, ShippingWard = o.ShippingWard,
                ShippingDistrict = o.ShippingDistrict, ShippingProvince = o.ShippingProvince,
                SubTotal = o.SubTotal, ShippingFee = o.ShippingFee,
                DiscountAmount = o.DiscountAmount, TotalAmount = o.TotalAmount,
                CouponCode = o.CouponCode, TrackingCode = o.TrackingCode,
                ShippingCarrier = o.ShippingCarrier, Note = o.Note,
                PointsEarned = o.PointsEarned, CreatedAt = o.CreatedAt, PaidAt = o.PaidAt,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId, ProductName = i.ProductName,
                    VariantInfo = i.VariantInfo, ProductImageUrl = i.ProductImageUrl,
                    Quantity = i.Quantity, UnitPrice = i.UnitPrice,
                    TotalPrice = i.UnitPrice * i.Quantity
                }).ToList(),
                StatusHistory = o.StatusHistory.OrderBy(h => h.ChangedAt).Select(h => new OrderStatusHistoryDto
                {
                    Status = h.Status, Note = h.Note, ChangedBy = h.ChangedBy, ChangedAt = h.ChangedAt
                }).ToList()
            });
        }

        // POST /api/orders/place
        [HttpPost("place")]
        public async Task<ActionResult<OrderDetailDto>> PlaceOrder([FromBody] PlaceOrderDto dto)
        {
            var userId = GetUserId();
            var cart = await _db.Carts
                .Include(c => c.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
                .Include(c => c.Items).ThenInclude(i => i.Variant)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
                return BadRequest("Giỏ hàng trống");

            // Validate coupon
            decimal discount = 0;
            Coupon? coupon = null;
            if (!string.IsNullOrEmpty(dto.CouponCode))
            {
                coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == dto.CouponCode && c.IsActive
                    && (c.EndDate == null || c.EndDate >= DateTime.UtcNow)
                    && (c.UsageLimit == null || c.UsedCount < c.UsageLimit));
            }

            var subTotal = cart.Items.Sum(i => (i.Product.Price + (i.Variant?.PriceModifier ?? 0)) * i.Quantity);
            if (coupon != null && subTotal >= coupon.MinOrderAmount)
            {
                discount = coupon.Type == "percent"
                    ? Math.Min(subTotal * coupon.Value / 100, coupon.MaxDiscountAmount ?? decimal.MaxValue)
                    : coupon.Value;
                coupon.UsedCount++;
            }

            var shippingFee = subTotal >= 500000 ? 0 : 30000; // Free ship over 500k
            var total = subTotal - discount + shippingFee;

            // Generate order code
            var orderCode = $"TP-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

            var order = new Order
            {
                OrderCode = orderCode,
                UserId = userId,
                ShippingFullName = dto.ShippingFullName,
                ShippingPhone = dto.ShippingPhone,
                ShippingAddress = dto.ShippingAddress,
                ShippingWard = dto.ShippingWard,
                ShippingDistrict = dto.ShippingDistrict,
                ShippingProvince = dto.ShippingProvince,
                SubTotal = subTotal,
                ShippingFee = shippingFee,
                DiscountAmount = discount,
                TotalAmount = total,
                PaymentMethod = dto.PaymentMethod,
                CouponCode = dto.CouponCode,
                Note = dto.Note,
                Status = "pending",
                PaymentStatus = dto.PaymentMethod == "cod" ? "unpaid" : "unpaid",
                PointsEarned = (int)(total / 10000), // 1 point per 10,000 VND
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // Add items & update stock
            foreach (var item in cart.Items)
            {
                var unitPrice = item.Product.Price + (item.Variant?.PriceModifier ?? 0);
                _db.OrderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    VariantId = item.VariantId,
                    ProductName = item.Product.Name,
                    VariantInfo = item.Variant != null ? $"{item.Variant.VariantType}: {item.Variant.VariantValue}" : null,
                    ProductImageUrl = item.Product.Images.Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault(),
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice
                });
                // Update stock
                if (item.VariantId.HasValue && item.Variant != null)
                    item.Variant.Stock -= item.Quantity;
                else
                    item.Product.Stock -= item.Quantity;
                item.Product.SoldCount += item.Quantity;
            }

            // Order history
            _db.OrderStatusHistories.Add(new OrderStatusHistory
            {
                OrderId = order.Id, Status = "pending",
                Note = "Đơn hàng đã được đặt thành công", ChangedBy = "System"
            });

            // Clear cart
            _db.CartItems.RemoveRange(cart.Items);
            await _db.SaveChangesAsync();

            return Ok(new { orderId = order.Id, orderCode = order.OrderCode, total = order.TotalAmount });
        }

        // POST /api/orders/{id}/cancel
        [HttpPost("{id:int}/cancel")]
        public async Task<IActionResult> Cancel(int id, [FromBody] string? reason)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id && o.UserId == GetUserId());
            if (order == null) return NotFound();
            if (order.Status != "pending" && order.Status != "confirmed")
                return BadRequest("Không thể hủy đơn hàng ở trạng thái này");

            order.Status = "cancelled";
            order.UpdatedAt = DateTime.UtcNow;
            _db.OrderStatusHistories.Add(new OrderStatusHistory
            {
                OrderId = order.Id, Status = "cancelled",
                Note = reason ?? "Khách hàng hủy đơn", ChangedBy = "Customer"
            });
            await _db.SaveChangesAsync();
            return Ok();
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class FlashSalesController : ControllerBase
    {
        private readonly TechProDbContext _db;
        public FlashSalesController(TechProDbContext db) => _db = db;

        [HttpGet("active")]
        public async Task<ActionResult<List<FlashSaleDto>>> GetActive()
        {
            var now = DateTime.UtcNow;
            var sales = await _db.FlashSales
                .Include(f => f.Product).ThenInclude(p => p.Images)
                .Include(f => f.Product).ThenInclude(p => p.Category)
                .Include(f => f.Product).ThenInclude(p => p.Brand)
                .Where(f => f.IsActive && f.StartTime <= now && f.EndTime >= now)
                .ToListAsync();

            return Ok(sales.Select(f => new FlashSaleDto
            {
                Id = f.Id,
                Product = new ProductListDto
                {
                    Id = f.Product.Id, Name = f.Product.Name, Slug = f.Product.Slug,
                    Price = f.SalePrice, ComparePrice = f.Product.Price,
                    Stock = f.Quantity.HasValue ? f.Quantity.Value - f.Sold : f.Product.Stock,
                    PrimaryImage = f.Product.Images.Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault(),
                    AverageRating = f.Product.AverageRating, ReviewCount = f.Product.ReviewCount,
                    CategoryName = f.Product.Category.Name, BrandName = f.Product.Brand.Name
                },
                SalePrice = f.SalePrice, OriginalPrice = f.Product.Price,
                StartTime = f.StartTime, EndTime = f.EndTime,
                Quantity = f.Quantity, Sold = f.Sold
            }));
        }
    }
}
