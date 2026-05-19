namespace LeaveManagement.Application.DTOs
{
    public class RejectLeaveDto
    {
        public string? Comment { get; set; }
    }
    public class BulkRejectRequest
    {
        public List<int> Ids { get; set; } = new();
        public string Comment { get; set; } = string.Empty;
    }
    
    public class BulkApproveRequest
    {
        public List<int> Ids { get; set; } = new();
    }
}
