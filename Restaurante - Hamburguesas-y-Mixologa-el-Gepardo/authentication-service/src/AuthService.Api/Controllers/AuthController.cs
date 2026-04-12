using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    /// <summary>
    /// Autentica a un usuario y devuelve un token JWT.
    /// </summary>
    /// <remarks>
    /// Recibe las credenciales del usuario (email/username y contraseña).
    /// Si las credenciales son válidas, retorna un token JWT para usar en endpoints protegidos.
    /// </remarks>
    /// <param name="dto">Objeto con las credenciales del usuario.</param>
    /// <response code="200">Autenticación exitosa, retorna el token JWT</response>
    /// <response code="401">Credenciales inválidas</response>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _auth.Login(dto);
        return result.Success ? Ok(result) : Unauthorized(result);
    }

    /// <summary>
    /// Registra un nuevo usuario en el sistema.
    /// </summary>
    /// <remarks>
    /// Crea una nueva cuenta de usuario con los datos proporcionados.
    /// Tras el registro, se enviará un correo de verificación a la dirección indicada.
    /// </remarks>
    /// <param name="dto">Objeto con los datos del nuevo usuario.</param>
    /// <response code="200">Registro exitoso, se envió el correo de verificación</response>
    /// <response code="400">Datos inválidos o el usuario ya existe</response>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _auth.Register(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Verifica el correo electrónico de un usuario mediante un token.
    /// </summary>
    /// <remarks>
    /// Este token es enviado al correo del usuario tras el registro.
    /// El token tiene un tiempo de expiración; si ya expiró, se debe solicitar uno nuevo.
    /// </remarks>
    /// <param name="token">Token de verificación enviado al correo del usuario.</param>
    /// <response code="200">Correo verificado exitosamente</response>
    /// <response code="400">Token inválido, expirado o no proporcionado</response>
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest(new { success = false, message = "El token es requerido" });

        var result = await _auth.VerifyEmail(token);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Solicita el restablecimiento de contraseña para un usuario.
    /// </summary>
    /// <remarks>
    /// Envía un correo electrónico con un token de restablecimiento a la dirección proporcionada.
    /// Si el email no está registrado, la respuesta será igualmente exitosa por seguridad.
    /// </remarks>
    /// <param name="email">Correo electrónico asociado a la cuenta.</param>
    /// <response code="200">Correo de restablecimiento enviado exitosamente</response>
    /// <response code="400">Email no proporcionado o con formato inválido</response>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { success = false, message = "El email es requerido" });

        var result = await _auth.ForgotPassword(email);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Restablece la contraseña de un usuario usando un token válido.
    /// </summary>
    /// <remarks>
    /// El token debe haber sido generado previamente mediante el endpoint forgot-password.
    /// La nueva contraseña debe cumplir con los requisitos mínimos de seguridad del sistema.
    /// </remarks>
    /// <param name="token">Token de restablecimiento recibido por correo.</param>
    /// <param name="newPassword">Nueva contraseña que el usuario desea establecer.</param>
    /// <response code="200">Contraseña restablecida exitosamente</response>
    /// <response code="400">Token inválido, expirado, o nueva contraseña no proporcionada</response>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromQuery] string token,
        [FromQuery] string newPassword)
    {
        if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(newPassword))
            return BadRequest(new { success = false, message = "Token y nueva contraseña son requeridos" });

        var result = await _auth.ResetPassword(token, newPassword);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}