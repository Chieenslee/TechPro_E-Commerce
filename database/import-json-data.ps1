param(
    [string]$ConnectionString = "Server=localhost;Database=TechPro;Trusted_Connection=True;TrustServerCertificate=True",
    [string]$DataDirectory = "..\backend\Data"
)

$ErrorActionPreference = "Stop"

function Read-JsonArray {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return @()
    }

    $content = Get-Content -LiteralPath $Path -Raw
    if ([string]::IsNullOrWhiteSpace($content)) {
        return @()
    }

    return @(ConvertFrom-Json -InputObject $content)
}

function Add-Param {
    param(
        [System.Data.SqlClient.SqlCommand]$Command,
        [string]$Name,
        $Value
    )

    if ($null -eq $Value -or ($Value -is [string] -and $Value -eq "")) {
        [void]$Command.Parameters.AddWithValue($Name, [DBNull]::Value)
    }
    else {
        [void]$Command.Parameters.AddWithValue($Name, $Value)
    }
}

function Invoke-NonQuery {
    param(
        [System.Data.SqlClient.SqlConnection]$Connection,
        [System.Data.SqlClient.SqlTransaction]$Transaction,
        [string]$Sql,
        [hashtable]$Parameters = @{}
    )

    $command = $Connection.CreateCommand()
    $command.Transaction = $Transaction
    $command.CommandText = $Sql

    foreach ($key in $Parameters.Keys) {
        Add-Param -Command $command -Name $key -Value $Parameters[$key]
    }

    [void]$command.ExecuteNonQuery()
}

$resolvedDataDirectory = Resolve-Path -LiteralPath $DataDirectory
$users = Read-JsonArray -Path (Join-Path $resolvedDataDirectory "users.json")
$products = Read-JsonArray -Path (Join-Path $resolvedDataDirectory "products.json")
$orders = Read-JsonArray -Path (Join-Path $resolvedDataDirectory "orders.json")
$reviews = Read-JsonArray -Path (Join-Path $resolvedDataDirectory "reviews.json")
$subscribers = Read-JsonArray -Path (Join-Path $resolvedDataDirectory "newsletterSubscribers.json")

$connection = New-Object System.Data.SqlClient.SqlConnection $ConnectionString
$connection.Open()
$transaction = $connection.BeginTransaction()

