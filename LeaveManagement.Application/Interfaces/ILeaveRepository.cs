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
    }
}
