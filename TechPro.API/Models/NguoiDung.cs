using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace TechPro.API.Models
{
    public class NguoiDung : IdentityUser
    {
        [Required]
        [StringLength(100)]
        public string TenDayDu { get; set; } = string.Empty;

        [NotMapped]
        public string Name
        {
            get => TenDayDu;
            set => TenDayDu = value;
        }

        [NotMapped]
        public string Role { get; set; } = "store_admin";

        [StringLength(255)]
        public string? AvatarUrl { get; set; }

        [StringLength(50)]
        public string? TenantId { get; set; }

        [ForeignKey("TenantId")]
        public virtual CuaHang? CuaHang { get; set; }

        // Legacy: Repair management navigation
        public virtual ICollection<PhieuSuaChua> PhieuSuaChuas { get; set; } = new List<PhieuSuaChua>();

        // E-Commerce navigation
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public virtual CustomerProfile? CustomerProfile { get; set; }
        public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
        public virtual ICollection<ShippingAddress> ShippingAddresses { get; set; } = new List<ShippingAddress>();
    }
}

