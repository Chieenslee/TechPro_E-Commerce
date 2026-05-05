using TechPro.Models.DTOs;

namespace TechPro.Services;

public static class StorefrontDemoData
{
    private const string PhoneFront = "/images/demo_devices/phone_front.jpg";
    private const string PhoneBack = "/images/demo_devices/phone_back.jpg";

    public static List<CategoryDto> Categories() => new()
    {
        new() { Id = 1, Name = "Dien thoai", Slug = "dien-thoai", Icon = "phone", ProductCount = 4 },
        new() { Id = 2, Name = "Laptop", Slug = "laptop", Icon = "laptop", ProductCount = 3 },
        new() { Id = 3, Name = "Tablet", Slug = "tablet", Icon = "tablet", ProductCount = 2 },
        new() { Id = 4, Name = "Tai nghe", Slug = "tai-nghe", Icon = "headphones", ProductCount = 2 },
        new() { Id = 5, Name = "Dong ho thong minh", Slug = "dong-ho-thong-minh", Icon = "smartwatch", ProductCount = 1 },
        new() { Id = 6, Name = "Phu kien", Slug = "phu-kien", Icon = "bag", ProductCount = 3 }
    };

    public static List<BrandDto> Brands() => new()
    {
        new() { Id = 1, Name = "Apple", Slug = "apple", Country = "USA", ProductCount = 4 },
        new() { Id = 2, Name = "Samsung", Slug = "samsung", Country = "Korea", ProductCount = 3 },
        new() { Id = 3, Name = "Dell", Slug = "dell", Country = "USA", ProductCount = 2 },
        new() { Id = 4, Name = "Sony", Slug = "sony", Country = "Japan", ProductCount = 2 },
        new() { Id = 5, Name = "Xiaomi", Slug = "xiaomi", Country = "China", ProductCount = 3 }
    };

