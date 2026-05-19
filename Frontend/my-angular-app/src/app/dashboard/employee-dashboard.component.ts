import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService, VMLeaveRequest } from '../core/services/leave.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  leaves: any[] = [];
  filteredLeaves: any[] = []; // ✅ ADDED

  // Filters
  selectedStatus: number | null = null;
  selectedType: number | null = null;
  fromDate: string = '';
  toDate: string = '';

  totalLeaves = 0;

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.fetchLeaves();
  }

  fetchLeaves() {

    const payload: VMLeaveRequest = {
      employeeId: 1, // 🔥 dynamic later
      status: this.selectedStatus ?? undefined,
      leaveTypeId: this.selectedType ?? undefined,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      sortBy: 'AddedDate',
      sortDir: 'desc'
    };

    this.leaveService.getLeaveRequests(payload)
      .subscribe({
        next: (res: any[]) => {
          this.leaves = res;
          this.filteredLeaves = res; // ✅ ADDED (frontend working copy)
          this.calculateSummary();
        },
        error: (err) => {
          console.error('API Error', err);
        }
      });
  }

  calculateSummary() {
    this.totalLeaves = this.leaves.reduce((sum, l) => sum + l.daysRequested, 0);
  }

  getStatusText(status: number) {
    return status === 1 ? 'Approved' :
           status === 2 ? 'Rejected' : 'Pending';
  }

  getStatusClass(status: number) {
    return status === 1 ? 'approved' :
           status === 2 ? 'rejected' : 'pending';
  }

  applyFilters() {
    this.fetchLeaves(); // backend filtering
  }

  resetFilters() {
    this.selectedStatus = null;
    this.selectedType = null;
    this.fromDate = '';
    this.toDate = '';
    this.fetchLeaves();
  }

  // ✅ ADDED: sort function (frontend sorting)
  sortByDate() {
    this.filteredLeaves.sort((a, b) =>
      new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    );
  }
}