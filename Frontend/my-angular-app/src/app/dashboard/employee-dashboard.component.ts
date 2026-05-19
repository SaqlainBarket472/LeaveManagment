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
  filteredLeaves: any[] = [];

  employeeName: string = '';

  selectedStatus: number | null = null;
  selectedType: number | null = null;
  fromDate: string = '';
  toDate: string = '';

  totalLeaves = 0;

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.fetchLeaves();
  }

  // =========================
  // FETCH DATA FROM API
  // =========================
  fetchLeaves() {

    const payload: VMLeaveRequest = {
      employeeId: 1,
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
          this.filteredLeaves = [...res];

          if (res.length > 0) {
            this.employeeName = res[0].employeeName || 'Employee';
          }

          this.calculateSummary();
        },
        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  // =========================
  // APPLY FRONTEND FILTERS
  // =========================
  applyFilters() {

    this.filteredLeaves = this.leaves.filter(l => {

      const matchStatus =
        this.selectedStatus === null || l.status === this.selectedStatus;

      const matchType =
        this.selectedType === null || l.leaveTypeId === this.selectedType;

      const matchFromDate =
        !this.fromDate || new Date(l.addedDate) >= new Date(this.fromDate);

      const matchToDate =
        !this.toDate || new Date(l.addedDate) <= new Date(this.toDate);

      return matchStatus && matchType && matchFromDate && matchToDate;
    });

    this.calculateSummary();
  }

  // =========================
  // RESET FILTERS
  // =========================
  resetFilters() {

    this.selectedStatus = null;
    this.selectedType = null;
    this.fromDate = '';
    this.toDate = '';

    this.filteredLeaves = [...this.leaves];
    this.calculateSummary();
  }

  // =========================
  // SORT BY DATE
  // =========================
  sortByDate() {

    this.filteredLeaves.sort((a, b) =>
      new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    );
  }

  // =========================
  // SUMMARY CALCULATION
  // =========================
  calculateSummary() {

    this.totalLeaves = this.filteredLeaves.reduce(
      (sum, l) => sum + (l.daysRequested || 0),
      0
    );
  }

  // =========================
  // STATUS HELPERS
  // =========================
  getStatusText(status: number) {
    return status === 1 ? 'Approved' :
           status === 2 ? 'Rejected' : 'Pending';
  }

  getStatusClass(status: number) {
    return status === 1 ? 'approved' :
           status === 2 ? 'rejected' : 'pending';
  }
}