    public static List<ProductListDto> Products() => new()
    {
        new()
        {
            Id = 101, Name = "iPhone 16 Pro 256GB", Slug = "iphone-16-pro-256gb",
            ShortDescription = "Chip A-series moi, man hinh ProMotion, camera telephoto va khung titan.",
            Price = 28990000, ComparePrice = 31990000, Stock = 18, PrimaryImage = PhoneFront,
            AverageRating = 4.8, ReviewCount = 128, SoldCount = 540, IsNew = true, IsBestSeller = true, IsFeatured = true,
            CategoryName = "Dien thoai", BrandName = "Apple"
        },
        new()
        {
            Id = 102, Name = "Samsung Galaxy S25 Ultra", Slug = "samsung-galaxy-s25-ultra",
            ShortDescription = "Flagship Android voi but S Pen, camera zoom xa va man hinh AMOLED sieu sang.",
            Price = 26990000, ComparePrice = 29990000, Stock = 12, PrimaryImage = PhoneBack,
            AverageRating = 4.7, ReviewCount = 96, SoldCount = 420, IsNew = true, IsBestSeller = true, IsFeatured = true,
            CategoryName = "Dien thoai", BrandName = "Samsung"
        },
        new()
        {
            Id = 103, Name = "MacBook Air M4 13 inch", Slug = "macbook-air-m4-13-inch",
            ShortDescription = "Laptop mong nhe cho hoc tap va lam viec, pin dai, hieu nang cao.",
            Price = 27990000, ComparePrice = 29990000, Stock = 10, PrimaryImage = "/images/image_home_1.png",
            AverageRating = 4.9, ReviewCount = 76, SoldCount = 260, IsNew = true, IsBestSeller = false, IsFeatured = true,
            CategoryName = "Laptop", BrandName = "Apple"
        },
        new()
        {
            Id = 104, Name = "Dell XPS 14 OLED", Slug = "dell-xps-14-oled",
            ShortDescription = "Laptop cao cap voi man hinh OLED, vo nhom va cau hinh manh cho cong viec.",
            Price = 35990000, ComparePrice = 38990000, Stock = 7, PrimaryImage = "/images/image_home_1.png",
            AverageRating = 4.6, ReviewCount = 44, SoldCount = 120, IsNew = false, IsBestSeller = false, IsFeatured = true,
            CategoryName = "Laptop", BrandName = "Dell"
        },
        new()
        {
            Id = 105, Name = "iPad Air 11 inch Wi-Fi", Slug = "ipad-air-11-inch-wifi",
            ShortDescription = "Tablet mong nhe, man hinh dep, ho tro Apple Pencil cho ghi chu va sang tao.",
            Price = 15990000, ComparePrice = 17990000, Stock = 20, PrimaryImage = PhoneFront,
            AverageRating = 4.7, ReviewCount = 52, SoldCount = 180, IsNew = true, IsBestSeller = false, IsFeatured = false,
            CategoryName = "Tablet", BrandName = "Apple"
        },
        new()
        {
            Id = 106, Name = "Sony WH-1000XM6", Slug = "sony-wh-1000xm6",
            ShortDescription = "Tai nghe chong on cao cap, chat am can bang, pin dung ca ngay.",
            Price = 8490000, ComparePrice = 9990000, Stock = 24, PrimaryImage = PhoneBack,
            AverageRating = 4.8, ReviewCount = 88, SoldCount = 310, IsNew = false, IsBestSeller = true, IsFeatured = true,
            CategoryName = "Tai nghe", BrandName = "Sony"
        },
        new()
        {
            Id = 107, Name = "Apple Watch Series 11 GPS", Slug = "apple-watch-series-11-gps",
            ShortDescription = "Dong ho thong minh theo doi suc khoe, luyen tap va thong bao hang ngay.",
            Price = 10990000, ComparePrice = 12990000, Stock = 15, PrimaryImage = PhoneFront,
            AverageRating = 4.6, ReviewCount = 61, SoldCount = 205, IsNew = true, IsBestSeller = false, IsFeatured = false,
            CategoryName = "Dong ho thong minh", BrandName = "Apple"
        },
        new()
        {
            Id = 108, Name = "Sac nhanh GaN 65W TechPro", Slug = "sac-nhanh-gan-65w-techpro",
            ShortDescription = "Cu sac nho gon, 3 cong, tuong thich dien thoai, tablet va laptop USB-C.",
            Price = 790000, ComparePrice = 990000, Stock = 60, PrimaryImage = PhoneBack,
            AverageRating = 4.5, ReviewCount = 38, SoldCount = 680, IsNew = false, IsBestSeller = true, IsFeatured = false,
            CategoryName = "Phu kien", BrandName = "Xiaomi"
        }
    };

