using System;

    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime HireDate { get; set; }

        public ICollection<LeaveBalance> LeaveBalances { get; set; }
    }

