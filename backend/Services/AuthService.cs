

using Microsoft.AspNetCore.Authorization;
using backend.DTOs.AuthDTOs;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using backend.Data;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;


public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(string rawToken);
    Task<AuthResponse> ExternalLoginAsync(ExternalLoginRequest request);
    Task LogoutAsync(string rawToken);
    
}
public class AuthService: IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly AppDbContext _context;

    private readonly IEnumerable<IExternalAuthValidator> _externalValidators;

    public AuthService(
        UserManager<ApplicationUser> userManager, 
        ITokenService tokenService, 
        AppDbContext context,
        IEnumerable<IExternalAuthValidator> externalValidators
        )
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
        _externalValidators = externalValidators;
    }

    //Method to register the user
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {   
        //get the register request and create an object user
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName
        };

        //with user manager, create the "result" with the password
        var result = await _userManager.CreateAsync(user, request.Password);
        if(!result.Succeeded) 
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
        
        //if succeeded, issue the tokens
        return await IssueTokensAsync(user);
        
    }

    //Method to generate the token but with login
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // find the user with the email
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Credenciales invalidad");
        
        //now that you have the user, check if the password is valid
        var valid = await _userManager.CheckPasswordAsync(user, request.Password);
        if(!valid) throw new UnauthorizedAccessException("Credenciales invalidad");

        return await IssueTokensAsync(user);

    }

    //Method to validate external providers in authentication
    public async Task<AuthResponse> ExternalLoginAsync(ExternalLoginRequest request)
    {
        //ask if the requested validator matchs the provider
        var validator = _externalValidators.FirstOrDefault(v => v.Provider == request.Provider)
            ?? throw new NotSupportedException($"Proveedor '{request.Provider}' no soportado");

        //check if the token Id is valid to google
        var externalInfo = await validator.ValidateAsync(request.IdToken);

        //ask if there is a linked login(in the linked table which is for external providers)
        //If there is, the login is a login request(so someone already registerd with google)
        var user = await _userManager.FindByLoginAsync(request.Provider, externalInfo.ProviderUserId);
        
        //if there is not linked user(first time using auth with google...)
        if(user is null)
        {   

            //If a user already used his email but not with google auth,
            //it is just linked
            user = await _userManager.FindByEmailAsync(externalInfo.Email);


            //if not, the user is created in the user table
            if(user is null)
            {
                user = new ApplicationUser
                {
                    UserName = externalInfo.Email,
                    Email = externalInfo.Email,
                    DisplayName = string.IsNullOrWhiteSpace(externalInfo.DisplayName)
                        ? externalInfo.Email.Split('@')[0]
                        : externalInfo.DisplayName,
                    EmailConfirmed = true
                };
                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        string.Join(", ", createResult.Errors.Select(error => error.Description)));
                }
            }

            //add in the user login table a new register of the user.
            await _userManager.AddLoginAsync(user,
                new UserLoginInfo(request.Provider, externalInfo.ProviderUserId, request.Provider));

        }

        //return user
        return await IssueTokensAsync(user);
    }

    //method to refresh the  token
    public async Task<AuthResponse> RefreshAsync(string rawToken)
    {
        //get the hash using the raw token
        var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));
       
        //check if its saved and get it
        var stored = await _context.Set<RefreshToken>()
            .FirstOrDefaultAsync(rt => rt.TokenHash == hash);
        
        if(stored is null || !stored.IsActive)
            throw new UnauthorizedAccessException("Refresh token inválido o expirado");
        
        //if its saved, revoked it
        //stored is just an entity that EF obtained from the DB
        //when you changed Revoked, EF is searching the entity
        //then, inside IssueTokenAsync, when SaveChanges is called,
        //the changes are syncrhonized(so that register in the DB is updated)
        //also, the IsActive from the RefreshToken changed because it is 
        //defined as an expression, so when the RevokedChanges is setted ad now,
        //the IsActive is set to false because of the datetime
        stored.RevokedAt = DateTime.UtcNow;

        //find the user by the Id 
        var user = await _userManager.FindByIdAsync(stored.UserId.ToString())
            ?? throw new UnauthorizedAccessException("Usuario no encontrado");

        return await IssueTokensAsync(user);
    }

    //Method to issue tokens when loging in, refreshing and registering
    private async Task<AuthResponse> IssueTokensAsync(ApplicationUser user)
    {
        //obtain the roles and generate a new AccessToken and RefreshToken
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var (rawRefresh, refreshEntity) = _tokenService.GenerateRefreshToken(user.Id);

        //add the new token entity
        _context.Add(refreshEntity);
        //save all the changes from the EF
        await _context.SaveChangesAsync();

        //return the auth
        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = rawRefresh,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };

    }

    public async Task LogoutAsync(string rawToken)
    {
        
        var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));
 
        var stored = await _context.Set<RefreshToken>()
                    .FirstOrDefaultAsync(rt => rt.TokenHash == hash);

        if(stored is null) return;

        stored.RevokedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();   
    }

}