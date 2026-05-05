namespace TechPro.Models.DTOs;

public class ProductListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? ComparePrice { get; set; }
    public int Stock { get; set; }
    public string? PrimaryImage { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public int SoldCount { get; set; }
    public bool IsNew { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsFeatured { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public string? BrandLogo { get; set; }
    public decimal? DiscountPercent => ComparePrice.HasValue && ComparePrice > 0
        ? Math.Round((1 - Price / ComparePrice.Value) * 100)
        : null;
}

public class ProductDetailDto : ProductListDto
{
    public string? Description { get; set; }
    public string? Sku { get; set; }
    public int ViewCount { get; set; }
    public int CategoryId { get; set; }
    public string CategorySlug { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public string BrandSlug { get; set; } = string.Empty;
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
    public List<ProductSpecDto> Specifications { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();
    public List<ProductReviewDto> RecentReviews { get; set; } = new();
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}

public class ProductSpecDto
{
    public string SpecKey { get; set; } = string.Empty;
    public string SpecValue { get; set; } = string.Empty;
    public string? GroupName { get; set; }
    public int SortOrder { get; set; }
}

public class ProductVariantDto
{
    public int Id { get; set; }
    public string VariantType { get; set; } = string.Empty;
    public string VariantValue { get; set; } = string.Empty;
    public decimal PriceModifier { get; set; }
    public int Stock { get; set; }
    public string? Sku { get; set; }
    public string? ColorHex { get; set; }
    public bool IsActive { get; set; }
}

public class ProductReviewDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string? Body { get; set; }
    public string? Pros { get; set; }
    public string? Cons { get; set; }
    public bool VerifiedPurchase { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductQueryDto
{
    public string? Search { get; set; }
    public string? CategorySlug { get; set; }
    public string? BrandSlug { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStock { get; set; }
    public string SortBy { get; set; } = "newest";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => PageSize <= 0 ? 0 : (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int? ParentId { get; set; }
    public int ProductCount { get; set; }
    public List<CategoryDto> Children { get; set; } = new();
}

public class BrandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? Country { get; set; }
    public int ProductCount { get; set; }
}

public class CartDto
{
    public int Id { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal SubTotal => Items.Sum(i => i.TotalPrice);
    public int TotalItems => Items.Sum(i => i.Quantity);
}

public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public decimal UnitPrice { get; set; }
    public int? VariantId { get; set; }
    public string? VariantInfo { get; set; }
    public int Quantity { get; set; }
    public int MaxStock { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
}

public class AddToCartDto
{
    public int ProductId { get; set; }
    public int? VariantId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class PlaceOrderDto
{
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string? ShippingWard { get; set; }
    public string? ShippingDistrict { get; set; }
    public string? ShippingProvince { get; set; }
    public string PaymentMethod { get; set; } = "cod";
    public string? CouponCode { get; set; }
    public string? Note { get; set; }
}

public class FlashSaleDto
{
    public int Id { get; set; }
    public ProductListDto Product { get; set; } = new();
    public decimal SalePrice { get; set; }
    public decimal OriginalPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int? Quantity { get; set; }
    public int Sold { get; set; }
    public int? Remaining => Quantity.HasValue ? Quantity.Value - Sold : null;
    public decimal DiscountPercent => OriginalPrice > 0
        ? Math.Round((1 - SalePrice / OriginalPrice) * 100)
        : 0;
}
