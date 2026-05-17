namespace LeaveManagment.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 400;

                var response = new
                {
                    message = ex.Message,
                    statusCode = 400
                };

                await context.Response.WriteAsync(
                    System.Text.Json.JsonSerializer.Serialize(response)
                );
            }
        }
    }
}
