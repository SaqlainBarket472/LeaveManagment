import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VMLeaveRequest {
  employeeId: number;
  status?: number;
  leaveTypeId?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDir?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private baseUrl = 'https://localhost:7206/api/leave';

  constructor(private http: HttpClient) {}

  getLeaveRequests(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/GetLeaveRequests`, payload);
  }

  // ✅ FIXED: NOW POST (was GET)
  getPendingRequests(payload: any): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.baseUrl}/GetPendingRequests`,
      payload
    );
  }

  approveLeave(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/Approve/${id}`, {});
  }

  rejectLeave(id: number, comment: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Reject/${id}`, { comment });
  }

  bulkApprove(payload: { ids: number[] }) {
  return this.http.post(
    `${this.baseUrl}/BulkApprove`,
    payload
  );
}
  bulkReject(ids: number[], comment: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/BulkReject`, { ids, comment });
  }

  applyLeave(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ApplyLeave`, data);
  }
}