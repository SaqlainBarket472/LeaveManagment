using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeaveManagement.Domain.Entities
{
    public class Employee
    {
            public int Id { get; set; }
            public string Name { get; set; }
            public DateTime HireDate { get; set; }
            public string AddedBy { get; set; }
            public DateTime AddedDate { get; set; }
            public string? UpdatedBy { get; set; }
            public DateTime? UpdatedDate { get; set; }
            public ICollection<LeaveBalance> LeaveBalances { get; set; }
        
    }
}
