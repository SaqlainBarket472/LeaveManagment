namespace LeaveManagement.Domain.Entities
{
    public class LeaveRequest
    {
        public int Id { get; set; }

        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int DaysRequested { get; set; }

        public string Reason { get; set; }
        public LeaveStatus Status { get; set; }
        public string AddedBy { get; set; }
        public DateTime AddedDate { get; set; }
        public string? RejectionComment { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
