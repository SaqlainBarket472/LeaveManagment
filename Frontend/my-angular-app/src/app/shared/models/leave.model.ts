export interface ApplyLeaveDto {
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: number | string;
  addedBy: string;
  addedDate: string;
  rejectionComment?: string | null;
  updatedBy?: string | null;
  updatedDate?: string | null;
}

export interface LeaveType {
  id: number;
  name: string;
  defaultBalance: number;
  isAccrued: boolean;
}
