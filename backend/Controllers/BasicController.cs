
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class BasicController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public BasicController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetUsers()
    {   
        var products = await _context.Users.ToListAsync();
        var xd = 1;
        return Ok(xd);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<string>> AdminEndpoint()
    {
        return "ere admin mano";
    }


}