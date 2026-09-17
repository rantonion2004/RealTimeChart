
namespace backend.AppExceptions
{
    public class NotFoundException: Exception
    {
        public NotFoundException(string message) : base(message){}
    }

    public class ForbiddenException: Exception
    {
        public ForbiddenException(string message) : base(message) {}
    }

    public class ValidationException : Exception
    {
        public IEnumerable<string> Errors {get;}
        public ValidationException(IEnumerable<string> errors) : base("Error de validacion")
        {
            Errors = errors;
        }
    }

    public class AuthenticationFailedException : Exception
    {
        public AuthenticationFailedException(string message) : base(message) { }
    }

    public class UnsupportedProviderException : Exception
    {
        public UnsupportedProviderException(string message) : base(message) { }
    }

    public class ConcurrencyConflictException : Exception
    {
        public ConcurrencyConflictException(string message) : base(message){}
    }

}

