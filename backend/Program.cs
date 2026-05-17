using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("TechProFrontend", policy =>
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("TechProFrontend");

var dataDirectory = Path.Combine(app.Environment.ContentRootPath, "Data");
Directory.CreateDirectory(dataDirectory);

var productStorePath = Path.Combine(dataDirectory, "products.json");
var orderStorePath = Path.Combine(dataDirectory, "orders.json");
var userStorePath = Path.Combine(dataDirectory, "users.json");

var products = LoadList<Product>(productStorePath);
if (products.Count == 0)
{
    products = BuildProducts();
    SaveList(productStorePath, products);
}

var orders = LoadList<Order>(orderStorePath);
var users = LoadList<UserAccount>(userStorePath);
if (users.Count == 0)
{
    users = BuildUsers();
    SaveList(userStorePath, users);
}

app.MapPost("/api/auth/login", (LoginRequest request) =>
{
    var email = string.IsNullOrWhiteSpace(request.Email) ? "admin@techpro.eng" : request.Email;
    var existingUser = users.FirstOrDefault(user => user.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    if (existingUser is null)
    {
        existingUser = ToUser(users.Count == 0 ? 1 : users.Max(user => user.Id) + 1, new UserRequest(
            string.IsNullOrWhiteSpace(request.FullName) ? email.Split('@')[0] : request.FullName,
            email,
            email.Equals("admin@techpro.eng", StringComparison.OrdinalIgnoreCase) ? "Admin" : "Customer",
            "Active"
        ));
        users.Add(existingUser);
        SaveList(userStorePath, users);
    }

    if (existingUser.Status.Equals("Suspended", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Forbid();
    }

    existingUser = existingUser with { LastLoginAt = DateTimeOffset.UtcNow };
    users[users.FindIndex(user => user.Id == existingUser.Id)] = existingUser;
    SaveList(userStorePath, users);
    return Results.Ok(new AuthResponse(
        "mock_token_123",
        ToProfile(existingUser)
    ));
})
.WithName("Login");

app.MapPost("/api/auth/register", (LoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { message = "Email is required." });
    }

    if (users.Any(user => user.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
    {
        return Results.Conflict(new { message = "Email already exists." });
    }

    var nextId = users.Count == 0 ? 1 : users.Max(user => user.Id) + 1;
    var user = ToUser(nextId, new UserRequest(
        string.IsNullOrWhiteSpace(request.FullName) ? request.Email.Split('@')[0] : request.FullName,
        request.Email,
        "Customer",
        "Active"
    ));
    users.Add(user);
    SaveList(userStorePath, users);

    return Results.Created($"/api/users/{user.Id}", new AuthResponse("mock_token_123", ToProfile(user)));
})
.WithName("Register");

app.MapGet("/api/auth/profile", () =>
{
    var admin = users.First(user => user.Email.Equals("admin@techpro.eng", StringComparison.OrdinalIgnoreCase));
    return Results.Ok(ToProfile(admin));
})
.WithName("GetProfile");

app.MapGet("/api/users", (string? q, string? role, string? status) =>
{
    var query = users.AsEnumerable();

    if (!string.IsNullOrWhiteSpace(q))
    {
        query = query.Where(user =>
            user.Name.Contains(q, StringComparison.OrdinalIgnoreCase) ||
            user.Email.Contains(q, StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(role) && !role.Equals("all", StringComparison.OrdinalIgnoreCase))
    {
        query = query.Where(user => user.Role.Equals(role, StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
    {
        query = query.Where(user => user.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
    }

    return Results.Ok(query.OrderBy(user => user.Name));
})
.WithName("GetUsers");

app.MapPut("/api/users/{id:int}", (int id, UserRequest request) =>
{
    var index = users.FindIndex(user => user.Id == id);
    if (index < 0)
    {
        return Results.NotFound();
    }

    var existing = users[index];
    if (!existing.Email.Equals(request.Email ?? existing.Email, StringComparison.OrdinalIgnoreCase) &&
        users.Any(user => user.Id != id && user.Email.Equals(request.Email ?? "", StringComparison.OrdinalIgnoreCase)))
    {
        return Results.Conflict(new { message = "Email already exists." });
    }

    var updated = ToUser(id, request) with
    {
        CreatedAt = existing.CreatedAt,
        LastLoginAt = existing.LastLoginAt
    };
    users[index] = updated;
    SaveList(userStorePath, users);
    return Results.Ok(updated);
})
.WithName("UpdateUser");

app.MapGet("/api/products", (string? category, string? q) =>
{
    var query = products.AsEnumerable();

    if (!string.IsNullOrWhiteSpace(category))
    {
        query = query.Where(product => product.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
    }

    if (!string.IsNullOrWhiteSpace(q))
    {
        query = query.Where(product =>
            product.Name.Contains(q, StringComparison.OrdinalIgnoreCase) ||
            product.Category.Contains(q, StringComparison.OrdinalIgnoreCase) ||
            product.Sku.Contains(q, StringComparison.OrdinalIgnoreCase));
    }

    return Results.Ok(query);
})
.WithName("GetProducts");

app.MapGet("/api/products/{id:int}", (int id) =>
{
    var product = products.FirstOrDefault(product => product.Id == id);
    return product is null ? Results.NotFound() : Results.Ok(product);
})
.WithName("GetProductById");

app.MapPost("/api/products", (ProductRequest request) =>
{
    var nextId = products.Count == 0 ? 1 : products.Max(product => product.Id) + 1;
    var product = ToProduct(nextId, request);
    products.Add(product);
    SaveList(productStorePath, products);
    return Results.Created($"/api/products/{product.Id}", product);
})
.WithName("CreateProduct");

app.MapPut("/api/products/{id:int}", (int id, ProductRequest request) =>
{
    var index = products.FindIndex(product => product.Id == id);
    if (index < 0)
    {
        return Results.NotFound();
    }

    var product = ToProduct(id, request);
    products[index] = product;
    SaveList(productStorePath, products);
    return Results.Ok(product);
})
.WithName("UpdateProduct");

app.MapDelete("/api/products/{id:int}", (int id) =>
{
    var product = products.FirstOrDefault(product => product.Id == id);
    if (product is null)
    {
        return Results.NotFound();
    }

    products.Remove(product);
    SaveList(productStorePath, products);
    return Results.NoContent();
})
.WithName("DeleteProduct");

app.MapGet("/api/orders", (string? email) =>
{
    var query = orders.AsEnumerable();

    if (!string.IsNullOrWhiteSpace(email))
    {
        query = query.Where(order => order.Customer.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }

    return Results.Ok(query.OrderByDescending(order => order.CreatedAt));
})
.WithName("GetOrders");

app.MapGet("/api/orders/{orderNumber}", (string orderNumber) =>
{
    var order = orders.FirstOrDefault(order => order.OrderNumber.Equals(orderNumber, StringComparison.OrdinalIgnoreCase));
    return order is null ? Results.NotFound() : Results.Ok(order);
})
.WithName("GetOrderByNumber");

app.MapPut("/api/orders/{orderNumber}/status", (string orderNumber, OrderStatusRequest request) =>
{
    var index = orders.FindIndex(order => order.OrderNumber.Equals(orderNumber, StringComparison.OrdinalIgnoreCase));
    if (index < 0)
    {
        return Results.NotFound();
    }

    var allowedStatuses = new[] { "Processing", "Paid", "Packed", "Shipped", "Delivered", "Cancelled" };
    var status = allowedStatuses.FirstOrDefault(value => value.Equals(request.Status, StringComparison.OrdinalIgnoreCase));
    if (string.IsNullOrWhiteSpace(status))
    {
        return Results.BadRequest(new { message = "Unsupported order status." });
    }

    var current = orders[index];
    var updated = current with { Status = status };
    orders[index] = updated;
    SaveList(orderStorePath, orders);
    return Results.Ok(updated);
})
.WithName("UpdateOrderStatus");

app.MapPost("/api/orders", (CreateOrderRequest request) =>
{
    if (request.Items.Count == 0)
    {
        return Results.BadRequest(new { message = "Order must contain at least one item." });
    }

    var orderNumber = $"TP-{DateTimeOffset.UtcNow:yyMMddHHmmss}";
    var order = new Order(
        orderNumber,
        DateTimeOffset.UtcNow,
        "Processing",
        request.Customer,
        request.Items,
        request.Subtotal,
        request.ShippingFee,
        request.Discount,
        request.Total,
        request.ShippingMethod,
        request.PaymentMethod
    );

    orders.Insert(0, order);
    SaveList(orderStorePath, orders);
    return Results.Created($"/api/orders/{orderNumber}", order);
})
.WithName("CreateOrder");

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

static List<Product> BuildProducts()
{
    var categories = new[] { "phones", "laptops", "tablets", "audio", "accessories", "smarthome" };
    var products = new List<Product>();
    var id = 1;

    foreach (var category in categories)
    {
        for (var index = 1; index <= 10; index++)
        {
            var price = 199 + (index * 73) + (category.Length * 11);
            var onSale = index % 4 == 0;
            products.Add(new Product(
                id,
                $"{category.ToUpperInvariant()[..3]} Pro Model {index}",
                category,
                price,
                onSale ? price + 200 : price,
                Math.Round(3.4 + (index % 6) * 0.25, 1),
                $"{category.ToUpperInvariant()[..3]}-{index}000",
                $"https://placehold.co/600x400/222/FFF?text={Uri.EscapeDataString(category)}+{index}",
                index % 3 == 0,
                onSale,
                new[] { category, "TechPro" }
            ));
            id++;
        }
    }

    return products;
}

static List<UserAccount> BuildUsers() => new()
{
    new UserAccount(
        1,
        "Admin Root",
        "admin@techpro.eng",
        "Admin",
        "Active",
        DateTimeOffset.UtcNow,
        null
    ),
    new UserAccount(
        2,
        "Alex Mercer",
        "alex.mercer@techpro.eng",
        "Customer",
        "Active",
        DateTimeOffset.UtcNow,
        null
    )
};

static Product ToProduct(int id, ProductRequest request)
{
    var category = string.IsNullOrWhiteSpace(request.Category) ? "accessories" : request.Category.Trim().ToLowerInvariant();
    var sku = string.IsNullOrWhiteSpace(request.Sku) ? $"PRD-{id:0000}" : request.Sku.Trim();
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

static UserAccount ToUser(int id, UserRequest request)
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

static UserProfile ToProfile(UserAccount user) => new(user.Id, user.Name, user.Email, user.Role, user.Status);

static List<T> LoadList<T>(string path)
{
    if (!File.Exists(path))
    {
        return new List<T>();
    }

    try
    {
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<T>>(json, JsonOptions()) ?? new List<T>();
    }
    catch (JsonException)
    {
        return new List<T>();
    }
}

static void SaveList<T>(string path, List<T> items)
{
    var json = JsonSerializer.Serialize(items, JsonOptions());
    File.WriteAllText(path, json);
}

static JsonSerializerOptions JsonOptions() => new(JsonSerializerDefaults.Web)
{
    WriteIndented = true
};

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record LoginRequest(string? Email, string? Password, string? FullName);

record AuthResponse(string Token, UserProfile User);

record UserProfile(int Id, string Name, string Email, string Role, string Status);

record UserAccount(
    int Id,
    string Name,
    string Email,
    string Role,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? LastLoginAt
);

record UserRequest(string? Name, string? Email, string? Role, string? Status);

record Product(
    int Id,
    string Name,
    string Category,
    decimal Price,
    decimal OriginalPrice,
    double Rating,
    string Sku,
    string Image,
    bool IsNew,
    bool OnSale,
    string[] Tags
);

record ProductRequest(
    string? Name,
    string? Category,
    decimal Price,
    decimal OriginalPrice,
    double Rating,
    string? Sku,
    string? Image,
    bool IsNew,
    bool OnSale,
    string[]? Tags
);

record CreateOrderRequest(
    CustomerInfo Customer,
    List<OrderItem> Items,
    decimal Subtotal,
    decimal ShippingFee,
    decimal Discount,
    decimal Total,
    string ShippingMethod,
    string PaymentMethod
);

record OrderStatusRequest(string Status);

record CustomerInfo(
    string FullName,
    string Phone,
    string Email,
    string City,
    string District,
    string Ward,
    string Address
);

record OrderItem(
    int Id,
    string Name,
    decimal Price,
    int Quantity,
    string? Image,
    string? Category,
    string? Storage
);

record Order(
    string OrderNumber,
    DateTimeOffset CreatedAt,
    string Status,
    CustomerInfo Customer,
    List<OrderItem> Items,
    decimal Subtotal,
    decimal ShippingFee,
    decimal Discount,
    decimal Total,
    string ShippingMethod,
    string PaymentMethod
);
