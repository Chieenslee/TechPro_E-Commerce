using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechPro.Models.DTOs;
using TechPro.Services;

namespace TechPro.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/cart")]
public class StorefrontCartApiController : ControllerBase
{
    [HttpGet("")]
    public ActionResult<CartDto> Get()
    {
        return Ok(StorefrontSessionCart.GetCart(HttpContext.Session));
    }

    [HttpGet("count")]
    public ActionResult<int> Count()
    {
        return Ok(StorefrontSessionCart.GetCart(HttpContext.Session).TotalItems);
    }

    [HttpPost("add")]
    public ActionResult<CartDto> Add(AddToCartDto dto)
    {
        return Ok(StorefrontSessionCart.Add(HttpContext.Session, dto));
    }

    [HttpPut("items/{itemId:int}")]
    public ActionResult<CartDto> Update(int itemId, [FromBody] int quantity)
    {
        return Ok(StorefrontSessionCart.Update(HttpContext.Session, itemId, quantity));
    }

    [HttpDelete("items/{itemId:int}")]
    public ActionResult<CartDto> Remove(int itemId)
    {
        return Ok(StorefrontSessionCart.Remove(HttpContext.Session, itemId));
    }

    [HttpDelete("clear")]
    public ActionResult<CartDto> Clear()
    {
        return Ok(StorefrontSessionCart.Clear(HttpContext.Session));
    }
}
