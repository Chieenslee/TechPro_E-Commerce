using TechPro.Models.DTOs;

namespace TechPro.Models.ViewModels;

public class StoreHomeViewModel
{
    public List<CategoryDto> Categories { get; set; } = new();
    public List<BrandDto> Brands { get; set; } = new();
    public List<ProductListDto> FeaturedProducts { get; set; } = new();
    public List<ProductListDto> BestSellers { get; set; } = new();
    public List<ProductListDto> NewArrivals { get; set; } = new();
    public List<FlashSaleDto> FlashSales { get; set; } = new();
}

public class ProductCatalogViewModel
{
    public ProductQueryDto Query { get; set; } = new();
    public PagedResult<ProductListDto> Products { get; set; } = new();
    public List<CategoryDto> Categories { get; set; } = new();
    public List<BrandDto> Brands { get; set; } = new();
}

public class ProductDetailViewModel
{
    public ProductDetailDto Product { get; set; } = new();
    public List<ProductListDto> RelatedProducts { get; set; } = new();
}

public class CheckoutViewModel
{
    public CartDto Cart { get; set; } = new();
    public PlaceOrderDto Order { get; set; } = new();
}
