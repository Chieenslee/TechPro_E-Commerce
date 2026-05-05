using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(300)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(350)]
        public string Slug { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; } // HTML rich content

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ComparePrice { get; set; } // Original price (for showing discount)

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CostPrice { get; set; }

        public int Stock { get; set; } = 0;

        [StringLength(100)]
        public string? Sku { get; set; }

        [StringLength(100)]
        public string? Barcode { get; set; }

        // Foreign keys
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual ProductCategory Category { get; set; } = null!;

        public int BrandId { get; set; }

        [ForeignKey("BrandId")]
        public virtual ProductBrand Brand { get; set; } = null!;

        // Status
        public bool IsActive { get; set; } = true;

        public bool IsFeatured { get; set; } = false;

        public bool IsNew { get; set; } = false;

        public bool IsBestSeller { get; set; } = false;

        // Ratings (denormalized for performance)
        public double AverageRating { get; set; } = 0;

        public int ReviewCount { get; set; } = 0;

        public int SoldCount { get; set; } = 0;

        public int ViewCount { get; set; } = 0;

        // SEO
        [StringLength(300)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        // Weight & Dimensions for shipping
        public double? WeightKg { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

        public virtual ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();

        public virtual ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();

        public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
    }
}
