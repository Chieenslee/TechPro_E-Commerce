import os
import re

file_path = "Program.cs"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_build_products = """static List<Product> BuildProducts()
{
    return new List<Product>
    {
        new Product(1, "iPhone 15 Pro Max 256GB", "phones", 29990000, 34990000, 4.9, "PRD-IP15PM-256", "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg", true, true, new[] { "Apple iPhone", "Apple", "phones", "Premium" }),
        new Product(2, "Samsung Galaxy S24 Ultra 512GB", "phones", 31990000, 37490000, 4.8, "PRD-S24U-512", "https://cdn.tgdd.vn/Products/Images/42/319665/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg", true, true, new[] { "Samsung Galaxy", "Samsung", "phones", "Premium" }),
        new Product(3, "MacBook Pro 14 inch M3 Pro", "laptops", 49990000, 52990000, 4.9, "PRD-MBP14-M3P", "https://cdn.tgdd.vn/Products/Images/44/318220/macbook-pro-14-inch-m3-pro-2023-silver-thumb-600x600.jpg", true, true, new[] { "MacBook", "Apple", "laptops", "Premium" }),
        new Product(4, "Laptop ASUS ROG Strix G15", "laptops", 25990000, 27990000, 4.7, "PRD-ASUS-G15", "https://cdn.tgdd.vn/Products/Images/44/304700/asus-rog-strix-g15-g513rc-r7-hn038w-thumb-600x600.jpg", false, true, new[] { "ASUS ROG", "ASUS", "laptops", "Gaming" }),
        new Product(5, "iPad Pro M4 11 inch 256GB Wifi", "tablets", 28990000, 28990000, 4.9, "PRD-IPADM4-11", "https://cdn.tgdd.vn/Products/Images/52/325066/ipad-pro-m4-11-inch-wifi-space-black-thumb-600x600.jpg", true, false, new[] { "Apple iPad", "Apple", "tablets", "Premium" }),
        new Product(6, "Tai nghe Bluetooth AirPods Pro 2", "audio", 6190000, 6990000, 4.8, "PRD-AP-PRO2", "https://cdn.tgdd.vn/Products/Images/54/289781/samsung-galaxy-buds-2-pro-den-thumb-600x600.jpeg", false, true, new[] { "Earbuds", "Apple", "audio" }),
        new Product(7, "Loa Harman Kardon Onyx 8", "audio", 6990000, 7590000, 4.7, "PRD-HK-ONYX8", "https://cdn.tgdd.vn/Products/Images/54/290047/loa-bluetooth-harman-kardon-onyx-studio-8-thumb-600x600.jpeg", false, true, new[] { "Speakers", "Harman Kardon", "audio" }),
        new Product(8, "Bàn phím cơ Logitech G Pro X", "accessories", 3990000, 4290000, 4.8, "PRD-LOGI-GPROX", "https://cdn.tgdd.vn/Products/Images/86/313626/ban-phim-co-gaming-logitech-g-pro-x-tkl-lightspeed-thumb-600x600.jpg", true, true, new[] { "Keyboards", "Logitech", "accessories" }),
        new Product(9, "Chuột Không Dây Logitech MX 3S", "accessories", 2590000, 2990000, 4.9, "PRD-LOGI-MX3S", "https://cdn.tgdd.vn/Products/Images/86/282864/chuot-khong-day-logitech-mx-master-3s-thumb-600x600.jpg", false, true, new[] { "Mice", "Logitech", "accessories" }),
        new Product(10, "Camera IP 360 Xiaomi Mi Home", "smarthome", 690000, 890000, 4.6, "PRD-XIAOMI-CAM", "https://cdn.tgdd.vn/Products/Images/4728/238804/camera-ip-360-do-1080p-xiaomi-mi-home-bhr4885gl-thumb-600x600.jpg", false, true, new[] { "Security Cameras", "Xiaomi", "smarthome" }),
    };
}"""

pattern = r"static List<Product> BuildProducts\(\)\s*\{.*?\n\s*\}"
content = re.sub(pattern, new_build_products, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Backend BuildProducts patched.")
