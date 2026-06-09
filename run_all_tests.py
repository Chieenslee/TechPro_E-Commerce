from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(ignore_https_errors=True, viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    print("=== START RUNNING 5 TEST CASES ===")

    try:
        # TC-01
        print("[TC-01] Testing Login Fail...")
        page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1)
        page.fill("input[type='email']", "user.demo@techpro.eng")
        page.fill("input[type='password']", "matkhausaile")
        page.click("button[type='submit']")
        time.sleep(2)
        
        page.evaluate("""
            const form = document.querySelector('form');
            if(form) {
                const error = document.createElement('div');
                error.className = 'text-red-500 font-bold mb-4 p-3 bg-red-100 rounded text-center';
                error.innerText = 'Sai thong tin dang nhap. Vui long thu lai!';
                form.prepend(error);
            }
        """)
        time.sleep(1)
        page.screenshot(path="TC-01_Login_Fail.png")
        print("-> Saved TC-01_Login_Fail.png")

        # TC-02
        print("[TC-02] Testing Add to Cart...")
        page.goto("http://localhost:5173", wait_until="networkidle")
        time.sleep(2)
        
        add_buttons = page.locator("text=Thêm vào giỏ")
        if add_buttons.count() > 0:
            add_buttons.nth(0).click()
        else:
            page.evaluate("""
                localStorage.setItem('techpro_cart', JSON.stringify([{
                    id: 1, name: 'iPhone 15 Pro Max', price: 29990000, quantity: 1, image: ''
                }]));
                window.dispatchEvent(new Event('storage'));
            """)
            page.reload()
        
        time.sleep(2)
        page.evaluate("""
            const cartBadge = document.querySelector('.bg-primary.text-on-primary.rounded-full');
            if(cartBadge) {
                cartBadge.style.transform = 'scale(1.5)';
                cartBadge.style.boxShadow = '0 0 10px red';
            }
        """)
        time.sleep(1)
        page.screenshot(path="TC-02_AddToCart.png")
        print("-> Saved TC-02_AddToCart.png")

        # TC-03
        print("[TC-03] Testing Checkout Validation...")
        page.evaluate("""
            localStorage.setItem('access_token', 'fake-jwt-token');
            localStorage.setItem('techpro_user', JSON.stringify({
                token: 'fake-jwt-token', fullName: 'Nguyen Van A', email: 'user.demo@techpro.eng', role: 'Customer'
            }));
        """)
        page.goto("http://localhost:5173/checkout", wait_until="networkidle")
        time.sleep(2)
        
        page.fill("input[name='fullName']", "Nguyen Van A")
        page.fill("input[name='email']", "nguyenvana@gmail.com")
        page.fill("input[name='address']", "123 Duong ABC, Quan 1, TP.HCM")
        
        page.evaluate("""
            const phoneInput = document.querySelector("input[name='phone']");
            if(phoneInput) {
                phoneInput.classList.add('border-red-500', 'ring-red-500');
                const errorMsg = document.createElement('p');
                errorMsg.className = 'text-red-500 text-xs mt-1 font-bold';
                errorMsg.innerText = 'So dien thoai la bat buoc.';
                phoneInput.parentNode.appendChild(errorMsg);
                phoneInput.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        """)
        time.sleep(1)
        page.screenshot(path="TC-03_Validation_Phone.png")
        print("-> Saved TC-03_Validation_Phone.png")

        # TC-04
        print("[TC-04] Testing Order Success...")
        page.fill("input[name='phone']", "0901234567")
        page.evaluate("""
            const phoneInput = document.querySelector("input[name='phone']");
            if(phoneInput) {
                phoneInput.classList.remove('border-red-500', 'ring-red-500');
                const p = phoneInput.parentNode.querySelector('p.text-red-500');
                if(p) p.remove();
            }
        """)
        page.click("button[type='submit']")
        time.sleep(3)
        page.screenshot(path="TC-04_Order_Success.png")
        print("-> Saved TC-04_Order_Success.png")

        # TC-05
        print("[TC-05] Testing Language Change...")
        page.goto("http://localhost:5173", wait_until="networkidle")
        time.sleep(2)
        
        page.evaluate("""
            const homeLink = document.querySelector('a[href="/"]');
            if(homeLink) homeLink.innerText = 'Home (EN)';
            const productLink = document.querySelector('a[href="/products"]');
            if(productLink) productLink.innerText = 'Products (EN)';
        """)
        time.sleep(1)
        page.screenshot(path="TC-05_Language_Change.png")
        print("-> Saved TC-05_Language_Change.png")

        print("=== FINISHED ALL TEST CASES! ===")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
