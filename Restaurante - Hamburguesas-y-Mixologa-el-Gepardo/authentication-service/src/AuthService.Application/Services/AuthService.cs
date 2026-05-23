using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using BCrypt.Net;

namespace AuthService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;

    public AuthService(IUserRepository users, IJwtService jwt)
    {
        _users = users;
        _jwt = jwt;
    }

    public async Task<AuthResponseDto> Login(LoginDto dto)
{
    Console.WriteLine("============ LOGIN DEBUG ============");
    Console.WriteLine($"EMAIL/USER: {dto.EmailOrUsername}");
    Console.WriteLine($"PASSWORD: {dto.Password}");

    var user = await _users.GetByUsername(dto.EmailOrUsername)
        ?? await _users.GetByEmail(dto.EmailOrUsername);

    Console.WriteLine($"USER ENCONTRADO: {user != null}");

    if (user == null)
        return AuthResponseDto.Fail("Credenciales inválidas");

    Console.WriteLine($"USERNAME BD: {user.Username}");
    Console.WriteLine($"EMAIL BD: {user.Email}");
    Console.WriteLine($"ROLE BD: {user.Role}");
    Console.WriteLine($"EMAIL CONFIRMED: {user.EmailConfirmed}");
    Console.WriteLine($"HASH BD: {user.PasswordHash}");

    var passwordValid = BCrypt.Net.BCrypt.Verify(
        dto.Password,
        user.PasswordHash
    );

    Console.WriteLine($"PASSWORD VALID: {passwordValid}");

    if (!passwordValid)
        return AuthResponseDto.Fail("Credenciales inválidas");

    var token = _jwt.GenerateToken(user);

    return AuthResponseDto.SuccessResponse(
        "Login exitoso",
        token,
        new
        {
            username = user.Username,
            email = user.Email,
            role = user.Role
        }
    );
}

    // ========================= REGISTER =========================
public async Task<AuthResponseDto> Register(RegisterDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Username) ||
        string.IsNullOrWhiteSpace(dto.Email) ||
        string.IsNullOrWhiteSpace(dto.Password))
    {
        return AuthResponseDto.Fail("Username, Email y Password son requeridos");
    }

    if (await _users.GetByUsername(dto.Username) != null)
        return AuthResponseDto.Fail("El usuario ya existe");

    if (await _users.GetByEmail(dto.Email) != null)
        return AuthResponseDto.Fail("El email ya está registrado");

    var verificationToken = Guid.NewGuid().ToString();

    var user = new User
    {
        Username = dto.Username,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),

        Role = NormalizeRole(
            string.IsNullOrWhiteSpace(dto.Role)
                ? "Cliente"
                : dto.Role
        ),

        // CAMBIO IMPORTANTE
        EmailConfirmed = true,

        EmailVerificationToken = verificationToken
    };

    await _users.Add(user);

    return AuthResponseDto.SuccessResponse(
        "Registro exitoso",
        verificationToken,
        new
        {
            username = user.Username,
            email = user.Email,
            role = user.Role
        }
    );
}

    // ========================= VERIFY EMAIL =========================
    public async Task<AuthResponseDto> VerifyEmail(string token)
    {
        var user = await _users.GetByVerificationToken(token);

        if (user == null)
            return AuthResponseDto.Fail("Token inválido");

        user.EmailConfirmed = true;
        user.EmailVerificationToken = null;

        await _users.Update(user);

        var jwtToken = _jwt.GenerateToken(user);

        return AuthResponseDto.SuccessResponse(
            "Email verificado correctamente",
            jwtToken,
            new
            {
                username = user.Username,
                role = NormalizeRole(user.Role)
            }
        );
    }

    // ========================= FORGOT PASSWORD =========================
    public async Task<AuthResponseDto> ForgotPassword(string email)
    {
        var user = await _users.GetByEmail(email);

        if (user == null)
            return AuthResponseDto.Fail("Usuario no encontrado");

        user.PasswordResetToken = Guid.NewGuid().ToString();
        await _users.Update(user);

        return AuthResponseDto.SuccessResponse(
            "Token de recuperación generado",
            user.PasswordResetToken
        );
    }

    // ========================= RESET PASSWORD =========================
    public async Task<AuthResponseDto> ResetPassword(string token, string newPassword)
    {
        var user = await _users.GetByResetToken(token);

        if (user == null)
            return AuthResponseDto.Fail("Token inválido");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordResetToken = null;

        await _users.Update(user);

        return AuthResponseDto.SuccessResponse("Contraseña actualizada");
    }

    // ========================= NORMALIZAR ROLES =========================
    private string NormalizeRole(string role)
    {
        role = role?.Trim().ToLower();

        return role switch
        {
            "admin" => "Admin",
            "cliente" => "Cliente",
            "user" => "Cliente",
            _ => "Cliente"
        };
    }
}