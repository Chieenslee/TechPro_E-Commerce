using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TechPro.API.Models;

namespace TechPro.API.Data
{
    public class TechProDbContext : IdentityDbContext<NguoiDung>
    {
        public TechProDbContext(DbContextOptions<TechProDbContext> options)
            : base(options)
        {
        }

        // ── Legacy (Repair Shop) ─────────────────────────────────────
        public DbSet<CuaHang> CuaHangs { get; set; }
        public DbSet<PhieuSuaChua> PhieuSuaChuas { get; set; }
        public DbSet<KhoLinhKien> KhoLinhKiens { get; set; }
        public DbSet<YeuCauLinhKien> YeuCauLinhKiens { get; set; }
        public DbSet<TraXac> TraXacs { get; set; }
        public DbSet<ThietBiBan> ThietBiBans { get; set; }
        public DbSet<LichHen> LichHens { get; set; }
        public DbSet<TicketNote> TicketNotes { get; set; }
        public DbSet<ScratchMark> ScratchMarks { get; set; }
        public DbSet<RevenueDaily> RevenueDailies { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<GiaoCa> GiaoCas { get; set; }
        public DbSet<HoaHong> HoaHongs { get; set; }
        public DbSet<PhieuDieuChuyen> PhieuDieuChuyens { get; set; }
        public DbSet<ChiTietDieuChuyen> ChiTietDieuChuyens { get; set; }
        public DbSet<LichSuHuyPhieu> LichSuHuyPhieus { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        // ── E-Commerce: Catalog ──────────────────────────────────────
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductBrand> ProductBrands { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductSpecification> ProductSpecifications { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }

        // ── E-Commerce: Shopping ─────────────────────────────────────
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

        // ── E-Commerce: Customer ─────────────────────────────────────
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<ShippingAddress> ShippingAddresses { get; set; }
        public DbSet<CustomerProfile> CustomerProfiles { get; set; }

        // ── E-Commerce: Promotions ───────────────────────────────────
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<FlashSale> FlashSales { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ─── Legacy Relationships ────────────────────────────────
            builder.Entity<NguoiDung>()
                .HasOne(n => n.CuaHang)
                .WithMany(c => c.NhanViens)
                .HasForeignKey(n => n.TenantId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<PhieuSuaChua>()
                .HasOne(p => p.KyThuatVien)
                .WithMany(n => n.PhieuSuaChuas)
                .HasForeignKey(p => p.KyThuatVienId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<PhieuSuaChua>()
                .HasOne(p => p.CuaHang)
                .WithMany(c => c.PhieuSuaChuas)
                .HasForeignKey(p => p.TenantId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<KhoLinhKien>()
                .HasOne(k => k.CuaHang)
                .WithMany()
                .HasForeignKey(k => k.TenantId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<YeuCauLinhKien>()
                .HasOne(y => y.PhieuSuaChua)
                .WithMany(p => p.YeuCauLinhKiens)
                .HasForeignKey(y => y.PhieuSuaChuaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<YeuCauLinhKien>()
                .HasOne(y => y.LinhKien)
                .WithMany(k => k.YeuCauLinhKiens)
                .HasForeignKey(y => y.LinhKienId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TraXac>()
                .HasOne(t => t.PhieuSuaChua)
                .WithMany(p => p.TraXacs)
                .HasForeignKey(t => t.PhieuSuaChuaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ThietBiBan>()
                .HasOne(t => t.CuaHang)
                .WithMany()
                .HasForeignKey(t => t.TenantId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<PhieuSuaChua>().HasIndex(p => p.SerialNumber);
            builder.Entity<PhieuSuaChua>().HasIndex(p => p.TrangThai);
            builder.Entity<PhieuSuaChua>().HasIndex(p => p.NgayNhan);
            builder.Entity<ThietBiBan>().HasIndex(t => t.SerialNumber).IsUnique();
            builder.Entity<ScratchMark>().HasIndex(s => s.PhieuSuaChuaId);
            builder.Entity<TicketNote>().HasIndex(n => n.PhieuSuaChuaId);
            builder.Entity<RevenueDaily>().HasIndex(r => r.Ngay);
            builder.Entity<RevenueDaily>().Property(r => r.DoanhThu).HasColumnType("decimal(18,2)");

            builder.Entity<Notification>()
                .HasOne(n => n.User).WithMany().HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Notification>().HasIndex(n => n.UserId);
            builder.Entity<Notification>().HasIndex(n => n.IsRead);
            builder.Entity<Notification>().HasIndex(n => n.CreatedAt);

            builder.Entity<PhieuDieuChuyen>()
                .HasOne(p => p.TuCuaHang).WithMany().HasForeignKey(p => p.TuCuaHangId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<PhieuDieuChuyen>()
                .HasOne(p => p.DenCuaHang).WithMany().HasForeignKey(p => p.DenCuaHangId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ChiTietDieuChuyen>()
                .HasOne(c => c.PhieuDieuChuyen).WithMany(p => p.ChiTietDieuChuyens).HasForeignKey(c => c.PhieuDieuChuyenId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<GiaoCa>()
                .HasOne(g => g.NguoiGiao).WithMany().HasForeignKey(g => g.NguoiGiaoId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<GiaoCa>()
                .HasOne(g => g.NguoiNhan).WithMany().HasForeignKey(g => g.NguoiNhanId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<LichSuHuyPhieu>()
                .HasOne(l => l.NguoiYeuCau).WithMany().HasForeignKey(l => l.NguoiYeuCauId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<LichSuHuyPhieu>()
                .HasOne(l => l.NguoiDuyet).WithMany().HasForeignKey(l => l.NguoiDuyetId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<HoaHong>()
                .HasOne(h => h.PhieuSuaChua).WithMany().HasForeignKey(h => h.PhieuSuaChuaId).OnDelete(DeleteBehavior.Cascade);

            // ─── E-Commerce: Product Catalog ─────────────────────────
            builder.Entity<Product>()
                .HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Product>()
                .HasOne(p => p.Brand).WithMany(b => b.Products).HasForeignKey(p => p.BrandId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
            builder.Entity<Product>().HasIndex(p => p.CategoryId);
            builder.Entity<Product>().HasIndex(p => p.BrandId);
            builder.Entity<Product>().HasIndex(p => p.IsActive);
            builder.Entity<Product>().HasIndex(p => p.IsFeatured);

            builder.Entity<ProductCategory>()
                .HasOne(c => c.Parent).WithMany(c => c.Children).HasForeignKey(c => c.ParentId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ProductCategory>().HasIndex(c => c.Slug).IsUnique();

            builder.Entity<ProductBrand>().HasIndex(b => b.Slug).IsUnique();

            builder.Entity<ProductImage>()
                .HasOne(i => i.Product).WithMany(p => p.Images).HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductSpecification>()
                .HasOne(s => s.Product).WithMany(p => p.Specifications).HasForeignKey(s => s.ProductId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductVariant>()
                .HasOne(v => v.Product).WithMany(p => p.Variants).HasForeignKey(v => v.ProductId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductReview>()
                .HasOne(r => r.Product).WithMany(p => p.Reviews).HasForeignKey(r => r.ProductId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ProductReview>()
                .HasOne(r => r.User).WithMany(u => u.Reviews).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ProductReview>().HasIndex(r => r.ProductId);
            builder.Entity<ProductReview>().HasIndex(r => r.UserId);

            // ─── E-Commerce: Shopping ────────────────────────────────
            builder.Entity<Cart>()
                .HasOne(c => c.User).WithMany().HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CartItem>()
                .HasOne(i => i.Cart).WithMany(c => c.Items).HasForeignKey(i => i.CartId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<CartItem>()
                .HasOne(i => i.Product).WithMany().HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<CartItem>()
                .HasOne(i => i.Variant).WithMany().HasForeignKey(i => i.VariantId).OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Order>()
                .HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Order>().HasIndex(o => o.OrderCode).IsUnique();
            builder.Entity<Order>().HasIndex(o => o.UserId);
            builder.Entity<Order>().HasIndex(o => o.Status);
            builder.Entity<Order>().HasIndex(o => o.CreatedAt);

            builder.Entity<OrderItem>()
                .HasOne(i => i.Order).WithMany(o => o.Items).HasForeignKey(i => i.OrderId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<OrderItem>()
                .HasOne(i => i.Product).WithMany().HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<OrderItem>()
                .HasOne(i => i.Variant).WithMany().HasForeignKey(i => i.VariantId).OnDelete(DeleteBehavior.SetNull);
            builder.Entity<OrderItem>().Ignore(i => i.TotalPrice);

            builder.Entity<OrderStatusHistory>()
                .HasOne(h => h.Order).WithMany(o => o.StatusHistory).HasForeignKey(h => h.OrderId).OnDelete(DeleteBehavior.Cascade);

            // ─── E-Commerce: Customer ────────────────────────────────
            builder.Entity<Wishlist>()
                .HasOne(w => w.User).WithMany(u => u.Wishlists).HasForeignKey(w => w.UserId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Wishlist>()
                .HasOne(w => w.Product).WithMany().HasForeignKey(w => w.ProductId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Wishlist>().HasIndex(w => new { w.UserId, w.ProductId }).IsUnique();

            builder.Entity<ShippingAddress>()
                .HasOne(a => a.User).WithMany(u => u.ShippingAddresses).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CustomerProfile>()
                .HasOne(cp => cp.User).WithOne(u => u.CustomerProfile).HasForeignKey<CustomerProfile>(cp => cp.UserId).OnDelete(DeleteBehavior.Cascade);

            // ─── Promotions ──────────────────────────────────────────
            builder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();

            builder.Entity<FlashSale>()
                .HasOne(f => f.Product).WithMany().HasForeignKey(f => f.ProductId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<FlashSale>().HasIndex(f => f.StartTime);
            builder.Entity<FlashSale>().HasIndex(f => f.EndTime);
        }
    }
}
