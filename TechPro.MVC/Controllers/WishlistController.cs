using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("wishlist")]
public class WishlistController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        ViewBag.Title = "Yêu thích";
        return View();
    }
}
