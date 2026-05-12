const categories = ['Phones', 'Laptops', 'Tablets', 'Audio', 'Accessories', 'Smart Home'];

export const mockProducts = [];
let id = 1;

for (const cat of categories) {
  for (let i = 1; i <= 10; i++) {
    const isNew = i % 3 === 0;
    const onSale = i % 4 === 0;
    const price = Math.floor(Math.random() * 800) + 199;
    
    mockProducts.push({
      id: id++,
      name: `${cat.substring(0, 3).toUpperCase()} Pro Model ${i}`,
      category: cat.toLowerCase().replace(' ', ''),
      price: price,
      originalPrice: onSale ? price + 200 : price,
      rating: (Math.random() * 2 + 3).toFixed(1),
      sku: `${cat.substring(0, 3).toUpperCase()}-${i}000`,
      image: `https://placehold.co/600x400/222/FFF?text=${cat.replace(' ', '+')}+${i}`,
      isNew: isNew,
      onSale: onSale,
      tags: [cat, 'Tech']
    });
  }
}
