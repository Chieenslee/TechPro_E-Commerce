using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechPro.API.Data;
using TechPro.API.Models.DTOs;

namespace TechPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly TechProDbContext _db;

        public CategoriesController(TechProDbContext db) => _db = db;

        // GET /api/categories
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetAll([FromQuery] bool rootOnly = false)
        {
            var query = _db.ProductCategories
                .Include(c => c.Children)
                .Where(c => c.IsActive);

            if (rootOnly)
                query = query.Where(c => c.ParentId == null);

            var cats = await query.OrderBy(c => c.SortOrder).ToListAsync();

            // Get product counts
            var counts = await _db.Products
                .Where(p => p.IsActive)
                .GroupBy(p => p.CategoryId)
                .Select(g => new { CategoryId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.CategoryId, x => x.Count);

            return Ok(cats.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Icon = c.Icon,
                ImageUrl = c.ImageUrl,
                ParentId = c.ParentId,
                ProductCount = counts.GetValueOrDefault(c.Id, 0),
                Children = c.Children.Where(ch => ch.IsActive).Select(ch => new CategoryDto
                {
                    Id = ch.Id,
                    Name = ch.Name,
                    Slug = ch.Slug,
                    Icon = ch.Icon,
                    ImageUrl = ch.ImageUrl,
                    ParentId = ch.ParentId,
                    ProductCount = counts.GetValueOrDefault(ch.Id, 0)
                }).ToList()
            }));
        }

        // GET /api/categories/{slug}
        [HttpGet("{slug}")]
        public async Task<ActionResult<CategoryDto>> GetBySlug(string slug)
        {
            var cat = await _db.ProductCategories
                .Include(c => c.Children)
                .Include(c => c.Parent)
                .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);

            if (cat == null) return NotFound();

            var count = await _db.Products.CountAsync(p => p.IsActive && p.CategoryId == cat.Id);

            return Ok(new CategoryDto
            {
                Id = cat.Id,
                Name = cat.Name,
                Slug = cat.Slug,
                Description = cat.Description,
                Icon = cat.Icon,
                ImageUrl = cat.ImageUrl,
                ParentId = cat.ParentId,
                ProductCount = count,
                Children = cat.Children.Where(c => c.IsActive).Select(c => new CategoryDto
                {
                    Id = c.Id, Name = c.Name, Slug = c.Slug, Icon = c.Icon
                }).ToList()
            });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly TechProDbContext _db;

        public BrandsController(TechProDbContext db) => _db = db;

        // GET /api/brands
        [HttpGet]
        public async Task<ActionResult<List<BrandDto>>> GetAll()
        {
            var counts = await _db.Products
                .Where(p => p.IsActive)
                .GroupBy(p => p.BrandId)
                .Select(g => new { BrandId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.BrandId, x => x.Count);

            var brands = await _db.ProductBrands
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .ThenBy(b => b.Name)
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Slug = b.Slug,
                    LogoUrl = b.LogoUrl,
                    Country = b.Country,
                    ProductCount = counts.GetValueOrDefault(b.Id, 0)
                })
                .ToListAsync();

            return Ok(brands);
        }

        // GET /api/brands/{slug}
        [HttpGet("{slug}")]
        public async Task<ActionResult<BrandDto>> GetBySlug(string slug)
        {
            var brand = await _db.ProductBrands.FirstOrDefaultAsync(b => b.Slug == slug && b.IsActive);
            if (brand == null) return NotFound();

            var count = await _db.Products.CountAsync(p => p.IsActive && p.BrandId == brand.Id);

            return Ok(new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Slug = brand.Slug,
                LogoUrl = brand.LogoUrl,
                Country = brand.Country,
                ProductCount = count
            });
        }
    }
}
