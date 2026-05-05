using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("ProductVariants")]
    public class ProductVariant
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string VariantType { get; set; } = string.Empty; // e.g. "Color", "Storage", "RAM"

        [Required]
        [StringLength(100)]
        public string VariantValue { get; set; } = string.Empty; // e.g. "Space Black", "512GB", "16GB"

        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceModifier { get; set; } = 0; // +/- from base price

        public int Stock { get; set; } = 0;

        [StringLength(100)]
        public string? Sku { get; set; }

        [StringLength(50)]
        public string? ColorHex { get; set; } // For color variants

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; } = 0;
    }
}
