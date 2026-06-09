import os
import glob

# Search in all jsx files
jsx_files = glob.glob('**/*.jsx', recursive=True)

for file_path in jsx_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # 1. formatMoney in Admin.jsx & Account.jsx
    content = content.replace("toLocaleString('en-US', { style: 'currency', currency: 'USD' })", "toLocaleString('vi-VN') + ' ₫'")
    
    # 2. inline toLocaleString('en-US') with $ prefix
    content = content.replace("${maxPrice.toLocaleString('en-US')}", "{maxPrice.toLocaleString('vi-VN')} ₫")
    content = content.replace("${(product.price * quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}", "{(product.price * quantity).toLocaleString('vi-VN')} ₫")
    content = content.replace("${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}", "{item.price.toLocaleString('vi-VN')} ₫")
    content = content.replace("${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}", "{subtotal.toLocaleString('vi-VN')} ₫")
    content = content.replace("${tax.toLocaleString('en-US', {minimumFractionDigits: 2})}", "{tax.toLocaleString('vi-VN')} ₫")
    content = content.replace("${total.toLocaleString('en-US', {minimumFractionDigits: 2})}", "{total.toLocaleString('vi-VN')} ₫")
    content = content.replace("${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}", "{(item.price * item.quantity).toLocaleString('vi-VN')} ₫")

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {file_path}")

print("Frontend VND patch completed.")
