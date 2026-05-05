using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Models.ViewModels;
using TechPro.Services;

namespace TechPro.Controllers;

[AllowAnonymous]
[Route("products")]
public class ProductsController : Controller
{
    private readonly IHttpClientFactory _httpClientFactory;

    public ProductsController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index([FromQuery] ProductQueryDto query)
    {
        query.Page = Math.Max(1, query.Page);
        query.PageSize = query.PageSize <= 0 ? 20 : Math.Min(query.PageSize, 48);

        var client = _httpClientFactory.CreateClient("TechProAPI");
        var products = await GetOrDefault<PagedResult<ProductListDto>>(client, $"api/products{BuildProductQuery(query)}");
        var categories = await GetOrDefault<List<CategoryDto>>(client, "api/categories?rootOnly=true");
        var brands = await GetOrDefault<List<BrandDto>>(client, "api/brands");

        if (products == null || (!products.Items.Any() && categories == null && brands == null))
        {
            products = StorefrontDemoData.Query(query);
            categories = StorefrontDemoData.Categories();
            brands = StorefrontDemoData.Brands();
        }

        ViewBag.Title = "Sản phẩm";
        return View(new ProductCatalogViewModel
        {
            Query = query,
            Products = products ?? new PagedResult<ProductListDto> { Page = query.Page, PageSize = query.PageSize },
            Categories = categories ?? new(),
            Brands = brands ?? new()
        });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> Details(string slug)
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        var product = await GetOrDefault<ProductDetailDto>(client, $"api/products/{Uri.EscapeDataString(slug)}");
        product ??= StorefrontDemoData.ProductBySlug(slug);
        if (product == null)
        {
            return NotFound();
        }

        var related = await GetOrDefault<List<ProductListDto>>(client, $"api/products/{product.Id}/related?limit=8") ?? new();
        if (!related.Any())
        {
            related = StorefrontDemoData.Products()
                .Where(p => p.Id != product.Id && (p.CategoryName == product.CategoryName || p.BrandName == product.BrandName))
                .Take(8)
                .ToList();
        }

        ViewBag.Title = product.MetaTitle ?? product.Name;
        ViewBag.MetaDescription = product.MetaDescription ?? product.ShortDescription;
        return View(new ProductDetailViewModel
        {
            Product = product,
            RelatedProducts = related
        });
    }

    private static string BuildProductQuery(ProductQueryDto query)
    {
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
}
