public record ExternalUserInfo(string ProviderUserId, string Email, string DisplayName);

public interface IExternalAuthValidator
{
    string Provider {get;}
    Task<ExternalUserInfo> ValidateAsync(string idToken);

}