    public static ProductDetailDto? ProductBySlug(string slug)
    {
        var item = Products().FirstOrDefault(p => p.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        if (item == null)
        {
            return null;
        }

        return new ProductDetailDto
        {
            Id = item.Id,
            Name = item.Name,
            Slug = item.Slug,
            ShortDescription = item.ShortDescription,
            Description = item.ShortDescription + " San pham demo dung de phat trien storefront khi API database chua san sang.",
            Price = item.Price,
            ComparePrice = item.ComparePrice,
            Stock = item.Stock,
            PrimaryImage = item.PrimaryImage,
            AverageRating = item.AverageRating,
            ReviewCount = item.ReviewCount,
            SoldCount = item.SoldCount,
            IsNew = item.IsNew,
            IsBestSeller = item.IsBestSeller,
            IsFeatured = item.IsFeatured,
            CategoryName = item.CategoryName,
            CategorySlug = SlugifyCategory(item.CategoryName),
            BrandName = item.BrandName,
            BrandSlug = item.BrandName.ToLowerInvariant(),
            MetaTitle = item.Name,
            MetaDescription = item.ShortDescription,
            Images = new()
            {
                new() { Id = 1, Url = item.PrimaryImage ?? PhoneFront, AltText = item.Name, IsPrimary = true },
                new() { Id = 2, Url = item.PrimaryImage == PhoneFront ? PhoneBack : PhoneFront, AltText = item.Name, SortOrder = 1 }
            },
            Specifications = SpecsFor(item.CategoryName),
            Variants = new()
            {
                new() { Id = item.Id * 10 + 1, VariantType = "Mau", VariantValue = "Den", Stock = item.Stock / 2, ColorHex = "#111827", IsActive = true },
                new() { Id = item.Id * 10 + 2, VariantType = "Mau", VariantValue = "Bac", Stock = item.Stock / 2, ColorHex = "#d1d5db", IsActive = true }
            }
        };
    }

    public static PagedResult<ProductListDto> Query(ProductQueryDto query)
    {
        var items = Products().AsEnumerable();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            items = items.Where(p => p.Name.Contains(search, StringComparison.OrdinalIgnoreCase)
                || (p.ShortDescription?.Contains(search, StringComparison.OrdinalIgnoreCase) ?? false)
                || p.BrandName.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(query.CategorySlug))
        {
            items = items.Where(p => SlugifyCategory(p.CategoryName) == query.CategorySlug);
        }

        if (!string.IsNullOrWhiteSpace(query.BrandSlug))
        {
            items = items.Where(p => p.BrandName.Equals(query.BrandSlug, StringComparison.OrdinalIgnoreCase)
                || p.BrandName.Replace(" ", "-", StringComparison.Ordinal).Equals(query.BrandSlug, StringComparison.OrdinalIgnoreCase));
        }

        if (query.MinPrice.HasValue) items = items.Where(p => p.Price >= query.MinPrice.Value);
        if (query.MaxPrice.HasValue) items = items.Where(p => p.Price <= query.MaxPrice.Value);
        if (query.InStock == true) items = items.Where(p => p.Stock > 0);

        items = query.SortBy switch
        {
            "price_asc" => items.OrderBy(p => p.Price),
            "price_desc" => items.OrderByDescending(p => p.Price),
            "rating" => items.OrderByDescending(p => p.AverageRating),
            "sold" => items.OrderByDescending(p => p.SoldCount),
            "name" => items.OrderBy(p => p.Name),
            _ => items.OrderByDescending(p => p.IsNew).ThenByDescending(p => p.Id)
        };

        var list = items.ToList();
        var pageSize = query.PageSize <= 0 ? 20 : query.PageSize;
        var page = Math.Max(1, query.Page);

        return new PagedResult<ProductListDto>
        {
            Items = list.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
            TotalCount = list.Count,
            Page = page,
            PageSize = pageSize
        };
    }

    public static List<FlashSaleDto> FlashSales() => Products()
        .Where(p => p.ComparePrice.HasValue && p.ComparePrice.Value > p.Price)
        .Take(4)
        .Select((p, index) => new FlashSaleDto
        {
            Id = index + 1,
            Product = p,
            SalePrice = p.Price,
            OriginalPrice = p.ComparePrice!.Value,
            StartTime = DateTime.UtcNow.AddHours(-2),
            EndTime = DateTime.UtcNow.AddHours(8 + index),
            Quantity = 100,
            Sold = 40 + index * 8
        })
        .ToList();

    private static List<ProductSpecDto> SpecsFor(string category) => new()
    {
        new() { SpecKey = "Bao hanh", SpecValue = "12 thang chinh hang" },
        new() { SpecKey = "Tinh trang", SpecValue = "Moi 100%" },
        new() { SpecKey = "Danh muc", SpecValue = category },
        new() { SpecKey = "Giao hang", SpecValue = "Nhanh trong 24h tai noi thanh" }
    };

    private static string SlugifyCategory(string category) => category switch
    {
        "Dien thoai" => "dien-thoai",
        "Tai nghe" => "tai-nghe",
        "Dong ho thong minh" => "dong-ho-thong-minh",
        "Phu kien" => "phu-kien",
        _ => category.ToLowerInvariant()
    };
}
