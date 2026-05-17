namespace LeaveManagement.Domain.Entities
{
    public class LeaveBalance
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }

        public decimal Balance { get; set; }

        public Employee Employee { get; set; }
        public LeaveType LeaveType { get; set; }

        public string AddedBy { get; set; }
        public DateTime AddedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
