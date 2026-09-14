
using Google.Apis.Auth;

public class GoogleAuthValidator : IExternalAuthValidator
{

    //obtener la configuracion y el provider
    private readonly IConfiguration _config;
    public string Provider => "Google";

    public GoogleAuthValidator(IConfiguration config) => _config = config;

    //validate obtained token from the client
    public async Task<ExternalUserInfo> ValidateAsync(string idToken)
    {
        //set the Audience
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] {_config["Google:ClientId"]!}
        };

        //
        try
        {
            //obtain the complete payload from google using the idToken send by the client
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return new ExternalUserInfo(payload.Subject, payload.Email, payload.Name);
        }
        catch (InvalidJwtException)
        {
            throw new UnauthorizedAccessException("Token de Google Invalido");
        }

    }

}