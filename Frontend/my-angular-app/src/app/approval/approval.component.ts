import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../core/services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-approval',
  imports: [CommonModule, FormsModule],
  templateUrl: './approval.component.html'
})
export class ApprovalComponent implements OnInit {

  requests: any[] = [];

  selectedIds = new Set<number>();
  selectAll = false;

  comments: Record<number, string> = {};
  bulkRejectComment = '';

  searchText: string = '';

  constructor(private service: LeaveService) {}

  ngOnInit() {
    this.loadPending();
  }

  // LOAD PENDING REQUESTS
  loadPending() {
    this.service.getPendingRequests({ employeeId: 1 }).subscribe(res => {
      this.requests = res || [];
    });
  }

  // SINGLE APPROVE
  approve(id: number) {
    this.service.approveLeave(id).subscribe(() => {
      this.requests = this.requests.filter(x => x.id !== id);
      this.selectedIds.delete(id);
    });
  }

  // SINGLE REJECT
  reject(id: number) {
    const comment = this.comments[id] || '';

    this.service.rejectLeave(id, comment).subscribe(() => {
      this.requests = this.requests.filter(x => x.id !== id);
      this.selectedIds.delete(id);
      delete this.comments[id];
    });
  }

  // BULK APPROVE (FIXED)
  approveSelected() {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) return;

    // ✅ FIX: send object instead of raw array
    this.service.bulkApprove({ ids }).subscribe(() => {
      this.requests = this.requests.filter(x => !this.selectedIds.has(x.id));
      this.selectedIds.clear();
      this.selectAll = false;
    });
  }

  // BULK REJECT (already correct)
  rejectSelected() {
    const ids = Array.from(this.selectedIds);
    if (!ids.length) return;

    this.service.bulkReject(ids, this.bulkRejectComment).subscribe(() => {
      this.requests = this.requests.filter(x => !this.selectedIds.has(x.id));
      this.selectedIds.clear();
      this.bulkRejectComment = '';
      this.selectAll = false;
    });
  }

  // SELECT ALL
  toggleSelectAll(val: boolean) {
    this.selectAll = val;

    this.requests.forEach(r => {
      if (val) this.selectedIds.add(r.id);
      else this.selectedIds.delete(r.id);
    });
  }

  toggleSelection(id: number, checked: boolean) {
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }

  // STATUS LABEL
  getStatusLabel(status: number) {
    return status === 0 ? 'Pending' :
           status === 1 ? 'Approved' : 'Rejected';
  }
}