using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Services;

namespace TechPro.Controllers;

[AllowAnonymous]
[ApiController]
public class StorefrontCatalogApiController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public StorefrontCatalogApiController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("api/products")]
    public async Task<ActionResult<PagedResult<ProductListDto>>> Products([FromQuery] ProductQueryDto query)
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<PagedResult<ProductListDto>>(api, $"api/products{BuildProductQuery(query)}");
        return Ok(result ?? StorefrontDemoData.Query(query));
    }

    [HttpGet("api/products/featured")]
    public async Task<ActionResult<List<ProductListDto>>> Featured([FromQuery] int limit = 8)
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<List<ProductListDto>>(api, $"api/products/featured?limit={limit}");
        return Ok((result?.Any() == true ? result : StorefrontDemoData.Products().Where(p => p.IsFeatured).Take(limit).ToList()));
    }

    [HttpGet("api/products/bestsellers")]
    public async Task<ActionResult<List<ProductListDto>>> BestSellers([FromQuery] int limit = 8)
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<List<ProductListDto>>(api, $"api/products/bestsellers?limit={limit}");
        return Ok((result?.Any() == true ? result : StorefrontDemoData.Products().Where(p => p.IsBestSeller).Take(limit).ToList()));
    }

    [HttpGet("api/products/new-arrivals")]
    public async Task<ActionResult<List<ProductListDto>>> NewArrivals([FromQuery] int limit = 8)
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<List<ProductListDto>>(api, $"api/products/new-arrivals?limit={limit}");
        return Ok((result?.Any() == true ? result : StorefrontDemoData.Products().Where(p => p.IsNew).Take(limit).ToList()));
    }

    [HttpGet("api/products/{slug}")]
    public async Task<ActionResult<ProductDetailDto>> ProductBySlug(string slug)
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<ProductDetailDto>(api, $"api/products/{Uri.EscapeDataString(slug)}")
            ?? StorefrontDemoData.ProductBySlug(slug);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("api/categories")]
    public async Task<ActionResult<List<CategoryDto>>> Categories()
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<List<CategoryDto>>(api, "api/categories?rootOnly=true");
        return Ok((result?.Any() == true ? result : StorefrontDemoData.Categories()));
    }

    [HttpGet("api/brands")]
    public async Task<ActionResult<List<BrandDto>>> Brands()
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<List<BrandDto>>(api, "api/brands");
        return Ok((result?.Any() == true ? result : StorefrontDemoData.Brands()));
    }

    [HttpGet("api/flashsales/active")]
    public async Task<ActionResult<List<FlashSaleDto>>> FlashSales()
    {
        var api = _httpClientFactory.CreateClient("TechProAPI");
        var result = await GetOrDefault<List<FlashSaleDto>>(api, "api/flashsales/active");
        return Ok((result?.Any() == true ? result : StorefrontDemoData.FlashSales()));
    }

    private static async Task<T?> GetOrDefault<T>(HttpClient client, string uri)
    {
        try
        {
            return await client.GetFromJsonAsync<T>(uri);
        }
        catch
        {
            return default;
        }
    }

    private static string BuildProductQuery(ProductQueryDto query)
    {
        query.Page = Math.Max(1, query.Page);
        query.PageSize = query.PageSize <= 0 ? 20 : Math.Min(query.PageSize, 48);
        var parts = new List<string>
        {
            $"page={query.Page}",
            $"pageSize={query.PageSize}",
            $"sortBy={Uri.EscapeDataString(query.SortBy)}"
        };

        Add(parts, "search", query.Search);
        Add(parts, "categorySlug", query.CategorySlug);
        Add(parts, "brandSlug", query.BrandSlug);
        Add(parts, "minPrice", query.MinPrice?.ToString(System.Globalization.CultureInfo.InvariantCulture));
        Add(parts, "maxPrice", query.MaxPrice?.ToString(System.Globalization.CultureInfo.InvariantCulture));
        if (query.InStock.HasValue) Add(parts, "inStock", query.InStock.Value.ToString().ToLowerInvariant());
        return "?" + string.Join("&", parts);
    }

    private static void Add(List<string> parts, string key, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value))
        {
            parts.Add($"{key}={Uri.EscapeDataString(value)}");
        }
    }
}
