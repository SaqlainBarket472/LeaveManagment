using LeaveManagement.Application.DTOs;
using LeaveManagement.Domain.Entities;
using LeaveManagement.Domain.VMModel;

namespace LeaveManagement.Application.Interfaces
{
    public interface ILeaveRepository
    {
        Task AddAsync(LeaveRequest request);
        Task<LeaveBalance> GetBalance(int empId, int leaveTypeId);
        Task<bool> HasOverlap(int empId, DateTime start, DateTime end);
        Task<LeaveRequest> GetById(int id);
        Task SaveChangesAsync();
        IQueryable<LeaveRequest> GetAll();
        Task<List<LeaveRequest>> GetLeaveRequestsByIdsAsync(BulkRejectRequest request);
        Task<List<LeaveRequest>> GetLeaveApproveRequestsByIdsAsync(List<int> ids);
    }
}
