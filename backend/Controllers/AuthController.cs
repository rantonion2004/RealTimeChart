using backend.DTOs.AuthDTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
//Class to manage the authentication controller with JWT
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        => Ok(await _authService.RegisterAsync(request));

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request) 
        => Ok(await _authService.LoginAsync(request));
    
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> refresh(RefreshRequest request)
        => Ok(await _authService.RefreshAsync(request.RefreshToken));

    [HttpPost("external")]
    public async Task<ActionResult<AuthResponse>> ExternalLogin(ExternalLoginRequest request)
        => Ok(await _authService.ExternalLoginAsync(request));
}