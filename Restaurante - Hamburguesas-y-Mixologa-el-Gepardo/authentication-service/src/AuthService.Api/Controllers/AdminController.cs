using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/management")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    /// <summary>
    /// Obtiene la información del usuario autenticado desde el token JWT.
    /// </summary>
    /// <remarks>
    /// Este endpoint requiere un token JWT válido.
    /// Devuelve los claims del usuario como sub, username y role.
    /// </remarks>
    /// <response code="200">Retorna la información del usuario autenticado</response>
    /// <response code="401">No autorizado - token inválido o ausente</response>
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var username = User.FindFirstValue(JwtRegisteredClaimNames.UniqueName);
        var role = User.FindFirstValue("role");

        return Ok(new
        {
            success = true,
            sub,
            username,
            role
        });
    }

    /// <summary>
    /// Endpoint protegido solo para administradores del restaurante.
    /// </summary>
    /// <remarks>
    /// Solo usuarios con el rol "adminRestaurante" pueden acceder a este endpoint.
    /// </remarks>
    /// <response code="200">Acceso permitido</response>
    /// <response code="401">No autenticado</response>
    /// <response code="403">No tiene permisos suficientes</response>
    [Authorize(Roles = "adminRestaurante")]
    [HttpGet("only-admin")]
    public IActionResult OnlyAdmin()
    {
        return Ok(new
        {
            success = true,
            message = "Acceso permitido: admin"
        });
    }
}