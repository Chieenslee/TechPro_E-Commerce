-- TechPro E-Commerce seed data
-- Run after schema.sql.

INSERT INTO dbo.Users (Name, Email, Role, Status)
VALUES
    ('Admin Root', 'admin@techpro.eng', 'Admin', 'Active'),
    ('Alex Mercer', 'alex.mercer@techpro.eng', 'Customer', 'Active');

INSERT INTO dbo.Products (Name, Category, Price, OriginalPrice, Rating, Sku, Image, IsNew, OnSale)
VALUES
    ('PHO Pro Model 1', 'phones', 338.00, 338.00, 3.6, 'PHO-1000', 'https://placehold.co/600x400/222/FFF?text=phones+1', 0, 0),
    ('LAP Pro Model 1', 'laptops', 349.00, 349.00, 3.6, 'LAP-1000', 'https://placehold.co/600x400/222/FFF?text=laptops+1', 0, 0),
    ('TAB Pro Model 1', 'tablets', 349.00, 349.00, 3.6, 'TAB-1000', 'https://placehold.co/600x400/222/FFF?text=tablets+1', 0, 0),
    ('AUD Pro Model 1', 'audio', 327.00, 327.00, 3.6, 'AUD-1000', 'https://placehold.co/600x400/222/FFF?text=audio+1', 0, 0),
    ('ACC Pro Model 1', 'accessories', 393.00, 393.00, 3.6, 'ACC-1000', 'https://placehold.co/600x400/222/FFF?text=accessories+1', 0, 0),
    ('SMA Pro Model 1', 'smarthome', 371.00, 371.00, 3.6, 'SMA-1000', 'https://placehold.co/600x400/222/FFF?text=smarthome+1', 0, 0);

INSERT INTO dbo.ProductTags (ProductId, Tag)
SELECT Id, Category FROM dbo.Products;

INSERT INTO dbo.ProductTags (ProductId, Tag)
SELECT Id, 'TechPro' FROM dbo.Products;

INSERT INTO dbo.ProductReviews (ProductId, Author, Rating, Comment)
SELECT Id, 'John D.', 5, 'Excellent performance and build quality. It feels fast, polished, and ready for everyday work.'
FROM dbo.Products
WHERE Sku IN ('PHO-1000', 'LAP-1000', 'TAB-1000');

INSERT INTO dbo.ProductReviews (ProductId, Author, Rating, Comment)
SELECT Id, 'Sarah W.', 4, 'Great display and smooth setup. The accessories could be lighter, but the product itself is impressive.'
FROM dbo.Products
WHERE Sku IN ('PHO-1000', 'LAP-1000', 'TAB-1000');

INSERT INTO dbo.Addresses (UserId, Label, Recipient, Phone, Line1, City, IsDefault)
SELECT Id, 'Primary Node', Name, '+1 (555) 019-8234', '128 Tech Boulevard, Cyber District', 'Neo City 90210', 1
FROM dbo.Users
WHERE Email = 'alex.mercer@techpro.eng';
