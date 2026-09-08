namespace backend.DTOs.AuthDTOs
{
    public class RegisterRequest
    {
        public string Email {get; set;} = string.Empty;
        public string Password {get; set;} = string.Empty;
        public string DisplayName{get; set;} = string.Empty;
    }

    public class LoginRequest
    {
        public string Email {get; set;} = string.Empty;
        public string Password{get; set;} = string.Empty;

    }

    public class ExternalLoginRequest
    {
        public string Provider {get; set;} = string.Empty;
        public string IdToken {get; set;} = string.Empty;
    }

    public class RefreshRequest
    {
        public string RefreshToken{get;set;} = string.Empty;
    }

    public class AuthResponse
    {
        public string AccessToken{get;set;} = string.Empty;
        public string RefreshToken{get;set;} = string.Empty;
        public DateTime AccessTokenExpiresAt{get;set;}
    }

}