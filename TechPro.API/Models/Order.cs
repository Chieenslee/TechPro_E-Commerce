using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderCode { get; set; } = string.Empty; // e.g. "TP-2026-001234"

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public virtual NguoiDung User { get; set; } = null!;

        // Shipping info snapshot
        [Required]
        [StringLength(200)]
        public string ShippingFullName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string ShippingPhone { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [StringLength(200)]
        public string? ShippingWard { get; set; }

        [StringLength(200)]
        public string? ShippingDistrict { get; set; }

        [StringLength(200)]
        public string? ShippingProvince { get; set; }

        // Pricing
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingFee { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // Status: pending | confirmed | processing | shipped | delivered | cancelled | refunded
        [StringLength(50)]
        public string Status { get; set; } = "pending";

        // Payment
        [StringLength(50)]
        public string PaymentMethod { get; set; } = "cod"; // cod | vnpay | momo | zalopay | bank_transfer

        [StringLength(50)]
        public string PaymentStatus { get; set; } = "unpaid"; // unpaid | paid | refunded

        public DateTime? PaidAt { get; set; }

        // Coupon
        [StringLength(50)]
        public string? CouponCode { get; set; }

        // Tracking
        [StringLength(100)]
        public string? TrackingCode { get; set; }

        [StringLength(100)]
        public string? ShippingCarrier { get; set; }

        [StringLength(500)]
        public string? Note { get; set; }

        // Points
        public int PointsEarned { get; set; } = 0;

        public int PointsUsed { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

        public virtual ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
    }

    [Table("OrderItems")]
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        public int? VariantId { get; set; }

        [ForeignKey("VariantId")]
        public virtual ProductVariant? Variant { get; set; }

        // Snapshot at time of purchase
        [Required]
        [StringLength(300)]
        public string ProductName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? VariantInfo { get; set; } // e.g. "256GB - Space Black"

        [StringLength(500)]
        public string? ProductImageUrl { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice => UnitPrice * Quantity - DiscountAmount;
    }

    [Table("OrderStatusHistory")]
    public class OrderStatusHistory
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Note { get; set; }

        [StringLength(200)]
        public string? ChangedBy { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}
