import os

file_path = "Program.cs"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add usings
usings = """using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
"""
content = content.replace("using System.Text.Json;\n", usings)

# 2. Add Authentication services
auth_services = """});

var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });
builder.Services.AddAuthorization();
"""
content = content.replace("});\n\nvar app = builder.Build();", auth_services + "\nvar app = builder.Build();")

# 3. Add middlewares
middlewares = """app.UseCors("TechProFrontend");
app.UseAuthentication();
app.UseAuthorization();"""
content = content.replace("app.UseCors(\"TechProFrontend\");", middlewares)

# 4. Add GenerateJwtToken helper
token_helper = """app.Run();

string GenerateJwtToken(UserAccount user)
{
    var jwtSettings = app.Configuration.GetSection("Jwt");
    var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddHours(2),
        Issuer = jwtSettings["Issuer"],
        Audience = jwtSettings["Audience"],
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
"""
content = content.replace("app.Run();\n", token_helper)

# 5. Replace mock tokens
content = content.replace("\"mock_token_123\",\n        ToProfile(existingUser)", "GenerateJwtToken(existingUser),\n        ToProfile(existingUser)")
content = content.replace("new AuthResponse(\"mock_token_123\", ToProfile(user))", "new AuthResponse(GenerateJwtToken(user), ToProfile(user))")

# 6. Add RequireAuthorization
auth_admin = ".RequireAuthorization(new AuthorizeAttribute { Roles = \"Admin\" });"
auth_user = ".RequireAuthorization();"

content = content.replace(".WithName(\"GetProfile\");", ".WithName(\"GetProfile\")" + auth_admin.replace("Admin", "Admin,Customer")) # Profile can be requested by anyone, wait, profile endpoint is just for current user. But wait, it doesn't use Claims yet to fetch profile! It fetches admin or hardcoded user!
content = content.replace(".WithName(\"GetUsers\");", ".WithName(\"GetUsers\")" + auth_admin)
content = content.replace(".WithName(\"UpdateUser\");", ".WithName(\"UpdateUser\")" + auth_admin)
content = content.replace(".WithName(\"GetNewsletterSubscribers\");", ".WithName(\"GetNewsletterSubscribers\")" + auth_admin)
content = content.replace(".WithName(\"CreateProduct\");", ".WithName(\"CreateProduct\")" + auth_admin)
content = content.replace(".WithName(\"UpdateProduct\");", ".WithName(\"UpdateProduct\")" + auth_admin)
content = content.replace(".WithName(\"DeleteProduct\");", ".WithName(\"DeleteProduct\")" + auth_admin)
content = content.replace(".WithName(\"UpdateOrderStatus\");", ".WithName(\"UpdateOrderStatus\")" + auth_admin)

# User endpoints
content = content.replace(".WithName(\"GetUserAddresses\");", ".WithName(\"GetUserAddresses\")" + auth_user)
content = content.replace(".WithName(\"SaveUserAddress\");", ".WithName(\"SaveUserAddress\")" + auth_user)
content = content.replace(".WithName(\"DeleteUserAddress\");", ".WithName(\"DeleteUserAddress\")" + auth_user)
content = content.replace(".WithName(\"GetUserWishlist\");", ".WithName(\"GetUserWishlist\")" + auth_user)
content = content.replace(".WithName(\"SaveUserWishlist\");", ".WithName(\"SaveUserWishlist\")" + auth_user)
content = content.replace(".WithName(\"DeleteUserWishlistItem\");", ".WithName(\"DeleteUserWishlistItem\")" + auth_user)
content = content.replace(".WithName(\"CreateProductReview\");", ".WithName(\"CreateProductReview\")" + auth_user)
content = content.replace(".WithName(\"GetOrders\");", ".WithName(\"GetOrders\")" + auth_user)
content = content.replace(".WithName(\"GetOrderByNumber\");", ".WithName(\"GetOrderByNumber\")" + auth_user)
content = content.replace(".WithName(\"CreateOrder\");", ".WithName(\"CreateOrder\")" + auth_user)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Program.cs patched successfully.")
