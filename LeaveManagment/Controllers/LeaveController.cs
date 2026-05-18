using LeaveManagement.Application.DTOs;
using LeaveManagement.Application.Services;
using LeaveManagement.Domain.VMModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveController : ControllerBase
    {
        private readonly LeaveService _service;

        public LeaveController(LeaveService service)
        {
            _service = service;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply(ApplyLeaveDto dto)
        {
            var result = await _service.ApplyLeaveAsync(dto);
            return Ok(result);
        }

        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            await _service.ApproveLeaveAsync(id);
            return Ok("Approved");
        }

        [HttpPost("reject/{id}")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectLeaveDto dto)
        {
            await _service.RejectLeaveAsync(id, dto?.Comment);
            return Ok("Rejected");
        }

        [HttpPost("GetLeaveRequests")]
        public async Task<IActionResult> GetLeaveRequests(VMLeaveRequest filter)
        {
            var result = await _service.GetLeaveRequestsAsync(filter);
            return Ok(result);         
        }

    }

}
