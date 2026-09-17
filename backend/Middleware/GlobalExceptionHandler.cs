using Microsoft.AspNetCore.Diagnostics;

using backend.AppExceptions;
using Microsoft.AspNetCore.Mvc;

//Global exception handler to manage exceptions
public class GlobalExceptionHandler : IExceptionHandler{

    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) 
        => _logger = logger;
    

    //Class to handle specific errors to log and show to the user.
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken cancellationToken
    )
    {   
        // Map the exception type to a status code and title
        // We get the exception from the piece of code and if it matches
        // one of those, assign it a status code and a title
        var (statusCode, title) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "Recurso no encontrado"),
            ForbiddenException => (StatusCodes.Status403Forbidden, "No tienes permiso para esta acción"),
            AuthenticationFailedException => (StatusCodes.Status401Unauthorized, "No autorizado"),
            ValidationException => (StatusCodes.Status400BadRequest, "Error de validación"),
            UnsupportedProviderException => (StatusCodes.Status400BadRequest, "Solicitud no soportada"),
            ConcurrencyConflictException => (StatusCodes.Status409Conflict, "Conflicto de version"),
            _ => (StatusCodes.Status500InternalServerError, "Ocurrió un error inesperado")
        };

        //If there is 500 error, say its an uncontrolled error
        if(statusCode == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Error no controlado en {Path}", httpContext.Request.Path);
        else
            //if not, log it as a warning.
            _logger.LogWarning("{Type}: {Message} en {Path}", exception.GetType().Name, exception.Message, httpContext.Request.Path);

        //Create a ProblemDetails for the user
        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            //To avoid exposing the exception.Message in a 500
            // change it for a generic message
            Detail = statusCode == StatusCodes.Status500InternalServerError
                    ? "Ocurrio un error interno. Intenta de nuevo mas tarde"
                    : exception.Message,
            Instance = httpContext.Request.Path
        };
        
        //if is a validation error, it adds all of its messages to problem.
        if (exception is ValidationException validationEx)
            problem.Extensions["errors"] = validationEx.Errors;
        
        httpContext.Response.StatusCode = statusCode;

        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        //tells the framework that the error is managed and there is no need to handle
        return true;

    }

}