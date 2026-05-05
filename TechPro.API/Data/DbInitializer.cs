using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TechPro.API.Models;

namespace TechPro.API.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(UserManager<NguoiDung> userManager, RoleManager<IdentityRole> roleManager, TechProDbContext context)
        {
            // 1. Roles
            string[] roles = { "SystemAdmin", "StoreAdmin", "Technician", "Support", "Storekeeper", "Customer" };
            foreach (var r in roles)
                if (!await roleManager.RoleExistsAsync(r))
                    await roleManager.CreateAsync(new IdentityRole(r));

            // 2. Admin user
            if (await userManager.FindByEmailAsync("admin@techpro.com") == null)
            {
                var admin = new NguoiDung { UserName = "admin@techpro.com", Email = "admin@techpro.com", TenDayDu = "TechPro Admin", EmailConfirmed = true };
                var r = await userManager.CreateAsync(admin, "Admin@123");
                if (r.Succeeded) await userManager.AddToRoleAsync(admin, "SystemAdmin");
            }

            // 3. Demo customer
            if (await userManager.FindByEmailAsync("customer@techpro.com") == null)
            {
                var cust = new NguoiDung { UserName = "customer@techpro.com", Email = "customer@techpro.com", TenDayDu = "Nguyễn Văn A", EmailConfirmed = true };
                var r = await userManager.CreateAsync(cust, "Customer@123");
                if (r.Succeeded) await userManager.AddToRoleAsync(cust, "Customer");
            }

            // 4. Brands
            if (!await context.ProductBrands.AnyAsync())
            {
                var brands = new List<ProductBrand>
                {
                    new() { Name = "Apple", Slug = "apple", Country = "USA", LogoUrl = "/images/brands/apple.svg", SortOrder = 1 },
                    new() { Name = "Samsung", Slug = "samsung", Country = "South Korea", LogoUrl = "/images/brands/samsung.svg", SortOrder = 2 },
                    new() { Name = "Sony", Slug = "sony", Country = "Japan", LogoUrl = "/images/brands/sony.svg", SortOrder = 3 },
                    new() { Name = "Dell", Slug = "dell", Country = "USA", LogoUrl = "/images/brands/dell.svg", SortOrder = 4 },
                    new() { Name = "ASUS", Slug = "asus", Country = "Taiwan", LogoUrl = "/images/brands/asus.svg", SortOrder = 5 },
                    new() { Name = "LG", Slug = "lg", Country = "South Korea", LogoUrl = "/images/brands/lg.svg", SortOrder = 6 },
                };
                context.ProductBrands.AddRange(brands);
                await context.SaveChangesAsync();
            }

            // 5. Categories
            if (!await context.ProductCategories.AnyAsync())
            {
                var cats = new List<ProductCategory>
                {
                    new() { Name = "Điện Thoại", Slug = "dien-thoai", Icon = "bi bi-phone", SortOrder = 1 },
                    new() { Name = "Laptop", Slug = "laptop", Icon = "bi bi-laptop", SortOrder = 2 },
                    new() { Name = "Tablet", Slug = "tablet", Icon = "bi bi-tablet", SortOrder = 3 },
                    new() { Name = "Tai Nghe", Slug = "tai-nghe", Icon = "bi bi-headphones", SortOrder = 4 },
                    new() { Name = "Đồng Hồ Thông Minh", Slug = "dong-ho-thong-minh", Icon = "bi bi-smartwatch", SortOrder = 5 },
                    new() { Name = "Phụ Kiện", Slug = "phu-kien", Icon = "bi bi-bag", SortOrder = 6 },
                };
                context.ProductCategories.AddRange(cats);
                await context.SaveChangesAsync();
            }

            // 6. Products (if not seeded yet)
            if (!await context.Products.AnyAsync())
            {
                var brands = await context.ProductBrands.ToDictionaryAsync(b => b.Slug, b => b.Id);
                var cats = await context.ProductCategories.ToDictionaryAsync(c => c.Slug, c => c.Id);

                var products = new List<Product>
                {
                    new() { Name = "iPhone 15 Pro Max", Slug = "iphone-15-pro-max", ShortDescription = "Chip A17 Pro, Camera 48MP, Titanium", Price = 34990000, ComparePrice = 38990000, Stock = 50, CategoryId = cats["dien-thoai"], BrandId = brands["apple"], IsFeatured = true, IsBestSeller = true, IsNew = true, AverageRating = 4.9, ReviewCount = 312, SoldCount = 1240 },
                    new() { Name = "iPhone 15", Slug = "iphone-15", ShortDescription = "Chip A16, Dynamic Island, USB-C", Price = 22990000, ComparePrice = 24990000, Stock = 80, CategoryId = cats["dien-thoai"], BrandId = brands["apple"], IsFeatured = true, IsBestSeller = true, AverageRating = 4.8, ReviewCount = 528, SoldCount = 2100 },
                    new() { Name = "Samsung Galaxy S24 Ultra", Slug = "samsung-galaxy-s24-ultra", ShortDescription = "Snapdragon 8 Gen 3, S Pen, Camera 200MP", Price = 31990000, ComparePrice = 35990000, Stock = 45, CategoryId = cats["dien-thoai"], BrandId = brands["samsung"], IsFeatured = true, IsNew = true, AverageRating = 4.8, ReviewCount = 204, SoldCount = 890 },
                    new() { Name = "Samsung Galaxy S24+", Slug = "samsung-galaxy-s24-plus", ShortDescription = "Snapdragon 8 Gen 3, 6.7 inch, 50MP", Price = 24990000, ComparePrice = 27990000, Stock = 60, CategoryId = cats["dien-thoai"], BrandId = brands["samsung"], IsBestSeller = true, AverageRating = 4.7, ReviewCount = 167, SoldCount = 734 },
                    new() { Name = "MacBook Pro 14\" M3 Pro", Slug = "macbook-pro-14-m3-pro", ShortDescription = "Apple M3 Pro, 18GB RAM, 512GB SSD, Liquid Retina XDR", Price = 52990000, ComparePrice = 57990000, Stock = 25, CategoryId = cats["laptop"], BrandId = brands["apple"], IsFeatured = true, IsBestSeller = true, IsNew = true, AverageRating = 4.9, ReviewCount = 98, SoldCount = 342 },
                    new() { Name = "MacBook Air M2", Slug = "macbook-air-m2", ShortDescription = "Apple M2, 8GB RAM, 256GB SSD, thiết kế siêu mỏng", Price = 28990000, ComparePrice = 31990000, Stock = 40, CategoryId = cats["laptop"], BrandId = brands["apple"], IsFeatured = true, AverageRating = 4.8, ReviewCount = 215, SoldCount = 876 },
                    new() { Name = "Dell XPS 15 OLED", Slug = "dell-xps-15-oled", ShortDescription = "Intel Core i7-13700H, 16GB, 512GB, OLED 3.5K", Price = 45990000, ComparePrice = 49990000, Stock = 15, CategoryId = cats["laptop"], BrandId = brands["dell"], IsNew = true, AverageRating = 4.7, ReviewCount = 54, SoldCount = 128 },
                    new() { Name = "ASUS ROG Zephyrus G14", Slug = "asus-rog-zephyrus-g14", ShortDescription = "AMD Ryzen 9, RTX 4060, 16GB, 1TB, 144Hz", Price = 38990000, ComparePrice = 42990000, Stock = 20, CategoryId = cats["laptop"], BrandId = brands["asus"], IsFeatured = true, AverageRating = 4.8, ReviewCount = 87, SoldCount = 267 },
                    new() { Name = "iPad Pro M4 11\"", Slug = "ipad-pro-m4-11", ShortDescription = "Apple M4, OLED, 256GB, Wi-Fi + 5G", Price = 27990000, ComparePrice = 30990000, Stock = 35, CategoryId = cats["tablet"], BrandId = brands["apple"], IsFeatured = true, IsNew = true, AverageRating = 4.9, ReviewCount = 76, SoldCount = 310 },
                    new() { Name = "Samsung Galaxy Tab S9+", Slug = "samsung-galaxy-tab-s9-plus", ShortDescription = "Snapdragon 8 Gen 2, AMOLED 12.4\", S Pen", Price = 21990000, ComparePrice = 24990000, Stock = 28, CategoryId = cats["tablet"], BrandId = brands["samsung"], AverageRating = 4.7, ReviewCount = 63, SoldCount = 189 },
                    new() { Name = "Sony WH-1000XM5", Slug = "sony-wh-1000xm5", ShortDescription = "Chống ồn tốt nhất thế giới, 30 giờ pin, LDAC", Price = 8490000, ComparePrice = 9990000, Stock = 100, CategoryId = cats["tai-nghe"], BrandId = brands["sony"], IsFeatured = true, IsBestSeller = true, AverageRating = 4.9, ReviewCount = 445, SoldCount = 1820 },
                    new() { Name = "Apple AirPods Pro 2", Slug = "airpods-pro-2", ShortDescription = "ANC, Adaptive Audio, MagSafe, USB-C", Price = 6490000, ComparePrice = 7490000, Stock = 120, CategoryId = cats["tai-nghe"], BrandId = brands["apple"], IsBestSeller = true, AverageRating = 4.8, ReviewCount = 389, SoldCount = 1540 },
                    new() { Name = "Apple Watch Series 9", Slug = "apple-watch-series-9", ShortDescription = "Chip S9, Double Tap, Always-On Retina, GPS", Price = 11990000, ComparePrice = 13490000, Stock = 60, CategoryId = cats["dong-ho-thong-minh"], BrandId = brands["apple"], IsFeatured = true, IsNew = true, AverageRating = 4.8, ReviewCount = 201, SoldCount = 678 },
                    new() { Name = "Samsung Galaxy Watch 6 Classic", Slug = "samsung-galaxy-watch-6-classic", ShortDescription = "Bezel quay, 43mm, BioActive Sensor, 2 ngày pin", Price = 8990000, ComparePrice = 10490000, Stock = 45, CategoryId = cats["dong-ho-thong-minh"], BrandId = brands["samsung"], AverageRating = 4.6, ReviewCount = 124, SoldCount = 412 },
                    new() { Name = "Apple MagSafe Charger", Slug = "apple-magsafe-charger", ShortDescription = "15W sạc nhanh không dây cho iPhone 12 trở lên", Price = 890000, ComparePrice = 1190000, Stock = 200, CategoryId = cats["phu-kien"], BrandId = brands["apple"], IsBestSeller = true, AverageRating = 4.5, ReviewCount = 632, SoldCount = 3200 },
                    new() { Name = "Sony WF-1000XM5", Slug = "sony-wf-1000xm5", ShortDescription = "TWS chống ồn, LDAC Hi-Res, 8 giờ pin", Price = 6290000, ComparePrice = 7490000, Stock = 75, CategoryId = cats["tai-nghe"], BrandId = brands["sony"], IsNew = true, AverageRating = 4.8, ReviewCount = 178, SoldCount = 520 },
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();

                // Add images & specs for first product (iPhone 15 Pro Max) as example
                var p1 = await context.Products.FirstAsync(p => p.Slug == "iphone-15-pro-max");
                context.ProductImages.AddRange(
                    new ProductImage { ProductId = p1.Id, Url = "https://cdn.techpro.vn/iphone15promax-black.webp", AltText = "iPhone 15 Pro Max Black Titanium", IsPrimary = true, SortOrder = 0 },
                    new ProductImage { ProductId = p1.Id, Url = "https://cdn.techpro.vn/iphone15promax-natural.webp", AltText = "iPhone 15 Pro Max Natural Titanium", SortOrder = 1 }
                );
                context.ProductVariants.AddRange(
                    new ProductVariant { ProductId = p1.Id, VariantType = "Storage", VariantValue = "256GB", PriceModifier = 0, Stock = 20, ColorHex = "#1C1C1E", SortOrder = 0 },
                    new ProductVariant { ProductId = p1.Id, VariantType = "Storage", VariantValue = "512GB", PriceModifier = 3000000, Stock = 20, SortOrder = 1 },
                    new ProductVariant { ProductId = p1.Id, VariantType = "Storage", VariantValue = "1TB", PriceModifier = 7000000, Stock = 10, SortOrder = 2 }
                );
                context.ProductSpecifications.AddRange(
                    new ProductSpecification { ProductId = p1.Id, SpecKey = "Chip", SpecValue = "Apple A17 Pro", GroupName = "Hiệu năng", SortOrder = 0 },
                    new ProductSpecification { ProductId = p1.Id, SpecKey = "RAM", SpecValue = "8GB", GroupName = "Hiệu năng", SortOrder = 1 },
                    new ProductSpecification { ProductId = p1.Id, SpecKey = "Màn hình", SpecValue = "6.7\" Super Retina XDR ProMotion 120Hz", GroupName = "Màn hình", SortOrder = 2 },
                    new ProductSpecification { ProductId = p1.Id, SpecKey = "Camera sau", SpecValue = "48MP + 12MP + 12MP (Telephoto 5x)", GroupName = "Camera", SortOrder = 3 },
                    new ProductSpecification { ProductId = p1.Id, SpecKey = "Pin", SpecValue = "4422 mAh, sạc 27W", GroupName = "Pin", SortOrder = 4 },
                    new ProductSpecification { ProductId = p1.Id, SpecKey = "Chất liệu", SpecValue = "Titanium Grade 5", GroupName = "Thiết kế", SortOrder = 5 }
                );

                // Flash sale: iPhone 15 với giá giảm
                var iphone15 = await context.Products.FirstAsync(p => p.Slug == "iphone-15");
                context.FlashSales.Add(new FlashSale
                {
                    ProductId = iphone15.Id,
                    SalePrice = 19990000,
                    StartTime = DateTime.UtcNow.AddMinutes(-30),
                    EndTime = DateTime.UtcNow.AddHours(6),
                    Quantity = 30,
                    Sold = 8,
                    IsActive = true
                });

                await context.SaveChangesAsync();
            }
        }
    }
}
