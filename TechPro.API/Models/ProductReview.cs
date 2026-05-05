using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("ProductReviews")]
    public class ProductReview
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public virtual NguoiDung User { get; set; } = null!;

        public int? OrderId { get; set; } // To verify purchase

        [Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(200)]
        public string? Title { get; set; }

        public string? Body { get; set; }

        [StringLength(500)]
        public string? Pros { get; set; }

        [StringLength(500)]
        public string? Cons { get; set; }

        public bool VerifiedPurchase { get; set; } = false;

        public int HelpfulCount { get; set; } = 0;

        public bool IsApproved { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
