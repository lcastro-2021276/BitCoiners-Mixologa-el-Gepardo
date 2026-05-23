namespace AuthService.Application.DTOs
{
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }

        
        public object? User { get; set; }

        public static AuthResponseDto SuccessResponse(
            string message,
            string? token = null,
            object? user = null)
        {
            return new AuthResponseDto
            {
                Success = true,
                Message = message,
                Token = token,
                User = user
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