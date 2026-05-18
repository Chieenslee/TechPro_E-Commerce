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

var sqlStore = new SqlStore(builder.Configuration.GetConnectionString("TechProDb"));
var useSqlProducts = await sqlStore.CanConnectAsync();

var dataDirectory = Path.Combine(app.Environment.ContentRootPath, "Data");
Directory.CreateDirectory(dataDirectory);

var productStorePath = Path.Combine(dataDirectory, "products.json");
var orderStorePath = Path.Combine(dataDirectory, "orders.json");
var userStorePath = Path.Combine(dataDirectory, "users.json");
var newsletterStorePath = Path.Combine(dataDirectory, "newsletterSubscribers.json");
var reviewStorePath = Path.Combine(dataDirectory, "reviews.json");

var products = LoadList<Product>(productStorePath);
if (products.Count == 0)
{
    products = BuildProducts();
    SaveList(productStorePath, products);
}

var orders = LoadList<Order>(orderStorePath);
var reviews = LoadList<ProductReview>(reviewStorePath);
if (reviews.Count == 0)
{
    reviews = BuildReviews(products);
    SaveList(reviewStorePath, reviews);
}
var users = LoadList<UserAccount>(userStorePath);
if (users.Count == 0)
{
    users = BuildUsers();
    SaveList(userStorePath, users);
}
var newsletterSubscribers = LoadList<NewsletterSubscriber>(newsletterStorePath);

app.MapPost("/api/auth/login", async (LoginRequest request) =>
{
    var email = string.IsNullOrWhiteSpace(request.Email) ? "admin@techpro.eng" : request.Email;
    var existingUser = useSqlProducts
        ? await sqlStore.GetUserByEmailAsync(email)
        : users.FirstOrDefault(user => user.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

    if (existingUser is null)
    {
        var newUserRequest = new UserRequest(
            string.IsNullOrWhiteSpace(request.FullName) ? email.Split('@')[0] : request.FullName,
            email,
            email.Equals("admin@techpro.eng", StringComparison.OrdinalIgnoreCase) ? "Admin" : "Customer",
            "Active"
        );

        if (useSqlProducts)
        {
            existingUser = await sqlStore.CreateUserAsync(newUserRequest);
        }
        else
        {
            existingUser = ToUser(users.Count == 0 ? 1 : users.Max(user => user.Id) + 1, newUserRequest);
            users.Add(existingUser);
            SaveList(userStorePath, users);
        }
    }

    if (existingUser.Status.Equals("Suspended", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Forbid();
    }

    if (useSqlProducts)
    {
        existingUser = await sqlStore.TouchUserLoginAsync(existingUser.Id) ?? existingUser;
    }
    else
    {
        existingUser = existingUser with { LastLoginAt = DateTimeOffset.UtcNow };
        users[users.FindIndex(user => user.Id == existingUser.Id)] = existingUser;
        SaveList(userStorePath, users);
    }

    return Results.Ok(new AuthResponse(
        "mock_token_123",
        ToProfile(existingUser)
    ));
})
.WithName("Login");

app.MapPost("/api/auth/register", async (LoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { message = "Email is required." });
    }

    if (useSqlProducts && await sqlStore.GetUserByEmailAsync(request.Email) is not null)
    {
        return Results.Conflict(new { message = "Email already exists." });
    }

    if (!useSqlProducts && users.Any(user => user.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase)))
    {
        return Results.Conflict(new { message = "Email already exists." });
    }

    var userRequest = new UserRequest(
        string.IsNullOrWhiteSpace(request.FullName) ? request.Email.Split('@')[0] : request.FullName,
        request.Email,
        "Customer",
        "Active"
    );
    var user = useSqlProducts
        ? await sqlStore.CreateUserAsync(userRequest)
        : ToUser(users.Count == 0 ? 1 : users.Max(user => user.Id) + 1, userRequest);

    if (!useSqlProducts)
    {
        users.Add(user);
        SaveList(userStorePath, users);
    }

    return Results.Created($"/api/users/{user.Id}", new AuthResponse("mock_token_123", ToProfile(user)));
})
.WithName("Register");

