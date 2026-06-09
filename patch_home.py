import os

file_path = "d:/My/CNPM/TechPro_E-Commerce/frontend/src/pages/Home.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Flash Sale 1
content = content.replace("Precision Pro Smartwatch", "iPhone 15 Pro Max 256GB")
content = content.replace("price: 199.99", "price: 29990000")
content = content.replace("$285.00", "34.990.000 ₫")
content = content.replace("$199.99", "29.990.000 ₫")
content = content.replace("id: 101", "id: 1")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuDJicIh6kVkdCVMu_T0ui_UTd3QeFAJpIDrSiBiyKntNup6G7vFxuCzLRy5ErNj5oVWsrBU8I7Ptie5e__EVRktOxF8EsJm1jITncgajY3tfnbITyUkmMACZmJomTYoHahSkNCkuDaFepYlgLjxF2Sg_29GnslKn--rvVFKtLug2iNScmwdPC1wH1Hfx0YyW0TZneBdSElRscUESsqWQGnXsMPmA48djERC2uu6SBVpXMozplKr9zrX-i2CyBkYyM12z3lVRxpW5tPX", "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800")

# Flash Sale 2
content = content.replace("Sonic Edge Wireless Earbuds", "Tai nghe AirPods Pro 2")
content = content.replace("price: 89.99", "price: 6190000")
content = content.replace("$105.00", "6.990.000 ₫")
content = content.replace("$89.99", "6.190.000 ₫")
content = content.replace("id: 102", "id: 6")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuBK4CWF1jfcn2Egt2Icl31S3f_bTEhxACm90CobmicAmgndSVCc1Fkfn5rwrNGJJve1N6tIVLifpEVY5B4FQLK-ydTS5LwFyrQK5L6WP2UZJjLxSy_5kXxWIJ8uerAhppdRbMQvOX6kJu0cBgZTuFRzJwfLiV5PtSzkCJS4YbDovuqtGhWJfI75joGjcR9_hZTFHzhYmCxPPUEsUNM6pAIMyHtNxvdt7HIZ3RxAZPw7K6sNpAcTnUdct0a3jDTtHhV1S3Di4JGY7LvF", "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800")

# Flash Sale 3
content = content.replace("Aura Over-Ear Headphones", "MacBook Pro 14 M3 Pro")
content = content.replace("price: 240.00", "price: 49990000")
content = content.replace("$300.00", "55.990.000 ₫")
content = content.replace("$240.00", "49.990.000 ₫")
content = content.replace("id: 103", "id: 3")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuD5AQ5RU3WPbIu6xb-cxmIrDwJcFgy-8qlWlKoFUEtEx2OvKOZZZXUplLLGNXFVc7lnd-svVQVPws5jlMxgohMVs-3bdPK3_dxNx1LlNYcnHjddamHwtFzrOgRSblUbD5rS07yinaBMMRvtcWeW6VAtY9PJDP3wxn8fgNX3HtT2DWF3CU22yPxWSsKv4mmPkRaTOeoPp7ox48wc-0QxYtMYMIcPAe2a95JZ9IisFFhDdyGLtM4c0208L3HK6yU33P3guOB6ZJNLL2Ps", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800")

# Flash Sale 4 (BassBox)
content = content.replace("BassBox Portable Speaker", "Loa Harman Kardon Onyx 8")
content = content.replace("price: 49.99", "price: 6990000")
content = content.replace("$100.00", "7.990.000 ₫")
content = content.replace("$49.99", "6.990.000 ₫")
content = content.replace("id: 104", "id: 7")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuBejdZgzBTqpAvuuwE00vSQ-B-6FWgwB9dbavCJP6rtQIbIBhNKTEapO6cj_lrSOXZ3g_Oam52oYcNU7CN3xe-BDkFl3ITE75JBu-y8k7DSi3lBYrF6txev5-FVYNBOV7E81T3zP-Tsf2m432cLcy4kM3UhBmAPuAwOQrhKiZ6nMN9wgVKmpxGDywdP4HgMZ4-VSMSJfejc089ZzDwqo1Cc02Al9JX_Nm2lPdw4Zu5rZgrc9mtToaV_Deze_10hrCPjDF9bSjPmvvSF", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800")

