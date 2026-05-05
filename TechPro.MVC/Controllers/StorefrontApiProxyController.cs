using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TechPro.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/{**path}")]
public class StorefrontApiProxyController : ControllerBase
{
    private static readonly HashSet<string> HopByHopHeaders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Connection", "Keep-Alive", "Proxy-Authenticate", "Proxy-Authorization",
        "TE", "Trailer", "Transfer-Encoding", "Upgrade", "Host"
    };

    private readonly IHttpClientFactory _httpClientFactory;

    public StorefrontApiProxyController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task Proxy(string path)
    {
        var client = _httpClientFactory.CreateClient("TechProAPI");
        var target = "api/" + path + Request.QueryString;
        using var request = new HttpRequestMessage(new HttpMethod(Request.Method), target);

        foreach (var header in Request.Headers)
        {
            if (!HopByHopHeaders.Contains(header.Key))
            {
                request.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

        if (Request.ContentLength > 0 || Request.Headers.ContainsKey("Content-Type"))
        {
            request.Content = new StreamContent(Request.Body);
            if (!string.IsNullOrWhiteSpace(Request.ContentType))
            {
                request.Content.Headers.TryAddWithoutValidation("Content-Type", Request.ContentType);
            }
        }

        using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, HttpContext.RequestAborted);
        Response.StatusCode = (int)response.StatusCode;

        foreach (var header in response.Headers)
        {
            if (!HopByHopHeaders.Contains(header.Key))
            {
                Response.Headers[header.Key] = header.Value.ToArray();
            }
        }

        foreach (var header in response.Content.Headers)
        {
            if (!HopByHopHeaders.Contains(header.Key))
            {
                Response.Headers[header.Key] = header.Value.ToArray();
            }
        }

        Response.Headers.Remove("transfer-encoding");
        await response.Content.CopyToAsync(Response.Body, HttpContext.RequestAborted);
    }
}