try {
    Invoke-NonQuery $connection $transaction @"
DELETE FROM dbo.WishlistItems;
DELETE FROM dbo.Addresses;
DELETE FROM dbo.ProductReviews;
DELETE FROM dbo.OrderItems;
DELETE FROM dbo.Orders;
DELETE FROM dbo.ProductTags;
DELETE FROM dbo.Products;
DELETE FROM dbo.NewsletterSubscribers;
DELETE FROM dbo.Users;
DBCC CHECKIDENT ('dbo.Users', RESEED, 0);
DBCC CHECKIDENT ('dbo.Products', RESEED, 0);
DBCC CHECKIDENT ('dbo.ProductReviews', RESEED, 0);
DBCC CHECKIDENT ('dbo.NewsletterSubscribers', RESEED, 0);
DBCC CHECKIDENT ('dbo.Addresses', RESEED, 0);
DBCC CHECKIDENT ('dbo.OrderItems', RESEED, 0);
"@

    if ($users.Count -gt 0) {
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.Users ON;"
        foreach ($user in $users) {
            Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.Users (Id, Name, Email, Role, Status, CreatedAt, LastLoginAt)
VALUES (@id, @name, @email, @role, @status, @createdAt, @lastLoginAt);
"@ @{
                "@id" = [int]$user.id
                "@name" = $user.name
                "@email" = $user.email
                "@role" = $user.role
                "@status" = $user.status
                "@createdAt" = [DateTimeOffset]::Parse($user.createdAt)
                "@lastLoginAt" = if ($null -eq $user.lastLoginAt) { $null } else { [DateTimeOffset]::Parse($user.lastLoginAt) }
            }
        }
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.Users OFF;"
    }

    if ($products.Count -gt 0) {
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.Products ON;"
        foreach ($product in $products) {
            Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.Products (Id, Name, Category, Price, OriginalPrice, Rating, Sku, Image, IsNew, OnSale)
VALUES (@id, @name, @category, @price, @originalPrice, @rating, @sku, @image, @isNew, @onSale);
"@ @{
                "@id" = [int]$product.id
                "@name" = $product.name
                "@category" = $product.category
                "@price" = [decimal]$product.price
                "@originalPrice" = [decimal]$product.originalPrice
                "@rating" = [decimal]$product.rating
                "@sku" = $product.sku
                "@image" = $product.image
                "@isNew" = [bool]$product.isNew
                "@onSale" = [bool]$product.onSale
            }

            foreach ($tag in @($product.tags)) {
                Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.ProductTags (ProductId, Tag)
VALUES (@productId, @tag);
"@ @{
                    "@productId" = [int]$product.id
                    "@tag" = $tag
                }
            }
        }
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.Products OFF;"
    }

    foreach ($order in $orders) {
        Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.Orders (
    OrderNumber, UserId, CreatedAt, Status, CustomerFullName, CustomerPhone, CustomerEmail,
    City, District, Ward, Address, Subtotal, ShippingFee, Discount, Total, ShippingMethod, PaymentMethod
)
VALUES (
    @orderNumber,
    (SELECT TOP 1 Id FROM dbo.Users WHERE Email = @customerEmail),
    @createdAt, @status, @customerFullName, @customerPhone, @customerEmail,
    @city, @district, @ward, @address, @subtotal, @shippingFee, @discount, @total, @shippingMethod, @paymentMethod
);
"@ @{
            "@orderNumber" = $order.orderNumber
            "@createdAt" = [DateTimeOffset]::Parse($order.createdAt)
            "@status" = $order.status
            "@customerFullName" = $order.customer.fullName
            "@customerPhone" = $order.customer.phone
            "@customerEmail" = $order.customer.email
            "@city" = $order.customer.city
            "@district" = $order.customer.district
            "@ward" = $order.customer.ward
            "@address" = $order.customer.address
            "@subtotal" = [decimal]$order.subtotal
            "@shippingFee" = [decimal]$order.shippingFee
            "@discount" = [decimal]$order.discount
            "@total" = [decimal]$order.total
            "@shippingMethod" = $order.shippingMethod
            "@paymentMethod" = $order.paymentMethod
        }

        foreach ($item in @($order.items)) {
            Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.OrderItems (OrderNumber, ProductId, Name, Price, Quantity, Image, Category, Storage)
VALUES (@orderNumber, @productId, @name, @price, @quantity, @image, @category, @storage);
"@ @{
                "@orderNumber" = $order.orderNumber
                "@productId" = [int]$item.id
                "@name" = $item.name
                "@price" = [decimal]$item.price
                "@quantity" = [int]$item.quantity
                "@image" = $item.image
                "@category" = $item.category
                "@storage" = $item.storage
            }
        }
    }

    if ($reviews.Count -gt 0) {
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.ProductReviews ON;"
        foreach ($review in $reviews) {
            Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.ProductReviews (Id, ProductId, Author, Rating, Comment, CreatedAt)
VALUES (@id, @productId, @author, @rating, @comment, @createdAt);
"@ @{
                "@id" = [int]$review.id
                "@productId" = [int]$review.productId
                "@author" = $review.author
                "@rating" = [int]$review.rating
                "@comment" = $review.comment
                "@createdAt" = [DateTimeOffset]::Parse($review.createdAt)
            }
        }
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.ProductReviews OFF;"
    }

    if ($subscribers.Count -gt 0) {
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.NewsletterSubscribers ON;"
        foreach ($subscriber in $subscribers) {
            Invoke-NonQuery $connection $transaction @"
INSERT INTO dbo.NewsletterSubscribers (Id, Email, CreatedAt, Status)
VALUES (@id, @email, @createdAt, @status);
"@ @{
                "@id" = [int]$subscriber.id
                "@email" = $subscriber.email
                "@createdAt" = [DateTimeOffset]::Parse($subscriber.createdAt)
                "@status" = $subscriber.status
            }
        }
        Invoke-NonQuery $connection $transaction "SET IDENTITY_INSERT dbo.NewsletterSubscribers OFF;"
    }

    $transaction.Commit()

    [PSCustomObject]@{
        Users = $users.Count
        Products = $products.Count
        Orders = $orders.Count
        Reviews = $reviews.Count
        NewsletterSubscribers = $subscribers.Count
    }
}
catch {
    $transaction.Rollback()
    throw
}
finally {
    $connection.Close()
}
