using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("cart")]
public class CartController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CartController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        var cart = await SendWithCookies<CartDto>(HttpMethod.Get, "api/cart") ?? new CartDto();
        ViewBag.Title = "Giỏ hàng";
        return View(cart);
    }

    [HttpPost("items/{itemId:int}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateItem(int itemId, int quantity)
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        using var request = new HttpRequestMessage(HttpMethod.Put, $"api/cart/items/{itemId}")
        {
            Content = JsonContent.Create(quantity)
        };
        CopyBrowserCookies(request);
        await client.SendAsync(request);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost("items/{itemId:int}/remove")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> RemoveItem(int itemId)
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        using var request = new HttpRequestMessage(HttpMethod.Delete, $"api/cart/items/{itemId}");
        CopyBrowserCookies(request);
        await client.SendAsync(request);
        return RedirectToAction(nameof(Index));
    }

    private async Task<T?> SendWithCookies<T>(HttpMethod method, string uri)
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        using var request = new HttpRequestMessage(method, uri);
        CopyBrowserCookies(request);
        using var response = await client.SendAsync(request);
        RelaySetCookie(response);
        if (!response.IsSuccessStatusCode)
        {
            return default;
        }

        return await response.Content.ReadFromJsonAsync<T>();
    }

    private void CopyBrowserCookies(HttpRequestMessage request)
    {
        if (Request.Headers.TryGetValue("Cookie", out var cookie))
        {
            request.Headers.TryAddWithoutValidation("Cookie", cookie.ToArray());
        }
    }

    private void RelaySetCookie(HttpResponseMessage response)
    {
        if (response.Headers.TryGetValues("Set-Cookie", out var cookies))
        {
            foreach (var cookie in cookies)
            {
                Response.Headers.Append("Set-Cookie", cookie);
            }
        }
    }
}
