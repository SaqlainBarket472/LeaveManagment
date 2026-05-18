import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../core/services/leave.service';
import { LeaveRequest } from '../shared/models/leave.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-approval',
  imports: [CommonModule, FormsModule],
  templateUrl: './approval.component.html'
})
export class ApprovalComponent implements OnInit {

  requests: LeaveRequest[] = [];
  comments: Record<number, string> = {};
  selectedIds = new Set<number>();
  selectAll = false;
  bulkRejectComment = '';

  constructor(private service: LeaveService) {}

  ngOnInit() {
    this.service.getPendingRequests().subscribe((res: LeaveRequest[]) => {
      this.requests = (res || []).filter((x) => x.status === 'Pending' || x.status === 0);
    });
  }

  approve(id: number) {
    this.service.approveLeave(id).subscribe(() => {
      this.requests = this.requests.filter((r) => r.id !== id);
      this.selectedIds.delete(id);
    });
  }

  reject(id: number) {
    const comment = this.comments[id] || '';
    this.service.rejectLeave(id, comment).subscribe(() => {
      this.requests = this.requests.filter((r) => r.id !== id);
      this.selectedIds.delete(id);
      delete this.comments[id];
    });
  }

  toggleSelectAll(checked: boolean) {
    this.selectAll = checked;
    this.requests.forEach((request) => {
      if (checked) {
        this.selectedIds.add(request.id);
      } else {
        this.selectedIds.delete(request.id);
      }
    });
  }

  toggleSelection(id: number, checked: boolean) {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
    this.selectAll = this.requests.length > 0 && this.requests.every((item) => this.selectedIds.has(item.id));
  }

  approveSelected() {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) {
      return;
    }
    this.service.bulkApprove(ids).subscribe(() => {
      this.requests = this.requests.filter((r) => !this.selectedIds.has(r.id));
      this.selectedIds.clear();
      this.selectAll = false;
    });
  }

  rejectSelected() {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) {
      return;
    }
    this.service.bulkReject(ids, this.bulkRejectComment).subscribe(() => {
      this.requests = this.requests.filter((r) => !this.selectedIds.has(r.id));
      this.selectedIds.clear();
      this.bulkRejectComment = '';
      this.selectAll = false;
    });
  }

  public getStatusLabel(status: any): string {
    if (status === 0 || status === 'Pending') return 'Pending';
    if (status === 1 || status === 'Approved') return 'Approved';
    if (status === 2 || status === 'Rejected') return 'Rejected';
    return String(status);
  }
}