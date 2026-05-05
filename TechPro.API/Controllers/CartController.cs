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
    public class CartController : ControllerBase
    {
        private readonly TechProDbContext _db;

        public CartController(TechProDbContext db) => _db = db;

        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        private string? GetSessionId() => HttpContext.Session.GetString("CartSessionId");

        private async Task<Cart?> GetOrCreateCart(bool createIfMissing = true)
        {
            var userId = GetUserId();
            Cart? cart = null;

            if (!string.IsNullOrEmpty(userId))
            {
                cart = await _db.Carts
                    .Include(c => c.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
                    .Include(c => c.Items).ThenInclude(i => i.Variant)
                    .FirstOrDefaultAsync(c => c.UserId == userId);
            }
            else
            {
                var sessionId = GetSessionId();
                if (!string.IsNullOrEmpty(sessionId))
                {
                    cart = await _db.Carts
                        .Include(c => c.Items).ThenInclude(i => i.Product).ThenInclude(p => p.Images)
                        .Include(c => c.Items).ThenInclude(i => i.Variant)
                        .FirstOrDefaultAsync(c => c.SessionId == sessionId);
                }
            }

            if (cart == null && createIfMissing)
            {
                var sessionId = Guid.NewGuid().ToString();
                HttpContext.Session.SetString("CartSessionId", sessionId);
                cart = new Cart { UserId = userId, SessionId = sessionId };
                _db.Carts.Add(cart);
                await _db.SaveChangesAsync();
            }

            return cart;
        }

        // GET /api/cart
        [HttpGet]
        public async Task<ActionResult<CartDto>> Get()
        {
            var cart = await GetOrCreateCart(false);
            if (cart == null)
                return Ok(new CartDto { Items = new() });

            return Ok(MapCartToDto(cart));
        }

        // POST /api/cart/add
        [HttpPost("add")]
        public async Task<ActionResult<CartDto>> Add([FromBody] AddToCartDto dto)
        {
            var product = await _db.Products
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .FirstOrDefaultAsync(p => p.Id == dto.ProductId && p.IsActive);

            if (product == null) return NotFound("Sản phẩm không tồn tại");

            var effectiveStock = dto.VariantId.HasValue
                ? product.Variants.FirstOrDefault(v => v.Id == dto.VariantId)?.Stock ?? 0
                : product.Stock;

            if (effectiveStock < dto.Quantity)
                return BadRequest("Không đủ hàng trong kho");

            var cart = await GetOrCreateCart();
            var existing = cart!.Items.FirstOrDefault(i => i.ProductId == dto.ProductId && i.VariantId == dto.VariantId);

            if (existing != null)
            {
                existing.Quantity = Math.Min(existing.Quantity + dto.Quantity, effectiveStock);
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    VariantId = dto.VariantId,
                    Quantity = Math.Min(dto.Quantity, effectiveStock)
                });
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            // Reload
            var updatedCart = await GetOrCreateCart(false);
            return Ok(MapCartToDto(updatedCart!));
        }

        // PUT /api/cart/items/{itemId}
        [HttpPut("items/{itemId:int}")]
        public async Task<ActionResult<CartDto>> UpdateItem(int itemId, [FromBody] int quantity)
        {
            var cart = await GetOrCreateCart(false);
            if (cart == null) return NotFound();

            var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) return NotFound();

            if (quantity <= 0)
            {
                _db.CartItems.Remove(item);
            }
            else
            {
                item.Quantity = quantity;
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var updatedCart = await GetOrCreateCart(false);
            return Ok(MapCartToDto(updatedCart ?? new Cart()));
        }

        // DELETE /api/cart/items/{itemId}
        [HttpDelete("items/{itemId:int}")]
        public async Task<ActionResult<CartDto>> RemoveItem(int itemId)
        {
            var cart = await GetOrCreateCart(false);
            if (cart == null) return NotFound();

            var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
            if (item != null)
            {
                _db.CartItems.Remove(item);
                cart.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }

            var updatedCart = await GetOrCreateCart(false);
            return Ok(MapCartToDto(updatedCart ?? new Cart()));
        }

        // DELETE /api/cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var cart = await GetOrCreateCart(false);
            if (cart != null)
            {
                _db.CartItems.RemoveRange(cart.Items);
                cart.UpdatedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
            return Ok(new CartDto());
        }

        // GET /api/cart/count
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCount()
        {
            var cart = await GetOrCreateCart(false);
            return Ok(cart?.Items.Sum(i => i.Quantity) ?? 0);
        }

        private static CartDto MapCartToDto(Cart cart) => new()
        {
            Id = cart.Id,
            Items = cart.Items.Select(i =>
            {
                var variantPrice = i.Variant?.PriceModifier ?? 0;
                var unitPrice = i.Product.Price + variantPrice;
                var variantInfo = i.Variant != null ? $"{i.Variant.VariantType}: {i.Variant.VariantValue}" : null;
                var stock = i.Variant?.Stock ?? i.Product.Stock;
                return new CartItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    ProductSlug = i.Product.Slug,
                    ProductImage = i.Product.Images.Where(img => img.IsPrimary).Select(img => img.Url).FirstOrDefault()
                                   ?? i.Product.Images.OrderBy(img => img.SortOrder).Select(img => img.Url).FirstOrDefault(),
                    UnitPrice = unitPrice,
                    VariantId = i.VariantId,
                    VariantInfo = variantInfo,
                    Quantity = i.Quantity,
                    MaxStock = stock
                };
            }).ToList()
        };
    }
}
