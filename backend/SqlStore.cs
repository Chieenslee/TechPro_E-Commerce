using Microsoft.Data.SqlClient;

sealed class SqlStore
{
    private readonly string? _connectionString;

    public SqlStore(string? connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<bool> CanConnectAsync()
    {
        if (string.IsNullOrWhiteSpace(_connectionString))
        {
            return false;
        }

        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            await using var command = new SqlCommand("SELECT OBJECT_ID('dbo.Products')", connection);
            var result = await command.ExecuteScalarAsync();
            return result is not null and not DBNull;
        }
        catch (SqlException)
        {
            return false;
        }
        catch (InvalidOperationException)
        {
            return false;
        }
    }

    public async Task<List<Product>> GetProductsAsync(string? category = null, string? q = null)
    {
        await using var connection = await OpenAsync();
        var filters = new List<string>();
        var command = connection.CreateCommand();

        if (!string.IsNullOrWhiteSpace(category))
        {
            filters.Add("p.Category = @category");
            command.Parameters.AddWithValue("@category", category);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            filters.Add("(p.Name LIKE @q OR p.Category LIKE @q OR p.Sku LIKE @q)");
            command.Parameters.AddWithValue("@q", $"%{q}%");
        }

        command.CommandText = $"""
            SELECT p.Id, p.Name, p.Category, p.Price, p.OriginalPrice, p.Rating, p.Sku, p.Image, p.IsNew, p.OnSale,
                   STRING_AGG(t.Tag, ',') AS Tags
            FROM dbo.Products p
            LEFT JOIN dbo.ProductTags t ON t.ProductId = p.Id
            {(filters.Count > 0 ? "WHERE " + string.Join(" AND ", filters) : "")}
            GROUP BY p.Id, p.Name, p.Category, p.Price, p.OriginalPrice, p.Rating, p.Sku, p.Image, p.IsNew, p.OnSale
            ORDER BY p.Id
            """;

        return await ReadProductsAsync(command);
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT p.Id, p.Name, p.Category, p.Price, p.OriginalPrice, p.Rating, p.Sku, p.Image, p.IsNew, p.OnSale,
                   STRING_AGG(t.Tag, ',') AS Tags
            FROM dbo.Products p
            LEFT JOIN dbo.ProductTags t ON t.ProductId = p.Id
            WHERE p.Id = @id
            GROUP BY p.Id, p.Name, p.Category, p.Price, p.OriginalPrice, p.Rating, p.Sku, p.Image, p.IsNew, p.OnSale
            """;
        command.Parameters.AddWithValue("@id", id);
        return (await ReadProductsAsync(command)).FirstOrDefault();
    }

    public async Task<Product> CreateProductAsync(ProductRequest request)
    {
        await using var connection = await OpenAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        var product = ToProduct(0, request);

        await using var command = connection.CreateCommand();
        command.Transaction = (SqlTransaction)transaction;
        command.CommandText = """
            INSERT INTO dbo.Products (Name, Category, Price, OriginalPrice, Rating, Sku, Image, IsNew, OnSale)
            OUTPUT INSERTED.Id
            VALUES (@name, @category, @price, @originalPrice, @rating, @sku, @image, @isNew, @onSale)
            """;
        AddProductParameters(command, product);
        var id = Convert.ToInt32(await command.ExecuteScalarAsync());
        var saved = product with { Id = id };
        await ReplaceTagsAsync(connection, (SqlTransaction)transaction, saved);
        await transaction.CommitAsync();
        return saved;
    }

    public async Task<Product?> UpdateProductAsync(int id, ProductRequest request)
    {
        await using var connection = await OpenAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        var product = ToProduct(id, request);

        await using var command = connection.CreateCommand();
        command.Transaction = (SqlTransaction)transaction;
        command.CommandText = """
            UPDATE dbo.Products
            SET Name = @name,
                Category = @category,
                Price = @price,
                OriginalPrice = @originalPrice,
                Rating = @rating,
                Sku = @sku,
                Image = @image,
                IsNew = @isNew,
                OnSale = @onSale,
                UpdatedAt = SYSDATETIMEOFFSET()
            WHERE Id = @id
            """;
        AddProductParameters(command, product);
        command.Parameters.AddWithValue("@id", id);
        var affected = await command.ExecuteNonQueryAsync();
        if (affected == 0)
        {
            await transaction.RollbackAsync();
            return null;
        }

        await ReplaceTagsAsync(connection, (SqlTransaction)transaction, product);
        await transaction.CommitAsync();
        return product;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM dbo.Products WHERE Id = @id";
        command.Parameters.AddWithValue("@id", id);
        return await command.ExecuteNonQueryAsync() > 0;
    }

    public async Task<List<UserAccount>> GetUsersAsync(string? q = null, string? role = null, string? status = null)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        var filters = new List<string>();

        if (!string.IsNullOrWhiteSpace(q))
        {
            filters.Add("(Name LIKE @q OR Email LIKE @q)");
            command.Parameters.AddWithValue("@q", $"%{q}%");
        }

        if (!string.IsNullOrWhiteSpace(role) && !role.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add("Role = @role");
            command.Parameters.AddWithValue("@role", role);
        }

        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            filters.Add("Status = @status");
            command.Parameters.AddWithValue("@status", status);
        }

        command.CommandText = $"""
            SELECT Id, Name, Email, Role, Status, CreatedAt, LastLoginAt
            FROM dbo.Users
            {(filters.Count > 0 ? "WHERE " + string.Join(" AND ", filters) : "")}
            ORDER BY Name
            """;
        return await ReadUsersAsync(command);
    }

    public async Task<UserAccount?> GetUserByEmailAsync(string email)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Name, Email, Role, Status, CreatedAt, LastLoginAt
            FROM dbo.Users
            WHERE Email = @email
            """;
        command.Parameters.AddWithValue("@email", email);
        return (await ReadUsersAsync(command)).FirstOrDefault();
    }

