import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplyLeaveDto, LeaveRequest } from '../../shared/models/leave.model';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaveService {

  private api = 'https://localhost:7206/api/leave';

  constructor(private http: HttpClient) {}

  applyLeave(data: ApplyLeaveDto) {
    return this.http.post(`${this.api}/apply`, data);
  }

  approveLeave(id: number) {
    return this.http.post(`${this.api}/approve/${id}`, {});
  }

  rejectLeave(id: number, comment: string = '') {
    return this.http.post(`${this.api}/reject/${id}`, { comment });
  }

  getAll(filter: any = {}): Observable<LeaveRequest[]> {
    const payload = { employeeId: 1, ...filter };
    return this.http.post<LeaveRequest[]>(`${this.api}/GetLeaveRequests`, payload);
  }

  getPendingRequests(filter: any = {}): Observable<LeaveRequest[]> {
    return this.getAll({ status: 0, ...filter });
  }

  bulkApprove(ids: number[]) {
    if (!ids || ids.length === 0) {
      return of([]);
    }

    return forkJoin(ids.map((id) => this.approveLeave(id)));
  }

  bulkReject(ids: number[], comment: string = '') {
    if (!ids || ids.length === 0) {
      return of([]);
    }

    return forkJoin(ids.map((id) => this.rejectLeave(id, comment)));
  }
}