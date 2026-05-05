using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechPro.API.Models
{
    [Table("Carts")]
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        public string? UserId { get; set; } // null = guest cart

        [ForeignKey("UserId")]
        public virtual NguoiDung? User { get; set; }

        [StringLength(100)]
        public string? SessionId { get; set; } // For guest carts

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }

    [Table("CartItems")]
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int CartId { get; set; }

        [ForeignKey("CartId")]
        public virtual Cart Cart { get; set; } = null!;

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;

        public int? VariantId { get; set; }

        [ForeignKey("VariantId")]
        public virtual ProductVariant? Variant { get; set; }

        public int Quantity { get; set; } = 1;

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