# Our Products 1
content = content.replace("Nexus Z Fold Smartphone 256GB", "Samsung Galaxy S24 Ultra")
content = content.replace("price: 1299.00", "price: 31990000")
content = content.replace("$1,299.00", "31.990.000 ₫")
content = content.replace("id: 105", "id: 2")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuDq7O5_4xg6d8z77u4Zi75DrC0P9yjp25ci6lmrnKWVFLVDJnvYj_eLnUtChkXvWdurEYfV_KPl-mOAgxaFi2HaHZnaJV6unTG8t92fkjWC-7LqxmUKyjWPaeO_r9wi5MAsx8CdRoFpP1jO9BJ-n46n25_1e3tNv9HAxNENIctDTGhdxWo_1gUa22P3mB-th8JNFaVpa1L8ghrYYQn-nxeqoeulEqgn76n8Ewi84zDsjzcWttaOAiMARrgkbnzah4R7CZu3oS7u2Krx", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800")

# Our Products 2
content = content.replace("PrecisionBook Pro 16\" M2", "Laptop ASUS ROG Strix G15")
content = content.replace("price: 2499.00", "price: 25990000")
content = content.replace("$2,499.00", "25.990.000 ₫")
content = content.replace("id: 106", "id: 4")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuCatrCA_U54emDO95njFXPUr8q7s2mvLu7QksKIN2No0UZN6jaRcIDnfgJ-ytNi34YPEa02b02uX9wAR1ls3h4SoUGT-UfygV8jlHCuTzv_MnOexpS6KByqjXKPqtGL5ivDMaR7ZVzdfXPyR7PSaV0ozq3uXKhYBPzKL_vzhwz_p3T_kweZ2ZnhG1AzRmOC7qhxxXUNRbp2a5Bp7SupwKqakn2OKh-R-989qmeBa-bbLLLGdNcOfiYSGtGnGTCQLPTjLvFQM7dfjROs", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800")

# Our Products 3
content = content.replace("TabTech Ultra 12.9\"", "iPad Pro M4 11 inch 256GB")
content = content.replace("price: 899.00", "price: 28990000")
content = content.replace("$899.00", "28.990.000 ₫")
content = content.replace("id: 107", "id: 5")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuCHtjCyIscwqL9tDJJ87YgTl5OGiPU_YKMvIoh4HkIyrNKpwggXvo0FauUXfnNsck2r96YHXEfHU07uOxDP9fLA5uF1Znll6oJqdK1pIafi7sxiqB12wPk5YfOIqnGKsj_FK-SJ3T8Q8jd0PQw-Lc7-4QjxljdiTd6MLjGtbgvUvnstEoOgC5rZ9DO11RrcNKk9BVOnLHdllvY92YxOu2NNyhXQeeBGph2_q-ImlOP5mpEjEwGroe021GUFtRRgJi56bh8rMyWdylA_", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800")

# Our Products 4
content = content.replace("OpticPro Mirrorless Camera", "Camera IP 360 Xiaomi Mi Home")
content = content.replace("price: 1599.00", "price: 690000")
content = content.replace("$1,599.00", "690.000 ₫")
content = content.replace("id: 108", "id: 10")
content = content.replace("https://lh3.googleusercontent.com/aida-public/AB6AXuAMYhWMfTylUMseLEvQzto7kHr7RMV4i7CQKQIYHsMSq8jtj7b-gvOJO-0g_QTyGcXcMxb4YjF1IL4UzBWWDFHN5h7A9nF2aLPX7RhpGvEJMBMl_pHDX8roHupo5ihtDtlKGt7qpsstXSaWJte9clnNjW9xadZRggfdXp5RBwtb8SNMm4LS4HLi7n56TynK11u65aehKTldR6IqPTa0pYf5htY2iit77LnpapUWe3gRwobQLow09jjSfwmyOGGxgGbgjJ-CkGz-g1VV", "https://images.unsplash.com/photo-1516681100242-7eb69ced17a6?auto=format&fit=crop&q=80&w=800")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch complete.")
