using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Services;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("cart")]
public class CartController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        var cart = StorefrontSessionCart.GetCart(HttpContext.Session);
        ViewBag.Title = "Giỏ hàng";
        return View(cart);
    }

    [HttpPost("items/{itemId:int}")]
    [ValidateAntiForgeryToken]
    public IActionResult UpdateItem(int itemId, int quantity)
    {
        StorefrontSessionCart.Update(HttpContext.Session, itemId, quantity);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("items/{itemId:int}/remove")]
    [ValidateAntiForgeryToken]
    public IActionResult RemoveItem(int itemId)
    {
        StorefrontSessionCart.Remove(HttpContext.Session, itemId);
        return RedirectToAction(nameof(Index));
    }
}
