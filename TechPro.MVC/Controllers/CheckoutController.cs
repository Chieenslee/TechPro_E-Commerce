using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Models.ViewModels;
using TechPro.Services;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("checkout")]
public class CheckoutController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        var cart = GetCart();
        if (!cart.Items.Any())
        {
            return RedirectToAction("Index", "Cart");
        }

        ViewBag.Title = "Thanh toán";
        return View(new CheckoutViewModel { Cart = cart });
    }

    [HttpPost("")]
    [ValidateAntiForgeryToken]
    public IActionResult Place(PlaceOrderDto order)
    {
        var cart = GetCart();
        if (!cart.Items.Any())
        {
            return RedirectToAction("Index", "Cart");
        }

        var orderCode = $"TP-DEMO-{DateTime.Now:yyyyMMddHHmmss}";
        StorefrontSessionCart.Clear(HttpContext.Session);
        return RedirectToAction(nameof(Success), new { code = orderCode });
    }

    [HttpGet("success")]
    public IActionResult Success(string? code)
    {
        ViewBag.Title = "Đặt hàng thành công";
        ViewBag.OrderCode = code;
        return View();
    }

    private CartDto GetCart()
    {
        return StorefrontSessionCart.GetCart(HttpContext.Session);
    }
}
