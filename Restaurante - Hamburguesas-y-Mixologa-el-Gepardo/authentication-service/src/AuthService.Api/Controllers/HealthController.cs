using Microsoft.AspNetCore.Mvc;
using AuthService.Persistence.Data;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/health")]
[Produces("application/json")]
public class HealthController(ApplicationDbContext dbContext) : ControllerBase
{
    /// <summary>
    /// Verifica el estado de salud de la API y su conexión a la base de datos.
    /// </summary>
    /// <remarks>
    /// Comprueba si la API está activa y si puede establecer conexión con la base de datos.
    /// Retorna el estado de cada componente junto con la fecha y hora UTC de la consulta.
    /// </remarks>
    /// <response code="200">La API y la base de datos están operativas</response>
    /// <response code="503">La API está activa pero no puede conectarse a la base de datos</response>
    [HttpGet]
    public async Task<IActionResult> Check()
    {
        var dbStatus = "Unhealthy";

        try
        {
            var canConnect = await dbContext.Database.CanConnectAsync();
            dbStatus = canConnect ? "Healthy" : "Unhealthy";
        }
        catch
        {
            dbStatus = "Unhealthy";
        }

        var response = new
        {
            success = dbStatus == "Healthy",
            status = new
            {
                api = "Healthy",
                database = dbStatus,
                timestamp = DateTime.UtcNow
            }
        };

        return dbStatus == "Healthy"
            ? Ok(response)
            : StatusCode(503, response);
    }
}