    public async Task<UserAccount?> GetAdminProfileAsync()
    {
        return await GetUserByEmailAsync("admin@techpro.eng");
    }

    public async Task<UserAccount> CreateUserAsync(UserRequest request)
    {
        var user = ToUser(0, request);
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO dbo.Users (Name, Email, Role, Status)
            OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Email, INSERTED.Role, INSERTED.Status, INSERTED.CreatedAt, INSERTED.LastLoginAt
            VALUES (@name, @email, @role, @status)
            """;
        AddUserParameters(command, user);
        return (await ReadUsersAsync(command)).Single();
    }

    public async Task<UserAccount?> UpdateUserAsync(int id, UserRequest request)
    {
        var user = ToUser(id, request);
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE dbo.Users
            SET Name = @name,
                Email = @email,
                Role = @role,
                Status = @status
            OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Email, INSERTED.Role, INSERTED.Status, INSERTED.CreatedAt, INSERTED.LastLoginAt
            WHERE Id = @id
            """;
        AddUserParameters(command, user);
        command.Parameters.AddWithValue("@id", id);
        return (await ReadUsersAsync(command)).FirstOrDefault();
    }

    public async Task<UserAccount?> TouchUserLoginAsync(int id)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE dbo.Users
            SET LastLoginAt = SYSDATETIMEOFFSET()
            OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Email, INSERTED.Role, INSERTED.Status, INSERTED.CreatedAt, INSERTED.LastLoginAt
            WHERE Id = @id
            """;
        command.Parameters.AddWithValue("@id", id);
        return (await ReadUsersAsync(command)).FirstOrDefault();
    }

    public async Task<List<Order>> GetOrdersAsync(string? email = null)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        var whereClause = "";

        if (!string.IsNullOrWhiteSpace(email))
        {
            whereClause = "WHERE CustomerEmail = @email";
            command.Parameters.AddWithValue("@email", email.Trim().ToLowerInvariant());
        }

        command.CommandText = $"""
            SELECT OrderNumber, CreatedAt, Status, CustomerFullName, CustomerPhone, CustomerEmail,
                   City, District, Ward, Address, Subtotal, ShippingFee, Discount, Total,
                   ShippingMethod, PaymentMethod
            FROM dbo.Orders
            {whereClause}
            ORDER BY CreatedAt DESC
            """;

        var orders = await ReadOrdersAsync(command);
        return await AttachOrderItemsAsync(connection, orders);
    }

    public async Task<Order?> GetOrderByNumberAsync(string orderNumber)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT OrderNumber, CreatedAt, Status, CustomerFullName, CustomerPhone, CustomerEmail,
                   City, District, Ward, Address, Subtotal, ShippingFee, Discount, Total,
                   ShippingMethod, PaymentMethod
            FROM dbo.Orders
            WHERE OrderNumber = @orderNumber
            """;
        command.Parameters.AddWithValue("@orderNumber", orderNumber);

