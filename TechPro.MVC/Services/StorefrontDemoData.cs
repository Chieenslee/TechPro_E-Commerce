using TechPro.Models.DTOs;

namespace TechPro.Services;

public static class StorefrontDemoData
{
    private const string PhoneFront = "/images/demo_devices/phone_front.jpg";
    private const string PhoneBack = "/images/demo_devices/phone_back.jpg";

    public static List<CategoryDto> Categories() => new()
    {
        new() { Id = 1, Name = "Dien thoai", Slug = "dien-thoai", Icon = "phone", ProductCount = 9 },
        new() { Id = 2, Name = "Laptop", Slug = "laptop", Icon = "laptop", ProductCount = 7 },
        new() { Id = 3, Name = "Tablet", Slug = "tablet", Icon = "tablet", ProductCount = 3 },
        new() { Id = 4, Name = "Tai nghe", Slug = "tai-nghe", Icon = "headphones", ProductCount = 4 },
        new() { Id = 5, Name = "Dong ho thong minh", Slug = "dong-ho-thong-minh", Icon = "smartwatch", ProductCount = 3 },
        new() { Id = 6, Name = "Phu kien", Slug = "phu-kien", Icon = "bag", ProductCount = 8 },
        new() { Id = 7, Name = "Man hinh", Slug = "man-hinh", Icon = "display", ProductCount = 2 },
        new() { Id = 8, Name = "Gia dung", Slug = "gia-dung", Icon = "house-gear", ProductCount = 4 }
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
        P(101, "iPhone 16 Pro Max 256GB", "iphone-16-pro-max-256gb", "Dien thoai", "Apple", 30990000, 34990000, 1, 4.9, 246, 1280, true, true, true),
        P(102, "iPhone 15 Pro 128GB", "iphone-15-pro-128gb", "Dien thoai", "Apple", 22990000, 26990000, 2, 4.8, 188, 980, false, true, true),
        P(103, "Samsung Galaxy S25 Ultra 5G", "samsung-galaxy-s25-ultra-5g", "Dien thoai", "Samsung", 26990000, 30990000, 3, 4.8, 162, 870, true, true, true),
        P(104, "Samsung Galaxy Z Fold 6", "samsung-galaxy-z-fold-6", "Dien thoai", "Samsung", 37990000, 41990000, 4, 4.7, 96, 410, true, false, true),
        P(105, "Xiaomi 15 Ultra 5G", "xiaomi-15-ultra-5g", "Dien thoai", "Xiaomi", 21990000, 24990000, 5, 4.6, 88, 530, true, false, true),
        P(106, "OPPO Reno 13 Pro", "oppo-reno-13-pro", "Dien thoai", "OPPO", 13990000, 15990000, 1, 4.6, 74, 620, false, true, false),
        P(107, "vivo V50 5G", "vivo-v50-5g", "Dien thoai", "vivo", 11990000, 13990000, 2, 4.5, 59, 410, false, false, false),
        P(108, "realme GT Neo 7", "realme-gt-neo-7", "Dien thoai", "realme", 9990000, 11990000, 3, 4.5, 63, 720, false, true, false),
        P(109, "iPad Air M3 11 inch Wi-Fi", "ipad-air-m3-11-inch-wifi", "Tablet", "Apple", 15990000, 17990000, 6, 4.8, 82, 390, true, false, true),
        P(110, "Samsung Galaxy Tab S10 Plus", "samsung-galaxy-tab-s10-plus", "Tablet", "Samsung", 20990000, 23990000, 7, 4.7, 66, 250, true, false, true),
        P(111, "Xiaomi Pad 7 Pro", "xiaomi-pad-7-pro", "Tablet", "Xiaomi", 10990000, 12990000, 6, 4.5, 41, 310, false, false, false),
        P(112, "MacBook Air M4 13 inch", "macbook-air-m4-13-inch", "Laptop", "Apple", 27990000, 30990000, 8, 4.9, 144, 680, true, true, true),
        P(113, "MacBook Pro M4 Pro 14 inch", "macbook-pro-m4-pro-14-inch", "Laptop", "Apple", 49990000, 54990000, 9, 4.9, 96, 360, true, false, true),
        P(114, "Dell XPS 14 OLED", "dell-xps-14-oled", "Laptop", "Dell", 35990000, 39990000, 10, 4.7, 82, 290, false, false, true),
        P(115, "ASUS Zenbook 14 OLED", "asus-zenbook-14-oled", "Laptop", "ASUS", 23990000, 26990000, 6, 4.7, 115, 570, false, true, true),
        P(116, "Lenovo Legion Slim 5", "lenovo-legion-slim-5", "Laptop", "Lenovo", 32990000, 36990000, 7, 4.6, 73, 430, false, true, false),
        P(117, "Acer Swift Go 14 AI", "acer-swift-go-14-ai", "Laptop", "Acer", 18990000, 21990000, 8, 4.5, 54, 340, true, false, false),
        P(118, "HP Pavilion Plus 14", "hp-pavilion-plus-14", "Laptop", "HP", 20990000, 23990000, 9, 4.5, 62, 330, false, false, false),
        P(119, "Sony WH-1000XM6", "sony-wh-1000xm6", "Tai nghe", "Sony", 8490000, 9990000, 11, 4.8, 201, 960, true, true, true),
        P(120, "AirPods Pro 3 USB-C", "airpods-pro-3-usb-c", "Tai nghe", "Apple", 5990000, 6990000, 12, 4.8, 176, 1180, true, true, true),
        P(121, "JBL Tune 770NC", "jbl-tune-770nc", "Tai nghe", "JBL", 2290000, 2990000, 13, 4.5, 80, 740, false, true, false),
        P(122, "Samsung Galaxy Buds 3 Pro", "samsung-galaxy-buds-3-pro", "Tai nghe", "Samsung", 3990000, 4990000, 14, 4.6, 92, 690, false, false, false),
        P(123, "Apple Watch Series 11 GPS", "apple-watch-series-11-gps", "Dong ho thong minh", "Apple", 10990000, 12990000, 16, 4.7, 108, 520, true, false, true),
        P(124, "Samsung Galaxy Watch 8", "samsung-galaxy-watch-8", "Dong ho thong minh", "Samsung", 7990000, 9490000, 17, 4.6, 69, 420, true, false, false),
        P(125, "Huawei Watch GT 5 Pro", "huawei-watch-gt-5-pro", "Dong ho thong minh", "Huawei", 6990000, 8490000, 18, 4.5, 73, 390, false, false, false),
        P(126, "Sac nhanh GaN 65W TechPro", "sac-nhanh-gan-65w-techpro", "Phu kien", "Xiaomi", 790000, 990000, 19, 4.5, 49, 1320, false, true, false),
        P(127, "Pin sac du phong 20000mAh", "pin-sac-du-phong-20000mah", "Phu kien", "Anker", 1190000, 1490000, 20, 4.6, 88, 980, false, true, false),
        P(128, "Ban phim co Keychron K3", "ban-phim-co-keychron-k3", "Phu kien", "Keychron", 2290000, 2790000, 21, 4.7, 52, 340, false, false, false),
        P(129, "Chuot Logitech MX Master 4", "chuot-logitech-mx-master-4", "Phu kien", "Logitech", 2490000, 2990000, 22, 4.8, 117, 650, true, true, false),
        P(130, "Man hinh LG UltraWide 29 inch", "man-hinh-lg-ultrawide-29-inch", "Man hinh", "LG", 5990000, 6990000, 24, 4.5, 45, 260, false, false, true),
        P(131, "Smart TV Samsung Crystal 55 inch", "smart-tv-samsung-crystal-55-inch", "Gia dung", "Samsung", 11990000, 14990000, 25, 4.6, 82, 480, false, true, true),
        P(132, "May loc khong khi Xiaomi Pro", "may-loc-khong-khi-xiaomi-pro", "Gia dung", "Xiaomi", 3990000, 4990000, 27, 4.5, 76, 520, false, false, false),
        P(133, "May in Canon Pixma Wi-Fi", "may-in-canon-pixma-wi-fi", "Phu kien", "Canon", 2990000, 3490000, 29, 4.4, 39, 240, false, false, false),
        P(134, "SSD Samsung 990 EVO 1TB", "ssd-samsung-990-evo-1tb", "Phu kien", "Samsung", 2490000, 3190000, 30, 4.8, 135, 870, true, true, false)
    };

    private static ProductListDto P(
        int id,
        string name,
        string slug,
        string category,
        string brand,
        decimal price,
        decimal comparePrice,
        int imageNo,
        double rating,
        int reviews,
        int sold,
        bool isNew,
        bool isBestSeller,
        bool isFeatured)
    {
        return new ProductListDto
        {
            Id = id,
            Name = name,
            Slug = slug,
            ShortDescription = $"{name} chinh hang, bao hanh ro rang, giao nhanh va ho tro tra gop.",
            Price = price,
            ComparePrice = comparePrice,
            Stock = 15 + (id % 40),
            PrimaryImage = $"/images/products/product-{imageNo:00}.jpg",
            AverageRating = rating,
            ReviewCount = reviews,
            SoldCount = sold,
            IsNew = isNew,
            IsBestSeller = isBestSeller,
            IsFeatured = isFeatured,
            CategoryName = category,
            BrandName = brand
        };
    }

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
