using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.IdentityModel.Tokens;

public interface ITokenService
{
    
    //Method to generate Access token based on the user and its roles
    string GenerateAccessToken(User user, IList<string> roles);
    
    //method to generate a refresh token and its identity with the userId
    (string rawToken, RefreshToken entity) GenerateRefreshToken(Guid userId);

}

public class TokenService : ITokenService
{   

    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;

    //class to generate the access token based on the user and its roles
    public string GenerateAccessToken(User user, IList<string> roles)
    {
        //
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new("displayName", user.DisplayName)
        };

        claims.AddRange(roles.Select(r=> new Claim(ClaimTypes.Role, r)));

        //The key to encode
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        //the credentials/signature to sign in
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //create the token with the issuer, the audience, the claims and the expired time
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        //create the JwtSecurityTokenHandler in base of the WriteToken
        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    //class to generate the refresh token and return it raw and its model.
    public (string rawToken, RefreshToken entity) GenerateRefreshToken(Guid userId)
    {
        var rawToken =  Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

        var entity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = hash,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        return (rawToken, entity);

    }

}