using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TechPro.Models;
using TechPro.Models.ViewModels;
using TechPro.Models.DTOs;
using TechPro.Services;
using System.Text.Json;
using System.Text;

namespace TechPro.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public HomeController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                var userRole = User.FindFirstValue(ClaimTypes.Role);
                var redirect = userRole switch
                {
                    "SystemAdmin" => RedirectToAction("Index", "Chain"),
                    "Technician" => RedirectToAction("Index", "KyThuat"),
                    "Support" => RedirectToAction("Index", "TiepNhan"),
                    "StoreAdmin" => RedirectToAction("Index", "QuanLy"),
                    "Storekeeper" => RedirectToAction("Index", "StorekeeperDashboard"),
                    _ => null
                };

                if (redirect != null)
                {
                    return redirect;
                }
            }

            var client = _httpClientFactory.CreateClient("TechProAPI");
            var viewModel = new StoreHomeViewModel
            {
                Categories = await GetOrEmpty<List<CategoryDto>>(client, "api/categories?rootOnly=true"),
                Brands = await GetOrEmpty<List<BrandDto>>(client, "api/brands"),
                FeaturedProducts = await GetOrEmpty<List<ProductListDto>>(client, "api/products/featured?limit=8"),
                BestSellers = await GetOrEmpty<List<ProductListDto>>(client, "api/products/bestsellers?limit=8"),
                NewArrivals = await GetOrEmpty<List<ProductListDto>>(client, "api/products/new-arrivals?limit=8"),
                FlashSales = await GetOrEmpty<List<FlashSaleDto>>(client, "api/flashsales/active")
            };

            ViewBag.Title = "Thiết bị điện tử chính hãng";
            ViewBag.MetaDescription = "TechPro - Website bán điện thoại, laptop, tablet, tai nghe và phụ kiện chính hãng.";
            if (!viewModel.Categories.Any() && !viewModel.FeaturedProducts.Any())
            {
                var demoProducts = StorefrontDemoData.Products();
                viewModel.Categories = StorefrontDemoData.Categories();
                viewModel.Brands = StorefrontDemoData.Brands();
                viewModel.FeaturedProducts = demoProducts.Where(p => p.IsFeatured).ToList();
                viewModel.BestSellers = demoProducts.Where(p => p.IsBestSeller).ToList();
                viewModel.NewArrivals = demoProducts.Where(p => p.IsNew).ToList();
                viewModel.FlashSales = StorefrontDemoData.FlashSales();
            }

            return View(viewModel);
        }

        private static async Task<T> GetOrEmpty<T>(HttpClient client, string uri) where T : new()
        {
            try
            {
                return await client.GetFromJsonAsync<T>(uri) ?? new T();
            }
            catch
            {
                return new T();
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Privacy()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Search(string query, string mode = "repair")
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                TempData["ErrorMessage"] = "Vui lòng nhập thông tin tra cứu.";
                return RedirectToAction("Index");
            }

            var client = _httpClientFactory.CreateClient("TechProAPI");

            if (mode == "repair")
            {
                // Tìm phiếu sửa chữa
                var response = await client.GetAsync($"api/TiepNhan/search?query={Uri.EscapeDataString(query)}");
                
                if (!response.IsSuccessStatusCode)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy thông tin phiếu sửa chữa này.";
                    TempData["SearchQuery"] = query;
                    TempData["SearchMode"] = mode;
                    return RedirectToAction("Index");
                }

                var phieu = await response.Content.ReadFromJsonAsync<PhieuSuaChua>();
                if (phieu == null)
                {
                     TempData["ErrorMessage"] = "Không tìm thấy thông tin phiếu sửa chữa này.";
                     return RedirectToAction("Index");
                }

                return RedirectToAction("TraCuu", new { id = phieu.Id });
            }
            else
            {
                // Kiểm tra bảo hành
                var response = await client.GetAsync($"api/TiepNhan/device-warranty?serial={Uri.EscapeDataString(query)}");

                if (!response.IsSuccessStatusCode)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy thông tin Serial Number này trong hệ thống bán hàng.";
                    TempData["SearchQuery"] = query;
                    TempData["SearchMode"] = mode;
                    return RedirectToAction("Index");
                }

                var thietBi = await response.Content.ReadFromJsonAsync<ThietBiBan>();
                if (thietBi == null)
                {
                    TempData["ErrorMessage"] = "Không tìm thấy thông tin Serial Number này trong hệ thống bán hàng.";
                    TempData["SearchQuery"] = query;
                    TempData["SearchMode"] = mode;
                    return RedirectToAction("Index");
                }

                var ngayHetHan = thietBi.NgayMua.AddMonths(thietBi.ThoiHanBaoHanhThang);
                var conBaoHanh = ngayHetHan > DateTime.UtcNow.AddHours(7);

                var warrantyViewModel = new WarrantyCheckViewModel
                {
                    IsValid = conBaoHanh,
                    EndDate = ngayHetHan.ToString("dd/MM/yyyy"),
                    Model = thietBi.Model,
                    PurchaseDate = thietBi.NgayMua.ToString("dd/MM/yyyy"),
                    SerialNumber = query.Trim()
                };

                return RedirectToAction("Warranty", warrantyViewModel);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> TraCuu(string? id = null, string? q = null)
        {
            // Ưu tiên id, nếu không có thì dùng q
            var searchTerm = id ?? q;
            
            if (string.IsNullOrEmpty(searchTerm))
            {
                return RedirectToAction("Index");
            }

            var client = _httpClientFactory.CreateClient("TechProAPI");

            PhieuSuaChua? phieu = null;
            if (!string.IsNullOrEmpty(id))
            {
                 // Dùng search API (AllowAnonymous) để khách hàng và link chia sẻ /Support/Home/TraCuu/{id}
                 // đều truy cập được mà không cần đăng nhập.
                 var response = await client.GetAsync($"api/TiepNhan/search?query={Uri.EscapeDataString(id)}");
                 if (response.IsSuccessStatusCode)
                 {
                     phieu = await response.Content.ReadFromJsonAsync<PhieuSuaChua>();
                 }
            }
            else
            {
                // Dung search API
                var response = await client.GetAsync($"api/TiepNhan/search?query={Uri.EscapeDataString(q ?? string.Empty)}");
                if (response.IsSuccessStatusCode)
                {
                    phieu = await response.Content.ReadFromJsonAsync<PhieuSuaChua>();
                }
            }

            if (phieu == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy thông tin phiếu sửa chữa này.";
                return RedirectToAction("Index");
            }

            // Calculate costs
            // Note: The logic for calculation should be moved to API ideally (e.g. Calculated Properties on DTO), 
            // but for now keeping it here with data from API is fine.
            var partsCost = phieu.YeuCauLinhKiens?
                .Where(y => y.TrangThai == "approved")
                .Sum(y => (y.GiaTaiThoiDiemYeuCau ?? 0) * y.SoLuong) ?? 0;
            var serviceFee = phieu.CoBaoHanh == true ? 0 : 200000;
            var totalCost = partsCost + serviceFee;

            ViewBag.PartsCost = partsCost;
            ViewBag.ServiceFee = serviceFee;
            ViewBag.TotalCost = totalCost;
            
            if (phieu.YeuCauLinhKiens != null)
            {
                var partsList = phieu.YeuCauLinhKiens
                    .Where(y => y.TrangThai == "approved")
                    .Select(y => new { Name = y.LinhKien?.TenLinhKien ?? "N/A", Price = y.GiaTaiThoiDiemYeuCau ?? 0, Quantity = y.SoLuong })
                    .ToList();
                ViewBag.PartsList = partsList;
            }
            else
            {
                ViewBag.PartsList = new List<object>();
            }

            return View(phieu);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult DatLich()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DatLich(LichHen model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Ghép Date + Time vào NgayHen nếu người dùng gửi date và giờ tách
            if (model.NgayHen.Date == DateTime.MinValue.Date)
            {
                ModelState.AddModelError(string.Empty, "Vui lòng chọn ngày hẹn.");
                return View(model);
            }

            var client = _httpClientFactory.CreateClient("TechProAPI");
            var json = JsonSerializer.Serialize(model);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync("api/Bookings", content);

            if (response.IsSuccessStatusCode)
            {
                TempData["BookingSuccess"] = "Đã đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận.";
                return RedirectToAction("DatLich");
            }
            else
            {
                ModelState.AddModelError("", "Có lỗi xảy ra khi đặt lịch.");
                return View(model);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> XacNhanBaoGia(string ticketId)
        {
            var client = _httpClientFactory.CreateClient("TechProAPI");
            var response = await client.PostAsync($"api/TiepNhan/{ticketId}/XacNhanBaoGia", null);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Đã xác nhận báo giá." });
            }
            else
            {
                 // Try read message
                 // var msg = await response.Content.ReadAsStringAsync();
                 return Json(new { success = false, message = "Lỗi khi xác nhận báo giá." });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Warranty(WarrantyCheckViewModel? warrantyInfo)
        {
            if (warrantyInfo == null)
            {
                return RedirectToAction("Index");
            }
            return View(warrantyInfo);
        }
    }
}
