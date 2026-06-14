using AuthService.Domain.Entities;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Si ya existe un admin, no hacer nada
        if (await context.Users.AnyAsync(u => u.Role == "Admin"))
        {
            Console.WriteLine("✅ DataSeeder: usuarios ya inicializados.");
            return;
        }

        var admin = new User
        {
            Id = Guid.NewGuid().ToString(),
            Username = "admin",
            Email = "agarcia-2024043@kinal.edu.gt",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "Admin",
            EmailConfirmed = true,
            EmailVerificationToken = null,
            PasswordResetToken = null
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();

        Console.WriteLine("✅ DataSeeder: usuario admin creado exitosamente.");
    }
}
