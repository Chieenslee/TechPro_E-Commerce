using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Models.ViewModels;

namespace TechPro.Controllers;

[Authorize]
[Route("checkout")]
public class CheckoutController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CheckoutController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var cart = await GetCart();
        if (!cart.Items.Any())
        {
            return RedirectToAction("Index", "Cart");
        }

        ViewBag.Title = "Thanh toán";
        return View(new CheckoutViewModel { Cart = cart });
    }

    [HttpPost("")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Place(PlaceOrderDto order)
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        var response = await client.PostAsJsonAsync("api/orders/place", order);
        if (!response.IsSuccessStatusCode)
        {
            ModelState.AddModelError(string.Empty, "Không thể đặt hàng. Vui lòng kiểm tra giỏ hàng và thông tin giao hàng.");
            return View("Index", new CheckoutViewModel { Cart = await GetCart(), Order = order });
        }

        var result = await response.Content.ReadFromJsonAsync<OrderPlacedResult>();
        return RedirectToAction(nameof(Success), new { code = result?.OrderCode });
    }

    [HttpGet("success")]
    public IActionResult Success(string? code)
    {
        ViewBag.Title = "Đặt hàng thành công";
        ViewBag.OrderCode = code;
        return View();
    }

    private async Task<CartDto> GetCart()
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        try
        {
            return await client.GetFromJsonAsync<CartDto>("api/cart") ?? new CartDto();
        }
        catch
        {
            return new CartDto();
        }
    }

    private sealed class OrderPlacedResult
    {
        public string? OrderCode { get; set; }
    }
}
