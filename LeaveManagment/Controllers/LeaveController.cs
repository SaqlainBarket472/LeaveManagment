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

        [HttpPost("ApplyLeave")]
        public async Task<IActionResult> ApplyLeave(ApplyLeaveDto dto)
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
        
        [HttpPost("GetPendingRequests")]
        public async Task<IActionResult> GetPendingRequests(VMLeaveRequest filter)
        {
            var result = await _service.GetLeaveRequestsAsync(filter);
            return Ok(result);         
        }

        [HttpPost("BulkReject")]
        public async Task<IActionResult> BulkReject([FromBody] BulkRejectRequest request)
        {
            if (request.Ids == null || !request.Ids.Any())
            {
                return BadRequest("No leave IDs provided");
            }

            var result = await _service.BulkRejectAsync(request);

            if (!result)
                return NotFound("No matching leave requests found");

            return Ok(new
            {
                message = "Selected leave requests rejected successfully"
            });
        }

        [HttpPost("BulkApprove")]
        public async Task<IActionResult> BulkApprove([FromBody] BulkApproveRequest request)
        {
            if (request == null || request.Ids == null || !request.Ids.Any())
            {
                return BadRequest("No leave IDs provided");
            }

            var result = await _service.BulkApprovedAsync(request);

            if (!result)
                return NotFound("No matching leave requests found");

            return Ok(new
            {
                message = "Selected leave requests approved successfully"
            });
        }
    }

}
