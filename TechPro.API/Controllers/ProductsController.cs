using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechPro.API.Data;
using TechPro.API.Models;
using TechPro.API.Models.DTOs;

namespace TechPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly TechProDbContext _db;

        public ProductsController(TechProDbContext db)
        {
            _db = db;
        }

        // GET /api/products?search=iphone&categorySlug=dien-thoai&page=1&pageSize=20
        [HttpGet]
        public async Task<ActionResult<PagedResult<ProductListDto>>> GetProducts([FromQuery] ProductQueryDto query)
        {
            var q = _db.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Where(p => p.IsActive);

            // Search
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.ToLower();
                q = q.Where(p => p.Name.ToLower().Contains(s) ||
                                  (p.ShortDescription != null && p.ShortDescription.ToLower().Contains(s)) ||
                                  p.Brand.Name.ToLower().Contains(s));
            }

            // Filters
            if (query.CategoryId.HasValue)
                q = q.Where(p => p.CategoryId == query.CategoryId.Value);

            if (!string.IsNullOrWhiteSpace(query.CategorySlug))
                q = q.Where(p => p.Category.Slug == query.CategorySlug);

            if (query.BrandId.HasValue)
                q = q.Where(p => p.BrandId == query.BrandId.Value);

            if (!string.IsNullOrWhiteSpace(query.BrandSlug))
                q = q.Where(p => p.Brand.Slug == query.BrandSlug);

            if (query.MinPrice.HasValue)
                q = q.Where(p => p.Price >= query.MinPrice.Value);

            if (query.MaxPrice.HasValue)
                q = q.Where(p => p.Price <= query.MaxPrice.Value);

            if (query.MinRating.HasValue)
                q = q.Where(p => p.AverageRating >= query.MinRating.Value);

            if (query.IsNew.HasValue)
                q = q.Where(p => p.IsNew == query.IsNew.Value);

            if (query.IsBestSeller.HasValue)
                q = q.Where(p => p.IsBestSeller == query.IsBestSeller.Value);

            if (query.IsFeatured.HasValue)
                q = q.Where(p => p.IsFeatured == query.IsFeatured.Value);

            if (query.InStock == true)
                q = q.Where(p => p.Stock > 0);

            // Sort
            q = query.SortBy switch
            {
                "price_asc" => q.OrderBy(p => p.Price),
                "price_desc" => q.OrderByDescending(p => p.Price),
                "rating" => q.OrderByDescending(p => p.AverageRating),
                "sold" => q.OrderByDescending(p => p.SoldCount),
                "name" => q.OrderBy(p => p.Name),
                _ => q.OrderByDescending(p => p.CreatedAt) // newest
            };

            var total = await q.CountAsync();

            var items = await q
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    ShortDescription = p.ShortDescription,
                    Price = p.Price,
                    ComparePrice = p.ComparePrice,
                    Stock = p.Stock,
                    PrimaryImage = p.Images.Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault()
                                   ?? p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
                    AverageRating = p.AverageRating,
                    ReviewCount = p.ReviewCount,
                    SoldCount = p.SoldCount,
                    IsNew = p.IsNew,
                    IsBestSeller = p.IsBestSeller,
                    IsFeatured = p.IsFeatured,
                    CategoryName = p.Category.Name,
                    BrandName = p.Brand.Name,
                    BrandLogo = p.Brand.LogoUrl
                })
                .ToListAsync();

            return Ok(new PagedResult<ProductListDto>
            {
                Items = items,
                TotalCount = total,
                Page = query.Page,
                PageSize = query.PageSize
            });
        }

        // GET /api/products/featured
        [HttpGet("featured")]
        public async Task<ActionResult<List<ProductListDto>>> GetFeatured([FromQuery] int limit = 8)
        {
            var items = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.IsFeatured)
                .OrderByDescending(p => p.SoldCount)
                .Take(limit)
                .Select(p => MapToListDto(p))
                .ToListAsync();

            return Ok(items);
        }

        // GET /api/products/bestsellers
        [HttpGet("bestsellers")]
        public async Task<ActionResult<List<ProductListDto>>> GetBestSellers([FromQuery] int limit = 8)
        {
            var items = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.IsBestSeller)
                .OrderByDescending(p => p.SoldCount)
                .Take(limit)
                .Select(p => MapToListDto(p))
                .ToListAsync();

            return Ok(items);
        }

        // GET /api/products/new-arrivals
        [HttpGet("new-arrivals")]
        public async Task<ActionResult<List<ProductListDto>>> GetNewArrivals([FromQuery] int limit = 8)
        {
            var items = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.IsNew)
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .Select(p => MapToListDto(p))
                .ToListAsync();

            return Ok(items);
        }

        // GET /api/products/{slug}
        [HttpGet("{slug}")]
        public async Task<ActionResult<ProductDetailDto>> GetBySlug(string slug)
        {
            var p = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images.OrderBy(i => i.SortOrder))
                .Include(p => p.Specifications.OrderBy(s => s.SortOrder))
                .Include(p => p.Variants.Where(v => v.IsActive).OrderBy(v => v.SortOrder))
                .Include(p => p.Reviews.Where(r => r.IsApproved).OrderByDescending(r => r.CreatedAt))
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

            if (p == null) return NotFound();

            // Increment view count
            p.ViewCount++;
            await _db.SaveChangesAsync();

            return Ok(new ProductDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ShortDescription = p.ShortDescription,
                Description = p.Description,
                Price = p.Price,
                ComparePrice = p.ComparePrice,
                Stock = p.Stock,
                Sku = p.Sku,
                AverageRating = p.AverageRating,
                ReviewCount = p.ReviewCount,
                SoldCount = p.SoldCount,
                ViewCount = p.ViewCount,
                IsNew = p.IsNew,
                IsBestSeller = p.IsBestSeller,
                IsFeatured = p.IsFeatured,
                CategoryName = p.Category.Name,
                CategoryId = p.CategoryId,
                CategorySlug = p.Category.Slug,
                BrandName = p.Brand.Name,
                BrandId = p.BrandId,
                BrandSlug = p.Brand.Slug,
                BrandLogo = p.Brand.LogoUrl,
                MetaTitle = p.MetaTitle ?? p.Name,
                MetaDescription = p.MetaDescription ?? p.ShortDescription,
                Images = p.Images.Select(i => new ProductImageDto
                {
                    Id = i.Id, Url = i.Url, AltText = i.AltText,
                    IsPrimary = i.IsPrimary, SortOrder = i.SortOrder
                }).ToList(),
                Specifications = p.Specifications.Select(s => new ProductSpecDto
                {
                    SpecKey = s.SpecKey, SpecValue = s.SpecValue,
                    GroupName = s.GroupName, SortOrder = s.SortOrder
                }).ToList(),
                Variants = p.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id, VariantType = v.VariantType, VariantValue = v.VariantValue,
                    PriceModifier = v.PriceModifier, Stock = v.Stock, Sku = v.Sku,
                    ColorHex = v.ColorHex, IsActive = v.IsActive
                }).ToList(),
                RecentReviews = p.Reviews.Take(5).Select(r => new ProductReviewDto
                {
                    Id = r.Id,
                    UserName = r.User.TenDayDu,
                    UserAvatar = r.User.AvatarUrl,
                    Rating = r.Rating,
                    Title = r.Title,
                    Body = r.Body,
                    Pros = r.Pros,
                    Cons = r.Cons,
                    VerifiedPurchase = r.VerifiedPurchase,
                    HelpfulCount = r.HelpfulCount,
                    CreatedAt = r.CreatedAt
                }).ToList()
            });
        }

        // GET /api/products/{id}/related
        [HttpGet("{id:int}/related")]
        public async Task<ActionResult<List<ProductListDto>>> GetRelated(int id, [FromQuery] int limit = 6)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            var related = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.Id != id &&
                            (p.CategoryId == product.CategoryId || p.BrandId == product.BrandId))
                .OrderByDescending(p => p.SoldCount)
                .Take(limit)
                .Select(p => MapToListDto(p))
                .ToListAsync();

            return Ok(related);
        }

        // POST /api/products (Admin only)
        [HttpPost]
        [Authorize(Roles = "SystemAdmin,StoreAdmin")]
        public async Task<ActionResult<ProductDetailDto>> Create([FromBody] CreateProductDto dto)
        {
            // Generate unique slug
            var slug = await GenerateSlug(dto.Name);

            var product = new Product
            {
                Name = dto.Name,
                Slug = slug,
                ShortDescription = dto.ShortDescription,
                Description = dto.Description,
                Price = dto.Price,
                ComparePrice = dto.ComparePrice,
                CostPrice = dto.CostPrice,
                Stock = dto.Stock,
                Sku = dto.Sku,
                CategoryId = dto.CategoryId,
                BrandId = dto.BrandId,
                IsActive = dto.IsActive,
                IsFeatured = dto.IsFeatured,
                IsNew = dto.IsNew,
                MetaTitle = dto.MetaTitle,
                MetaDescription = dto.MetaDescription,
                WeightKg = dto.WeightKg,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            // Add images
            if (dto.Images.Any())
            {
                foreach (var (img, idx) in dto.Images.Select((i, idx) => (i, idx)))
                {
                    _db.ProductImages.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        Url = img.Url,
                        AltText = img.AltText,
                        IsPrimary = idx == 0,
                        SortOrder = idx
                    });
                }
            }

            // Add specifications
            foreach (var (spec, idx) in dto.Specifications.Select((s, idx) => (s, idx)))
            {
                _db.ProductSpecifications.Add(new ProductSpecification
                {
                    ProductId = product.Id,
                    SpecKey = spec.SpecKey,
                    SpecValue = spec.SpecValue,
                    GroupName = spec.GroupName,
                    SortOrder = idx
                });
            }

            // Add variants
            foreach (var (v, idx) in dto.Variants.Select((v, idx) => (v, idx)))
            {
                _db.ProductVariants.Add(new ProductVariant
                {
                    ProductId = product.Id,
                    VariantType = v.VariantType,
                    VariantValue = v.VariantValue,
                    PriceModifier = v.PriceModifier,
                    Stock = v.Stock,
                    Sku = v.Sku,
                    ColorHex = v.ColorHex,
                    SortOrder = idx
                });
            }

            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBySlug), new { slug = product.Slug }, new { id = product.Id, slug = product.Slug });
        }

        // PUT /api/products/{id} (Admin only)
        [HttpPut("{id:int}")]
        [Authorize(Roles = "SystemAdmin,StoreAdmin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.ShortDescription = dto.ShortDescription;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.ComparePrice = dto.ComparePrice;
            product.CostPrice = dto.CostPrice;
            product.Stock = dto.Stock;
            product.Sku = dto.Sku;
            product.CategoryId = dto.CategoryId;
            product.BrandId = dto.BrandId;
            product.IsActive = dto.IsActive;
            product.IsFeatured = dto.IsFeatured;
            product.IsNew = dto.IsNew;
            product.MetaTitle = dto.MetaTitle;
            product.MetaDescription = dto.MetaDescription;
            product.WeightKg = dto.WeightKg;
            product.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE /api/products/{id} (Admin only)
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.IsActive = false; // Soft delete
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ─── Helpers ──────────────────────────────────────────────────

        private async Task<string> GenerateSlug(string name)
        {
            var slug = name.ToLower()
                .Replace(" ", "-")
                .Replace("đ", "d")
                .Replace("á", "a").Replace("à", "a").Replace("ã", "a").Replace("ả", "a").Replace("ạ", "a")
                .Replace("ă", "a").Replace("ắ", "a").Replace("ặ", "a").Replace("ằ", "a").Replace("ẵ", "a").Replace("ẳ", "a")
                .Replace("â", "a").Replace("ấ", "a").Replace("ậ", "a").Replace("ầ", "a").Replace("ẫ", "a").Replace("ẩ", "a")
                .Replace("é", "e").Replace("è", "e").Replace("ẹ", "e").Replace("ẻ", "e").Replace("ẽ", "e")
                .Replace("ê", "e").Replace("ế", "e").Replace("ệ", "e").Replace("ề", "e").Replace("ễ", "e").Replace("ể", "e")
                .Replace("í", "i").Replace("ì", "i").Replace("ị", "i").Replace("ỉ", "i").Replace("ĩ", "i")
                .Replace("ó", "o").Replace("ò", "o").Replace("ọ", "o").Replace("ỏ", "o").Replace("õ", "o")
                .Replace("ô", "o").Replace("ố", "o").Replace("ộ", "o").Replace("ồ", "o").Replace("ỗ", "o").Replace("ổ", "o")
                .Replace("ơ", "o").Replace("ớ", "o").Replace("ợ", "o").Replace("ờ", "o").Replace("ỡ", "o").Replace("ở", "o")
                .Replace("ú", "u").Replace("ù", "u").Replace("ụ", "u").Replace("ủ", "u").Replace("ũ", "u")
                .Replace("ư", "u").Replace("ứ", "u").Replace("ự", "u").Replace("ừ", "u").Replace("ữ", "u").Replace("ử", "u")
                .Replace("ý", "y").Replace("ỳ", "y").Replace("ỵ", "y").Replace("ỷ", "y").Replace("ỹ", "y");

            // Remove non-alphanumeric except hyphens
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\-+", "-").Trim('-');

            // Ensure unique
            var baseSlug = slug;
            var counter = 1;
            while (await _db.Products.AnyAsync(p => p.Slug == slug))
            {
                slug = $"{baseSlug}-{counter++}";
            }

            return slug;
        }

        private static ProductListDto MapToListDto(Product p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            ShortDescription = p.ShortDescription,
            Price = p.Price,
            ComparePrice = p.ComparePrice,
            Stock = p.Stock,
            PrimaryImage = p.Images.Where(i => i.IsPrimary).Select(i => i.Url).FirstOrDefault()
                           ?? p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).FirstOrDefault(),
            AverageRating = p.AverageRating,
            ReviewCount = p.ReviewCount,
            SoldCount = p.SoldCount,
            IsNew = p.IsNew,
            IsBestSeller = p.IsBestSeller,
            IsFeatured = p.IsFeatured,
            CategoryName = p.Category.Name,
            BrandName = p.Brand.Name,
            BrandLogo = p.Brand.LogoUrl
        };
    }
}