app.MapGet("/api/auth/profile", async () =>
{
    var admin = useSqlProducts
        ? await sqlStore.GetAdminProfileAsync()
        : users.First(user => user.Email.Equals("admin@techpro.eng", StringComparison.OrdinalIgnoreCase));
    if (admin is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(ToProfile(admin));
})
.WithName("GetProfile");

app.MapGet("/api/users", async (string? q, string? role, string? status) =>
{
    if (useSqlProducts)
    {
        return Results.Ok(await sqlStore.GetUsersAsync(q, role, status));
    }

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

app.MapPut("/api/users/{id:int}", async (int id, UserRequest request) =>
{
    if (useSqlProducts)
    {
        var updatedUser = await sqlStore.UpdateUserAsync(id, request);
        return updatedUser is null ? Results.NotFound() : Results.Ok(updatedUser);
    }

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

app.MapGet("/api/newsletter/subscribers", async () =>
{
    if (useSqlProducts)
    {
        return Results.Ok(await sqlStore.GetNewsletterSubscribersAsync());
    }

    return Results.Ok(newsletterSubscribers.OrderByDescending(subscriber => subscriber.CreatedAt));
})
.WithName("GetNewsletterSubscribers");

app.MapPost("/api/newsletter/subscribe", async (NewsletterRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { message = "Email is required." });
    }

    var email = request.Email.Trim().ToLowerInvariant();
    if (useSqlProducts)
    {
        var sqlSubscriber = await sqlStore.SubscribeNewsletterAsync(email);
        return Results.Ok(sqlSubscriber);
    }

    var existing = newsletterSubscribers.FirstOrDefault(subscriber => subscriber.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    if (existing is not null)
    {
        return Results.Ok(existing);
    }

    var subscriber = new NewsletterSubscriber(
        newsletterSubscribers.Count == 0 ? 1 : newsletterSubscribers.Max(item => item.Id) + 1,
        email,
        DateTimeOffset.UtcNow,
        "Active"
    );
    newsletterSubscribers.Add(subscriber);
    SaveList(newsletterStorePath, newsletterSubscribers);
    return Results.Created($"/api/newsletter/subscribers/{subscriber.Id}", subscriber);
})
.WithName("SubscribeNewsletter");

app.MapGet("/api/system/storage", () =>
{
    return Results.Ok(new
    {
        database = useSqlProducts ? "sql" : "json",
        fallback = useSqlProducts ? null : "SQL is unavailable or schema has not been applied."
    });
})
.WithName("GetStorageStatus");

app.MapGet("/api/products", async (string? category, string? q) =>
{
    if (useSqlProducts)
    {
        return Results.Ok(await sqlStore.GetProductsAsync(category, q));
    }

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

app.MapGet("/api/products/{id:int}", async (int id) =>
{
    if (useSqlProducts)
    {
        var sqlProduct = await sqlStore.GetProductByIdAsync(id);
        return sqlProduct is null ? Results.NotFound() : Results.Ok(sqlProduct);
    }

    var product = products.FirstOrDefault(product => product.Id == id);
    return product is null ? Results.NotFound() : Results.Ok(product);
})
.WithName("GetProductById");

app.MapGet("/api/products/{id:int}/reviews", async (int id) =>
{
    if (useSqlProducts)
    {
        if (await sqlStore.GetProductByIdAsync(id) is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(await sqlStore.GetProductReviewsAsync(id));
    }

    if (!products.Any(product => product.Id == id))
    {
        return Results.NotFound();
    }

    return Results.Ok(reviews
        .Where(review => review.ProductId == id)
        .OrderByDescending(review => review.CreatedAt));
})
.WithName("GetProductReviews");

app.MapPost("/api/products/{id:int}/reviews", async (int id, ProductReviewRequest request) =>
{
    if (useSqlProducts && await sqlStore.GetProductByIdAsync(id) is null)
    {
        return Results.NotFound();
    }

    if (!useSqlProducts && !products.Any(product => product.Id == id))
    {
        return Results.NotFound();
    }

    if (string.IsNullOrWhiteSpace(request.Author) || string.IsNullOrWhiteSpace(request.Comment))
    {
        return Results.BadRequest(new { message = "Author and comment are required." });
    }

    if (request.Rating < 1 || request.Rating > 5)
    {
        return Results.BadRequest(new { message = "Rating must be between 1 and 5." });
    }

    if (useSqlProducts)
    {
        var sqlReview = await sqlStore.CreateProductReviewAsync(id, request);
        return Results.Created($"/api/products/{id}/reviews/{sqlReview.Id}", sqlReview);
    }

    var review = new ProductReview(
        reviews.Count == 0 ? 1 : reviews.Max(item => item.Id) + 1,
        id,
        request.Author.Trim(),
        request.Rating,
        request.Comment.Trim(),
        DateTimeOffset.UtcNow
    );
    reviews.Add(review);
    SaveList(reviewStorePath, reviews);
    return Results.Created($"/api/products/{id}/reviews/{review.Id}", review);
})
.WithName("CreateProductReview");

app.MapPost("/api/products", async (ProductRequest request) =>
{
    if (useSqlProducts)
    {
        var sqlProduct = await sqlStore.CreateProductAsync(request);
        return Results.Created($"/api/products/{sqlProduct.Id}", sqlProduct);
    }

    var nextId = products.Count == 0 ? 1 : products.Max(product => product.Id) + 1;
    var product = ToProduct(nextId, request);
    products.Add(product);
    SaveList(productStorePath, products);
    return Results.Created($"/api/products/{product.Id}", product);
})
.WithName("CreateProduct");

app.MapPut("/api/products/{id:int}", async (int id, ProductRequest request) =>
{
    if (useSqlProducts)
    {
        var sqlProduct = await sqlStore.UpdateProductAsync(id, request);
        return sqlProduct is null ? Results.NotFound() : Results.Ok(sqlProduct);
    }

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

app.MapDelete("/api/products/{id:int}", async (int id) =>
{
    if (useSqlProducts)
    {
        return await sqlStore.DeleteProductAsync(id) ? Results.NoContent() : Results.NotFound();
    }

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

app.MapGet("/api/orders", async (string? email) =>
{
    if (useSqlProducts)
    {
        return Results.Ok(await sqlStore.GetOrdersAsync(email));
    }

    var query = orders.AsEnumerable();

    if (!string.IsNullOrWhiteSpace(email))
    {
        query = query.Where(order => order.Customer.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }

    return Results.Ok(query.OrderByDescending(order => order.CreatedAt));
})
.WithName("GetOrders");

app.MapGet("/api/orders/{orderNumber}", async (string orderNumber) =>
{
    if (useSqlProducts)
    {
        var sqlOrder = await sqlStore.GetOrderByNumberAsync(orderNumber);
        return sqlOrder is null ? Results.NotFound() : Results.Ok(sqlOrder);
    }

    var order = orders.FirstOrDefault(order => order.OrderNumber.Equals(orderNumber, StringComparison.OrdinalIgnoreCase));
    return order is null ? Results.NotFound() : Results.Ok(order);
})
.WithName("GetOrderByNumber");

app.MapPut("/api/orders/{orderNumber}/status", async (string orderNumber, OrderStatusRequest request) =>
{
    var allowedStatuses = new[] { "Processing", "Paid", "Packed", "Shipped", "Delivered", "Cancelled" };
    var status = allowedStatuses.FirstOrDefault(value => value.Equals(request.Status, StringComparison.OrdinalIgnoreCase));
    if (string.IsNullOrWhiteSpace(status))
    {
        return Results.BadRequest(new { message = "Unsupported order status." });
    }

    if (useSqlProducts)
    {
        var sqlOrder = await sqlStore.UpdateOrderStatusAsync(orderNumber, status);
        return sqlOrder is null ? Results.NotFound() : Results.Ok(sqlOrder);
    }

    var index = orders.FindIndex(order => order.OrderNumber.Equals(orderNumber, StringComparison.OrdinalIgnoreCase));
    if (index < 0)
    {
        return Results.NotFound();
    }

    var current = orders[index];
    var updated = current with { Status = status };
    orders[index] = updated;
    SaveList(orderStorePath, orders);
    return Results.Ok(updated);
})
.WithName("UpdateOrderStatus");

app.MapPost("/api/orders", async (CreateOrderRequest request) =>
{
    if (request.Items.Count == 0)
    {
        return Results.BadRequest(new { message = "Order must contain at least one item." });
    }

    if (useSqlProducts)
    {
        var sqlOrder = await sqlStore.CreateOrderAsync(request);
        return Results.Created($"/api/orders/{sqlOrder.OrderNumber}", sqlOrder);
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

static List<ProductReview> BuildReviews(List<Product> products)
{
    var now = DateTimeOffset.UtcNow;
    var reviews = new List<ProductReview>();

    foreach (var product in products.Take(6))
    {
        reviews.Add(new ProductReview(
            reviews.Count + 1,
            product.Id,
            "John D.",
            5,
            "Excellent performance and build quality. It feels fast, polished, and ready for everyday work.",
            now.AddDays(-(product.Id + 2))
        ));
        reviews.Add(new ProductReview(
            reviews.Count + 1,
            product.Id,
            "Sarah W.",
            4,
            "Great display and smooth setup. The accessories could be lighter, but the product itself is impressive.",
            now.AddDays(-(product.Id + 9))
        ));
    }

    return reviews;
}

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

record NewsletterRequest(string? Email);

record NewsletterSubscriber(int Id, string Email, DateTimeOffset CreatedAt, string Status);

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

record ProductReview(
    int Id,
    int ProductId,
    string Author,
    int Rating,
    string Comment,
    DateTimeOffset CreatedAt
);

record ProductReviewRequest(string? Author, int Rating, string? Comment);

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
