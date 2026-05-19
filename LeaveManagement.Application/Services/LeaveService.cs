using Azure.Core;
using LeaveManagement.Application.DTOs;
using LeaveManagement.Application.Interfaces;
using LeaveManagement.Domain.Entities;
using LeaveManagement.Domain.VMModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace LeaveManagement.Application.Services
{
    public class LeaveService
    {
        private readonly ILeaveRepository _repo;

        public LeaveService(ILeaveRepository repo)
        {
            _repo = repo;
        }

        public async Task<string> ApplyLeaveAsync(ApplyLeaveDto dto)
        {
            try
            {
                if (dto.StartDate > dto.EndDate)
                    throw new Exception("StartDate cannot be greater than EndDate");
                
                if (string.IsNullOrEmpty(dto.Reason))
                    throw new Exception("Please Enter Reason");

                int days = CalculateDays(dto.StartDate, dto.EndDate);

                var balance = await _repo.GetBalance(dto.EmployeeId, dto.LeaveTypeId);

                if (balance == null || balance.Balance < days)
                    throw new Exception("Insufficient leave balance");

                var overlap = await _repo.HasOverlap(dto.EmployeeId, dto.StartDate, dto.EndDate);

                if (overlap)
                    throw new Exception("Overlapping leave request exists");

                var entity = new LeaveRequest
                {
                    EmployeeId = dto.EmployeeId,
                    LeaveTypeId = dto.LeaveTypeId,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    DaysRequested = days,
                    Reason = dto.Reason,
                    EmployeeName = dto.EmployeeName,
                    Status = LeaveStatus.Pending,
                    AddedBy = "Sheikh.saqlian@gmail.com",
                    AddedDate = DateTime.Now

                };

                await _repo.AddAsync(entity);
                await _repo.SaveChangesAsync();

                return "Leave applied successfully";
            }
           catch(Exception ex)
           {
                throw ex;
           }
            return "Error";
        }

        public async Task ApproveLeaveAsync(int requestId)
        {
            var request = await _repo.GetById(requestId);

            if (request == null)
                throw new Exception("Request not found");

            var balance = await _repo.GetBalance(request.EmployeeId, request.LeaveTypeId);

            if (balance.Balance < request.DaysRequested)
                throw new Exception("Insufficient balance");

            balance.Balance -= request.DaysRequested;
            request.Status = LeaveStatus.Approved;

            await _repo.SaveChangesAsync();
        }

        public async Task RejectLeaveAsync(int requestId, string? rejectionComment = null)
        {
            var request = await _repo.GetById(requestId);

            if (request == null)
                throw new Exception("Request not found");

            request.RejectionComment = rejectionComment;
            request.Status = LeaveStatus.Rejected;

            await _repo.SaveChangesAsync();
        }

        private int CalculateDays(DateTime start, DateTime end)
        {
            int count = 0;

            for (var d = start; d <= end; d = d.AddDays(1))
            {
                if (d.DayOfWeek != DayOfWeek.Saturday &&
                    d.DayOfWeek != DayOfWeek.Sunday)
                    count++;
            }

            return count;
        }

        public async Task<List<LeaveRequest>> GetLeaveRequestsAsync(VMLeaveRequest filter)
        {
            var query = _repo.GetAll();

            // 🔎 Filtering
            if (filter.EmployeeId > 0)
                query = query.Where(x => x.EmployeeId == filter.EmployeeId);

                if (filter.LeaveTypeId.HasValue)
                    query = query.Where(x => x.LeaveTypeId == filter.LeaveTypeId);

            if (filter.FromDate.HasValue)
                query = query.Where(x => x.StartDate >= filter.FromDate.Value);

            if (filter.ToDate.HasValue)
                query = query.Where(x => x.EndDate <= filter.ToDate.Value);

            // 📊 Simple Sorting (AddedDate only)
            if (filter.SortDir?.ToLower() == "asc")
                query = query.OrderBy(x => x.AddedDate);
            else
                query = query.OrderByDescending(x => x.AddedDate);

            return await query.ToListAsync();
        }
    }



}
