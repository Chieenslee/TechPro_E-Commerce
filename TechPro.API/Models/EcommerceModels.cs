using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("Wishlists")]
    public class Wishlist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public virtual NguoiDung User { get; set; } = null!;

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("ShippingAddresses")]
    public class ShippingAddress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public virtual NguoiDung User { get; set; } = null!;

        [Required]
        [StringLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Ward { get; set; }

        [StringLength(200)]
        public string? District { get; set; }

        [StringLength(200)]
        public string? Province { get; set; }

        public bool IsDefault { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("CustomerProfiles")]
    public class CustomerProfile
    {
        [Key]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public virtual NguoiDung User { get; set; } = null!;

        // Loyalty
        [StringLength(50)]
        public string Tier { get; set; } = "Bronze"; // Bronze | Silver | Gold | Platinum

        public int Points { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalSpent { get; set; } = 0;

        public int TotalOrders { get; set; } = 0;

        public DateTime MemberSince { get; set; } = DateTime.UtcNow;

        // Social
        [StringLength(200)]
        public string? GoogleId { get; set; }

        [StringLength(200)]
        public string? FacebookId { get; set; }

        [StringLength(500)]
        public string? AvatarUrl { get; set; }

        [StringLength(200)]
        public string? DateOfBirth { get; set; }
    }

    [Table("Coupons")]
    public class Coupon
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Description { get; set; }

        // Type: percent | fixed | free_shipping
        [Required]
        [StringLength(30)]
        public string Type { get; set; } = "percent";

        [Column(TypeName = "decimal(18,2)")]
        public decimal Value { get; set; } // e.g. 10 (%) or 50000 (VND)

        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscountAmount { get; set; }

        public int? UsageLimit { get; set; } // null = unlimited

        public int UsedCount { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("FlashSales")]
    public class FlashSale
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal SalePrice { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int? Quantity { get; set; } // null = unlimited

        public int Sold { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