        var orders = await ReadOrdersAsync(command);
        return (await AttachOrderItemsAsync(connection, orders)).FirstOrDefault();
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request)
    {
        await using var connection = await OpenAsync();
        await using var transaction = await connection.BeginTransactionAsync();
        var orderNumber = $"TP-{DateTimeOffset.UtcNow:yyMMddHHmmss}";
        var customerEmail = request.Customer.Email.Trim().ToLowerInvariant();

        await using var command = connection.CreateCommand();
        command.Transaction = (SqlTransaction)transaction;
        command.CommandText = """
            INSERT INTO dbo.Orders (
                OrderNumber, UserId, Status, CustomerFullName, CustomerPhone, CustomerEmail,
                City, District, Ward, Address, Subtotal, ShippingFee, Discount, Total,
                ShippingMethod, PaymentMethod
            )
            VALUES (
                @orderNumber,
                (SELECT TOP 1 Id FROM dbo.Users WHERE Email = @customerEmail),
                @status, @customerFullName, @customerPhone, @customerEmail,
                @city, @district, @ward, @address, @subtotal, @shippingFee, @discount, @total,
                @shippingMethod, @paymentMethod
            )
            """;
        AddOrderParameters(command, orderNumber, "Processing", request);
        await command.ExecuteNonQueryAsync();
        await InsertOrderItemsAsync(connection, (SqlTransaction)transaction, orderNumber, request.Items);
        await transaction.CommitAsync();

        return new Order(
            orderNumber,
            DateTimeOffset.UtcNow,
            "Processing",
            request.Customer with { Email = customerEmail },
            request.Items,
            request.Subtotal,
            request.ShippingFee,
            request.Discount,
            request.Total,
            request.ShippingMethod,
            request.PaymentMethod
        );
    }

    public async Task<Order?> UpdateOrderStatusAsync(string orderNumber, string status)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            UPDATE dbo.Orders
            SET Status = @status,
                UpdatedAt = SYSDATETIMEOFFSET()
            WHERE OrderNumber = @orderNumber
            """;
        command.Parameters.AddWithValue("@orderNumber", orderNumber);
        command.Parameters.AddWithValue("@status", status);

        if (await command.ExecuteNonQueryAsync() == 0)
        {
            return null;
        }

        return await GetOrderByNumberAsync(orderNumber);
    }

    public async Task<List<NewsletterSubscriber>> GetNewsletterSubscribersAsync()
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, Email, CreatedAt, Status
            FROM dbo.NewsletterSubscribers
            ORDER BY CreatedAt DESC
            """;
        return await ReadNewsletterSubscribersAsync(command);
    }

    public async Task<NewsletterSubscriber> SubscribeNewsletterAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        await using var connection = await OpenAsync();

        await using (var existingCommand = connection.CreateCommand())
        {
            existingCommand.CommandText = """
                SELECT Id, Email, CreatedAt, Status
                FROM dbo.NewsletterSubscribers
                WHERE Email = @email
                """;
            existingCommand.Parameters.AddWithValue("@email", normalizedEmail);
            var existing = (await ReadNewsletterSubscribersAsync(existingCommand)).FirstOrDefault();
            if (existing is not null)
            {
                return existing;
            }
        }

        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO dbo.NewsletterSubscribers (Email, Status)
            OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.CreatedAt, INSERTED.Status
            VALUES (@email, 'Active')
            """;
        command.Parameters.AddWithValue("@email", normalizedEmail);
        return (await ReadNewsletterSubscribersAsync(command)).Single();
    }

    public async Task<List<ProductReview>> GetProductReviewsAsync(int productId)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT Id, ProductId, Author, Rating, Comment, CreatedAt
            FROM dbo.ProductReviews
            WHERE ProductId = @productId
            ORDER BY CreatedAt DESC
            """;
        command.Parameters.AddWithValue("@productId", productId);
        return await ReadProductReviewsAsync(command);
    }

    public async Task<ProductReview> CreateProductReviewAsync(int productId, ProductReviewRequest request)
    {
        await using var connection = await OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO dbo.ProductReviews (ProductId, Author, Rating, Comment)
            OUTPUT INSERTED.Id, INSERTED.ProductId, INSERTED.Author, INSERTED.Rating, INSERTED.Comment, INSERTED.CreatedAt
            VALUES (@productId, @author, @rating, @comment)
            """;
        command.Parameters.AddWithValue("@productId", productId);
        command.Parameters.AddWithValue("@author", request.Author!.Trim());
        command.Parameters.AddWithValue("@rating", request.Rating);
        command.Parameters.AddWithValue("@comment", request.Comment!.Trim());
        return (await ReadProductReviewsAsync(command)).Single();
    }

    private async Task<SqlConnection> OpenAsync()
    {
        var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        return connection;
    }

    private static async Task<List<Product>> ReadProductsAsync(SqlCommand command)
    {
        var products = new List<Product>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var tags = reader["Tags"] is DBNull ? Array.Empty<string>() : reader.GetString(reader.GetOrdinal("Tags")).Split(',', StringSplitOptions.RemoveEmptyEntries);
            products.Add(new Product(
                reader.GetInt32(reader.GetOrdinal("Id")),
                reader.GetString(reader.GetOrdinal("Name")),
                reader.GetString(reader.GetOrdinal("Category")),
                reader.GetDecimal(reader.GetOrdinal("Price")),
                reader.GetDecimal(reader.GetOrdinal("OriginalPrice")),
                Convert.ToDouble(reader.GetDecimal(reader.GetOrdinal("Rating"))),
                reader.GetString(reader.GetOrdinal("Sku")),
                reader["Image"] is DBNull ? "" : reader.GetString(reader.GetOrdinal("Image")),
                reader.GetBoolean(reader.GetOrdinal("IsNew")),
                reader.GetBoolean(reader.GetOrdinal("OnSale")),
                tags
            ));
        }

        return products;
    }

    private static async Task<List<UserAccount>> ReadUsersAsync(SqlCommand command)
    {
        var users = new List<UserAccount>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            users.Add(new UserAccount(
                reader.GetInt32(reader.GetOrdinal("Id")),
                reader.GetString(reader.GetOrdinal("Name")),
                reader.GetString(reader.GetOrdinal("Email")),
                reader.GetString(reader.GetOrdinal("Role")),
                reader.GetString(reader.GetOrdinal("Status")),
                reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("CreatedAt")),
                reader["LastLoginAt"] is DBNull ? null : reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("LastLoginAt"))
            ));
        }

        return users;
    }

    private static async Task<List<Order>> ReadOrdersAsync(SqlCommand command)
    {
        var orders = new List<Order>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var customer = new CustomerInfo(
                reader.GetString(reader.GetOrdinal("CustomerFullName")),
                reader.GetString(reader.GetOrdinal("CustomerPhone")),
                reader.GetString(reader.GetOrdinal("CustomerEmail")),
                reader.GetString(reader.GetOrdinal("City")),
                reader.GetString(reader.GetOrdinal("District")),
                reader.GetString(reader.GetOrdinal("Ward")),
                reader.GetString(reader.GetOrdinal("Address"))
            );

            orders.Add(new Order(
                reader.GetString(reader.GetOrdinal("OrderNumber")),
                reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("CreatedAt")),
                reader.GetString(reader.GetOrdinal("Status")),
                customer,
                new List<OrderItem>(),
                reader.GetDecimal(reader.GetOrdinal("Subtotal")),
                reader.GetDecimal(reader.GetOrdinal("ShippingFee")),
                reader.GetDecimal(reader.GetOrdinal("Discount")),
                reader.GetDecimal(reader.GetOrdinal("Total")),
                reader.GetString(reader.GetOrdinal("ShippingMethod")),
                reader.GetString(reader.GetOrdinal("PaymentMethod"))
            ));
        }

        return orders;
    }

    private static async Task<List<NewsletterSubscriber>> ReadNewsletterSubscribersAsync(SqlCommand command)
    {
        var subscribers = new List<NewsletterSubscriber>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            subscribers.Add(new NewsletterSubscriber(
                reader.GetInt32(reader.GetOrdinal("Id")),
                reader.GetString(reader.GetOrdinal("Email")),
                reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("CreatedAt")),
                reader.GetString(reader.GetOrdinal("Status"))
            ));
        }

        return subscribers;
    }

    private static async Task<List<ProductReview>> ReadProductReviewsAsync(SqlCommand command)
    {
        var reviews = new List<ProductReview>();
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            reviews.Add(new ProductReview(
                reader.GetInt32(reader.GetOrdinal("Id")),
                reader.GetInt32(reader.GetOrdinal("ProductId")),
                reader.GetString(reader.GetOrdinal("Author")),
                reader.GetInt32(reader.GetOrdinal("Rating")),
                reader.GetString(reader.GetOrdinal("Comment")),
                reader.GetFieldValue<DateTimeOffset>(reader.GetOrdinal("CreatedAt"))
            ));
        }

        return reviews;
    }

    private static async Task<List<Order>> AttachOrderItemsAsync(SqlConnection connection, List<Order> orders)
    {
        var hydratedOrders = new List<Order>();
        foreach (var order in orders)
        {
            await using var command = connection.CreateCommand();
            command.CommandText = """
                SELECT ProductId, Name, Price, Quantity, Image, Category, Storage
                FROM dbo.OrderItems
                WHERE OrderNumber = @orderNumber
                ORDER BY Id
                """;
            command.Parameters.AddWithValue("@orderNumber", order.OrderNumber);

            var items = new List<OrderItem>();
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                items.Add(new OrderItem(
                    reader["ProductId"] is DBNull ? 0 : reader.GetInt32(reader.GetOrdinal("ProductId")),
                    reader.GetString(reader.GetOrdinal("Name")),
                    reader.GetDecimal(reader.GetOrdinal("Price")),
                    reader.GetInt32(reader.GetOrdinal("Quantity")),
                    reader["Image"] is DBNull ? null : reader.GetString(reader.GetOrdinal("Image")),
                    reader["Category"] is DBNull ? null : reader.GetString(reader.GetOrdinal("Category")),
                    reader["Storage"] is DBNull ? null : reader.GetString(reader.GetOrdinal("Storage"))
                ));
            }

            hydratedOrders.Add(order with { Items = items });
        }

        return hydratedOrders;
    }

    private static void AddProductParameters(SqlCommand command, Product product)
    {
        command.Parameters.AddWithValue("@name", product.Name);
        command.Parameters.AddWithValue("@category", product.Category);
        command.Parameters.AddWithValue("@price", product.Price);
        command.Parameters.AddWithValue("@originalPrice", product.OriginalPrice);
        command.Parameters.AddWithValue("@rating", Convert.ToDecimal(product.Rating));
        command.Parameters.AddWithValue("@sku", product.Sku);
        command.Parameters.AddWithValue("@image", string.IsNullOrWhiteSpace(product.Image) ? DBNull.Value : product.Image);
        command.Parameters.AddWithValue("@isNew", product.IsNew);
        command.Parameters.AddWithValue("@onSale", product.OnSale);
    }

    private static async Task ReplaceTagsAsync(SqlConnection connection, SqlTransaction transaction, Product product)
    {
        await using var delete = connection.CreateCommand();
        delete.Transaction = transaction;
        delete.CommandText = "DELETE FROM dbo.ProductTags WHERE ProductId = @productId";
        delete.Parameters.AddWithValue("@productId", product.Id);
        await delete.ExecuteNonQueryAsync();

        foreach (var tag in product.Tags.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            await using var insert = connection.CreateCommand();
            insert.Transaction = transaction;
            insert.CommandText = "INSERT INTO dbo.ProductTags (ProductId, Tag) VALUES (@productId, @tag)";
            insert.Parameters.AddWithValue("@productId", product.Id);
            insert.Parameters.AddWithValue("@tag", tag);
            await insert.ExecuteNonQueryAsync();
        }
    }

    private static Product ToProduct(int id, ProductRequest request)
    {
        var category = string.IsNullOrWhiteSpace(request.Category) ? "accessories" : request.Category.Trim().ToLowerInvariant();
        var sku = string.IsNullOrWhiteSpace(request.Sku) ? $"PRD-{(id == 0 ? DateTimeOffset.UtcNow.ToUnixTimeSeconds() : id):0000}" : request.Sku.Trim();
        var image = string.IsNullOrWhiteSpace(request.Image)
            ? $"https://placehold.co/600x400/222/FFF?text={Uri.EscapeDataString(request.Name ?? "TechPro")}"
            : request.Image.Trim();
        var tags = request.Tags is { Length: > 0 } ? request.Tags : new[] { category, "TechPro" };
        var price = request.Price <= 0 ? 199 : request.Price;
        var originalPrice = request.OriginalPrice < price ? price : request.OriginalPrice;

        return new Product(
            id,
            string.IsNullOrWhiteSpace(request.Name) ? $"TechPro Product {id}" : request.Name.Trim(),
            category,
            price,
            originalPrice,
            request.Rating <= 0 ? 4.5 : Math.Round(request.Rating, 1),
            sku,
            image,
            request.IsNew,
            request.OnSale,
            tags
        );
    }

    private static void AddUserParameters(SqlCommand command, UserAccount user)
    {
        command.Parameters.AddWithValue("@name", user.Name);
        command.Parameters.AddWithValue("@email", user.Email);
        command.Parameters.AddWithValue("@role", user.Role);
        command.Parameters.AddWithValue("@status", user.Status);
    }

    private static UserAccount ToUser(int id, UserRequest request)
    {
        var allowedRoles = new[] { "Admin", "Customer" };
        var allowedStatuses = new[] { "Active", "Suspended" };
        var role = allowedRoles.FirstOrDefault(value => value.Equals(request.Role, StringComparison.OrdinalIgnoreCase)) ?? "Customer";
        var status = allowedStatuses.FirstOrDefault(value => value.Equals(request.Status, StringComparison.OrdinalIgnoreCase)) ?? "Active";
        var email = string.IsNullOrWhiteSpace(request.Email) ? $"user{id}@techpro.eng" : request.Email.Trim().ToLowerInvariant();

        return new UserAccount(
            id,
            string.IsNullOrWhiteSpace(request.Name) ? email.Split('@')[0] : request.Name.Trim(),
            email,
            role,
            status,
            DateTimeOffset.UtcNow,
            null
        );
    }

    private static void AddOrderParameters(SqlCommand command, string orderNumber, string status, CreateOrderRequest request)
    {
        command.Parameters.AddWithValue("@orderNumber", orderNumber);
        command.Parameters.AddWithValue("@status", status);
        command.Parameters.AddWithValue("@customerFullName", request.Customer.FullName);
        command.Parameters.AddWithValue("@customerPhone", request.Customer.Phone);
        command.Parameters.AddWithValue("@customerEmail", request.Customer.Email.Trim().ToLowerInvariant());
        command.Parameters.AddWithValue("@city", request.Customer.City);
        command.Parameters.AddWithValue("@district", request.Customer.District);
        command.Parameters.AddWithValue("@ward", request.Customer.Ward);
        command.Parameters.AddWithValue("@address", request.Customer.Address);
        command.Parameters.AddWithValue("@subtotal", request.Subtotal);
        command.Parameters.AddWithValue("@shippingFee", request.ShippingFee);
        command.Parameters.AddWithValue("@discount", request.Discount);
        command.Parameters.AddWithValue("@total", request.Total);
        command.Parameters.AddWithValue("@shippingMethod", request.ShippingMethod);
        command.Parameters.AddWithValue("@paymentMethod", request.PaymentMethod);
    }

    private static async Task InsertOrderItemsAsync(SqlConnection connection, SqlTransaction transaction, string orderNumber, List<OrderItem> items)
    {
        foreach (var item in items)
        {
            await using var command = connection.CreateCommand();
            command.Transaction = transaction;
            command.CommandText = """
                INSERT INTO dbo.OrderItems (OrderNumber, ProductId, Name, Price, Quantity, Image, Category, Storage)
                VALUES (@orderNumber, @productId, @name, @price, @quantity, @image, @category, @storage)
                """;
            command.Parameters.AddWithValue("@orderNumber", orderNumber);
            command.Parameters.AddWithValue("@productId", item.Id <= 0 ? DBNull.Value : item.Id);
            command.Parameters.AddWithValue("@name", item.Name);
            command.Parameters.AddWithValue("@price", item.Price);
            command.Parameters.AddWithValue("@quantity", item.Quantity);
            command.Parameters.AddWithValue("@image", string.IsNullOrWhiteSpace(item.Image) ? DBNull.Value : item.Image);
            command.Parameters.AddWithValue("@category", string.IsNullOrWhiteSpace(item.Category) ? DBNull.Value : item.Category);
            command.Parameters.AddWithValue("@storage", string.IsNullOrWhiteSpace(item.Storage) ? DBNull.Value : item.Storage);
            await command.ExecuteNonQueryAsync();
        }
    }
}
