using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeaveManagement.Application.Interfaces;
using LeaveManagement.Domain.Entities;
using LeaveManagement.Domain.VMModel;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagement.Infrastructure
{
    public class LeaveRepository : ILeaveRepository
    {
        private readonly AppDbContext _context;

        public LeaveRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(LeaveRequest request)
        {
            await _context.LeaveRequests.AddAsync(request);
        }

        public async Task<LeaveBalance> GetBalance(int empId, int leaveTypeId)
        {
            return await _context.LeaveBalances
                .FirstOrDefaultAsync(x => x.EmployeeId == empId && x.LeaveTypeId == leaveTypeId);
        }

        public async Task<bool> HasOverlap(int empId, DateTime start, DateTime end)
        {
            return await _context.LeaveRequests.AnyAsync(x =>
                x.EmployeeId == empId &&
                x.Status == LeaveStatus.Approved &&
                start <= x.EndDate &&
                end >= x.StartDate);
        }

        public async Task<LeaveRequest> GetById(int id)
        {
            return await _context.LeaveRequests.FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public IQueryable<LeaveRequest> GetAll()
        {
            return _context.LeaveRequests.AsQueryable();
        }

    }
}
