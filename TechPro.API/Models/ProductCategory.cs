using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("ProductCategories")]
    public class ProductCategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(100)]
        public string? Icon { get; set; } // e.g. "bi bi-laptop"

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public int? ParentId { get; set; }

        [ForeignKey("ParentId")]
        public virtual ProductCategory? Parent { get; set; }

        public virtual ICollection<ProductCategory> Children { get; set; } = new List<ProductCategory>();

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
