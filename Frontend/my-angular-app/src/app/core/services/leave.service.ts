import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplyLeaveDto } from '../../shared/models/leave.model';

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

  getAll() {
    return this.http.get<any[]>(`${this.api}`);
  }
}