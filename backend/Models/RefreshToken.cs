
using System.Diagnostics.Eventing.Reader;

namespace backend.Models;

//Class to save in the database the
public class RefreshToken
{
    public Guid Id {get; set;}
    public Guid UserId {get; set;}

    //Saves the Token's hash.
    public string TokenHash{get; set;} = string.Empty;
    public DateTime ExpiresAt{get; set;}
    public DateTime CreatedAt{get; set;} = DateTime.UtcNow;
    public DateTime? RevokedAt {get; set;}
    public User User {get; set;} = null!;
    
    //to verify if it is active, it show if is not revoked and if it hasn't expired
    public bool IsActive => RevokedAt is null && DateTime.UtcNow < ExpiresAt;
}