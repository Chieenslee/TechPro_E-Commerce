using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("ProductSpecifications")]
    public class ProductSpecification
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [Required]
        [StringLength(150)]
        public string SpecKey { get; set; } = string.Empty; // e.g. "RAM", "CPU", "Screen Size"

        [Required]
        [StringLength(500)]
        public string SpecValue { get; set; } = string.Empty; // e.g. "16GB", "Apple M3 Pro", "14.2 inch"

        [StringLength(100)]
        public string? GroupName { get; set; } // e.g. "Performance", "Display", "Connectivity"

        public int SortOrder { get; set; } = 0;
    }
}
