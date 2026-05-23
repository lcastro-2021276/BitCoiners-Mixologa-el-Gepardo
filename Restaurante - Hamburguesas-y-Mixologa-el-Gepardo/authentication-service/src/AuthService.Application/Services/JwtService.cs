using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthService.Application.Services;

public class JwtService : IJwtService
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiresMinutes;

    public JwtService(
        string key,
        string issuer,
        string audience,
        int expiresMinutes
    )
    {
        _key = key;
        _issuer = issuer;
        _audience = audience;
        _expiresMinutes = expiresMinutes <= 0 ? 60 : expiresMinutes;
    }

    public string GenerateToken(User user)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_key);

        if (keyBytes.Length < 32)
            throw new Exception("JWT Key debe tener mínimo 32 caracteres");

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(keyBytes),
            SecurityAlgorithms.HmacSha256
        );

        var claims = new List<Claim>
        {
            // ID USUARIO
            new(
                JwtRegisteredClaimNames.Sub,
                user.Id.ToString()
            ),

            // USERNAME
            new(
                JwtRegisteredClaimNames.UniqueName,
                user.Username
            ),

            // EMAIL
            new(
                JwtRegisteredClaimNames.Email,
                user.Email
            ),

            // ROLE ASP.NET
            new(
                ClaimTypes.Role,
                user.Role
            ),

            // ROLE PERSONALIZADO
            new(
                "role",
                user.Role
            ),

            // TOKEN ID
            new(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()
            )
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expiresMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}