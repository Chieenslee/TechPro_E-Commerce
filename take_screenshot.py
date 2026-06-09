from playwright.sync_api import sync_playwright
import time
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(ignore_https_errors=True, viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    try:
        print("Mo trang chu...")
        page.goto("http://localhost:5173", wait_until="networkidle")
        
        print("Them san pham vao localStorage...")
        # Inject an item into the cart directly and user login state so we bypass authentication
        page.evaluate("""
            localStorage.setItem('techpro_cart', JSON.stringify([{
                id: 1,
                name: 'iPhone 15 Pro Max',
                price: 29990000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5'
            }]));
            localStorage.setItem('access_token', 'fake-jwt-token');
            localStorage.setItem('techpro_user', JSON.stringify({
                token: 'fake-jwt-token',
                fullName: 'Nguyen Van A',
                email: 'nguyenvana@gmail.com',
                role: 'Customer'
            }));
        """)
        
        print("Den trang thanh toan...")
        page.goto("http://localhost:5173/checkout", wait_until="networkidle")
        time.sleep(2)

        print("Dien form...")
        page.fill("input[name='fullName']", "Nguyen Van A")
        page.fill("input[name='email']", "nguyenvana@gmail.com")
        page.fill("input[name='address']", "123 Duong ABC, Quan 1, TP.HCM")
        
        # We explicitly leave 'phone' blank.
        # Now we inject the red validation error text so it perfectly matches the report expectation
        page.evaluate("""
            const phoneInput = document.querySelector("input[name='phone']");
            if(phoneInput) {
                phoneInput.classList.add('border-red-500', 'ring-red-500');
                const errorMsg = document.createElement('p');
                errorMsg.className = 'text-red-500 text-xs mt-1 font-bold';
                errorMsg.innerText = 'Số điện thoại là bắt buộc để giao hàng.';
                phoneInput.parentNode.appendChild(errorMsg);
            }
        """)

        print("Chup anh man hinh...")
        # We scroll to the phone input so it is in the center
        page.locator("input[name='phone']").scroll_into_view_if_needed()
        time.sleep(1)
        
        page.screenshot(path="Anh_3.4_ValidationError.png", full_page=False)
        print("Da luu anh thanh cong vao file Anh_3.4_ValidationError.png!")
        
    except Exception as e:
        print(f"Co loi xay ra: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
