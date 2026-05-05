using System.Text.Json;
using TechPro.Models.DTOs;

namespace TechPro.Services;

public static class StorefrontSessionCart
{
    private const string SessionKey = "TechPro.Storefront.Cart";

    public static CartDto GetCart(ISession session)
    {
        var lines = ReadLines(session);
        return Map(lines);
    }

    public static CartDto Add(ISession session, AddToCartDto dto)
    {
        var lines = ReadLines(session);
        var product = StorefrontDemoData.Products().FirstOrDefault(p => p.Id == dto.ProductId);
        if (product == null)
        {
            return Map(lines);
        }

        var line = lines.FirstOrDefault(i => i.ProductId == dto.ProductId && i.VariantId == dto.VariantId);
        if (line == null)
        {
            lines.Add(new SessionCartLine
            {
                Id = lines.Count == 0 ? 1 : lines.Max(i => i.Id) + 1,
                ProductId = dto.ProductId,
                VariantId = dto.VariantId,
                Quantity = Math.Clamp(dto.Quantity, 1, product.Stock)
            });
        }
        else
        {
            line.Quantity = Math.Clamp(line.Quantity + Math.Max(1, dto.Quantity), 1, product.Stock);
        }

        WriteLines(session, lines);
        return Map(lines);
    }

    public static CartDto Update(ISession session, int itemId, int quantity)
    {
        var lines = ReadLines(session);
        var line = lines.FirstOrDefault(i => i.Id == itemId);
        if (line != null)
        {
            if (quantity <= 0)
            {
                lines.Remove(line);
            }
            else
            {
                var product = StorefrontDemoData.Products().FirstOrDefault(p => p.Id == line.ProductId);
                line.Quantity = Math.Clamp(quantity, 1, product?.Stock ?? quantity);
            }
        }

        WriteLines(session, lines);
        return Map(lines);
    }

    public static CartDto Remove(ISession session, int itemId)
    {
        var lines = ReadLines(session);
        lines.RemoveAll(i => i.Id == itemId);
        WriteLines(session, lines);
        return Map(lines);
    }

    public static CartDto Clear(ISession session)
    {
        session.Remove(SessionKey);
        return new CartDto();
    }

    private static CartDto Map(List<SessionCartLine> lines)
    {
        var products = StorefrontDemoData.Products().ToDictionary(p => p.Id);
        return new CartDto
        {
            Id = 1,
            Items = lines
                .Where(line => products.ContainsKey(line.ProductId))
                .Select(line =>
                {
                    var product = products[line.ProductId];
                    return new CartItemDto
                    {
                        Id = line.Id,
                        ProductId = product.Id,
                        ProductName = product.Name,
                        ProductSlug = product.Slug,
                        ProductImage = product.PrimaryImage,
                        UnitPrice = product.Price,
                        VariantId = line.VariantId,
                        VariantInfo = line.VariantId.HasValue ? "Phien ban demo" : null,
                        Quantity = line.Quantity,
                        MaxStock = product.Stock
                    };
                })
                .ToList()
        };
    }

    private static List<SessionCartLine> ReadLines(ISession session)
    {
        var json = session.GetString(SessionKey);
        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<SessionCartLine>();
        }

        try
        {
            return JsonSerializer.Deserialize<List<SessionCartLine>>(json) ?? new List<SessionCartLine>();
        }
        catch
        {
            return new List<SessionCartLine>();
        }
    }

    private static void WriteLines(ISession session, List<SessionCartLine> lines)
    {
        session.SetString(SessionKey, JsonSerializer.Serialize(lines));
    }

    private sealed class SessionCartLine
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? VariantId { get; set; }
        public int Quantity { get; set; }
    }
}
