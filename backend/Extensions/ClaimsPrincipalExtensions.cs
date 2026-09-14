
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

//metodo de soporte para encontrar el UserId del token dentro de un controller.
namespace backend.Extenions;
public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Token sin identificador de usuario");

        return Guid.Parse(value);
    }
}