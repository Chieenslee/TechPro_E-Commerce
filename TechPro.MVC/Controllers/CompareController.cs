using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("compare")]
public class CompareController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        ViewBag.Title = "So sánh sản phẩm";
        return View();
    }
}
