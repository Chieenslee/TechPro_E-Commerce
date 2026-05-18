-- TechPro E-Commerce relational schema
-- Target: SQL Server / Azure SQL

CREATE TABLE dbo.Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(160) NOT NULL,
    Email NVARCHAR(320) NOT NULL UNIQUE,
    Role NVARCHAR(40) NOT NULL CONSTRAINT DF_Users_Role DEFAULT 'Customer',
    Status NVARCHAR(40) NOT NULL CONSTRAINT DF_Users_Status DEFAULT 'Active',
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    LastLoginAt DATETIMEOFFSET NULL,
    CONSTRAINT CK_Users_Role CHECK (Role IN ('Admin', 'Customer')),
    CONSTRAINT CK_Users_Status CHECK (Status IN ('Active', 'Suspended'))
);

CREATE TABLE dbo.Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(220) NOT NULL,
    Category NVARCHAR(80) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    OriginalPrice DECIMAL(18,2) NOT NULL,
    Rating DECIMAL(3,1) NOT NULL CONSTRAINT DF_Products_Rating DEFAULT 4.5,
    Sku NVARCHAR(80) NOT NULL UNIQUE,
    Image NVARCHAR(1000) NULL,
    IsNew BIT NOT NULL CONSTRAINT DF_Products_IsNew DEFAULT 0,
    OnSale BIT NOT NULL CONSTRAINT DF_Products_OnSale DEFAULT 0,
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    UpdatedAt DATETIMEOFFSET NULL,
    CONSTRAINT CK_Products_Price CHECK (Price > 0),
    CONSTRAINT CK_Products_OriginalPrice CHECK (OriginalPrice >= Price),
    CONSTRAINT CK_Products_Rating CHECK (Rating >= 0 AND Rating <= 5)
);

CREATE TABLE dbo.ProductTags (
    ProductId INT NOT NULL,
    Tag NVARCHAR(80) NOT NULL,
    CONSTRAINT PK_ProductTags PRIMARY KEY (ProductId, Tag),
    CONSTRAINT FK_ProductTags_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE CASCADE
);

CREATE TABLE dbo.Orders (
    OrderNumber NVARCHAR(40) PRIMARY KEY,
    UserId INT NULL,
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    Status NVARCHAR(40) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT 'Processing',
    CustomerFullName NVARCHAR(160) NOT NULL,
    CustomerPhone NVARCHAR(60) NOT NULL,
    CustomerEmail NVARCHAR(320) NOT NULL,
    City NVARCHAR(120) NOT NULL,
    District NVARCHAR(120) NOT NULL,
    Ward NVARCHAR(120) NOT NULL,
    Address NVARCHAR(500) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    ShippingFee DECIMAL(18,2) NOT NULL,
    Discount DECIMAL(18,2) NOT NULL,
    Total DECIMAL(18,2) NOT NULL,
    ShippingMethod NVARCHAR(80) NOT NULL,
    PaymentMethod NVARCHAR(80) NOT NULL,
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id),
    CONSTRAINT CK_Orders_Status CHECK (Status IN ('Processing', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    CONSTRAINT CK_Orders_Total CHECK (Total >= 0)
);

CREATE TABLE dbo.OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderNumber NVARCHAR(40) NOT NULL,
    ProductId INT NULL,
    Name NVARCHAR(220) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    Image NVARCHAR(1000) NULL,
    Category NVARCHAR(80) NULL,
    Storage NVARCHAR(80) NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderNumber) REFERENCES dbo.Orders(OrderNumber) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id),
    CONSTRAINT CK_OrderItems_Quantity CHECK (Quantity > 0)
);

CREATE TABLE dbo.ProductReviews (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NULL,
    Author NVARCHAR(160) NOT NULL,
    Rating INT NOT NULL,
    Comment NVARCHAR(2000) NOT NULL,
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_ProductReviews_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_ProductReviews_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ProductReviews_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id),
    CONSTRAINT CK_ProductReviews_Rating CHECK (Rating BETWEEN 1 AND 5)
);

CREATE TABLE dbo.NewsletterSubscribers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(320) NOT NULL UNIQUE,
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_NewsletterSubscribers_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    Status NVARCHAR(40) NOT NULL CONSTRAINT DF_NewsletterSubscribers_Status DEFAULT 'Active',
    CONSTRAINT CK_NewsletterSubscribers_Status CHECK (Status IN ('Active', 'Unsubscribed'))
);

CREATE TABLE dbo.Addresses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Label NVARCHAR(120) NOT NULL,
    Recipient NVARCHAR(160) NOT NULL,
    Phone NVARCHAR(60) NOT NULL,
    Line1 NVARCHAR(500) NOT NULL,
    City NVARCHAR(120) NOT NULL,
    IsDefault BIT NOT NULL CONSTRAINT DF_Addresses_IsDefault DEFAULT 0,
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_Addresses_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT FK_Addresses_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);

CREATE TABLE dbo.WishlistItems (
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    CreatedAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_WishlistItems_CreatedAt DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT PK_WishlistItems PRIMARY KEY (UserId, ProductId),
    CONSTRAINT FK_WishlistItems_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_WishlistItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Products_Category ON dbo.Products(Category);
CREATE INDEX IX_Orders_CustomerEmail ON dbo.Orders(CustomerEmail);
CREATE INDEX IX_Orders_Status_CreatedAt ON dbo.Orders(Status, CreatedAt DESC);
CREATE INDEX IX_ProductReviews_ProductId_CreatedAt ON dbo.ProductReviews(ProductId, CreatedAt DESC);
CREATE INDEX IX_Addresses_UserId ON dbo.Addresses(UserId);
