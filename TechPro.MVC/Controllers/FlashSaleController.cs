using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Services;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("flash-sale")]
public class FlashSaleController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;

    public FlashSaleController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        var sales = new List<FlashSaleDto>();
        try
        {
            sales = await client.GetFromJsonAsync<List<FlashSaleDto>>("api/flashsales/active") ?? new();
        }
        catch
        {
            // Keep storefront available even when the external database is offline.
        }

        if (!sales.Any())
        {
            sales = StorefrontDemoData.FlashSales();
        }

        ViewBag.Title = "Flash Sale";
        return View(sales);
    }
}
