namespace AuthService.Application.DTOs
{
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public string? User { get; set; } // Esto es útil si necesitas devolver el usuario en la respuesta

        public static AuthResponseDto SuccessResponse(string message, string? token = null, string? user = null)
        {
            return new AuthResponseDto
            {
                Success = true,
                Message = message,
                Token = token,
                User = user // Incluyendo el usuario si es necesario
            };
        }

        public static AuthResponseDto Fail(string message)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = message
            };
        }
    }
}