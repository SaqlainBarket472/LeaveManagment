import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplyLeaveDto } from '../../shared/models/leave.model';
import { Observable } from 'rxjs';

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

  rejectLeave(id: number) {
    return this.http.post(`${this.api}/reject/${id}`, {});
  }

  getAll(filter: any = {}) {
    const payload = { employeeId: 1, ...filter };
    return this.http.post<any[]>(`${this.api}/GetLeaveRequests`, payload);
  }
}