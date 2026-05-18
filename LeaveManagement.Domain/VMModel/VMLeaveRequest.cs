using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeaveManagement.Domain.VMModel
{
    public class VMLeaveRequest
    {
        public int EmployeeId { get; set; }
        public int? Status { get; set; }
        //public string? LeaveType { get; set; }
        public int? LeaveTypeId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public string? SortBy { get; set; } = "AddedDate"; // CreatedAt, FromDate
        public string? SortDir { get; set; } = "desc"; // asc/desc
    }

    public class VMLeaveBalanceSummary
    {
        public int EmployeeId { get; set; }
        public int TotalAllocated { get; set; }
        public int TotalUsed { get; set; }
        public int Remaining { get; set; }
    }

}
