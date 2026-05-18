import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../core/services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  leaves: any[] = [];
  filteredLeaves: any[] = [];

  filters = {
    status: 'All',
    leaveTypeId: '',
    fromDate: '',
    toDate: '',
    sortBy: 'startDate'
  };

  statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  leaveTypeOptions = [
    { id: 1, name: 'Casual Leave' },
    { id: 2, name: 'Sick Leave' },
    { id: 3, name: 'Personal Leave' }
  ];

  constructor(private service: LeaveService) {}

  ngOnInit() {
    this.service.getAll().subscribe((res: any[]) => {
      this.leaves = res || [];
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredLeaves = this.leaves
      .filter((leave) => {
        const matchesStatus = this.filters.status === 'All' || leave.status === this.filters.status;
        const matchesType = !this.filters.leaveTypeId || leave.leaveTypeId === +this.filters.leaveTypeId;
        const matchesFrom = !this.filters.fromDate || new Date(leave.startDate) >= new Date(this.filters.fromDate);
        const matchesTo = !this.filters.toDate || new Date(leave.endDate) <= new Date(this.filters.toDate);
        return matchesStatus && matchesType && matchesFrom && matchesTo;
      })
      .sort((a, b) => this.compareLeaves(a, b));
  }

  compareLeaves(a: any, b: any) {
    if (this.filters.sortBy === 'status') {
      return (a.status || '').localeCompare(b.status || '');
    }
    if (this.filters.sortBy === 'endDate') {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }

  getLeaveTypeName(typeId: number) {
    return this.leaveTypeOptions.find((type) => type.id === typeId)?.name || 'Unknown';
  }

  getTotalBalance() {
    const defaultBalances: Record<number, number> = { 1: 12, 2: 10, 3: 8 };
    const usedCounts: Record<number, number> = this.leaves.reduce((acc: Record<number, number>, leave: any) => {
      const typeId = Number(leave.leaveTypeId);
      acc[typeId] = (acc[typeId] || 0) + 1;
      return acc;
    }, {});

    return this.leaveTypeOptions.reduce((sum, type) => {
      const remaining = Math.max(0, (defaultBalances[type.id] || 0) - (usedCounts[type.id] || 0));
      return sum + remaining;
    }, 0);
  }

  getTypeBalance(typeId: number) {
    const defaultBalances: Record<number, number> = { 1: 12, 2: 10, 3: 8 };
    const used = this.leaves.filter((leave) => Number(leave.leaveTypeId) === typeId).length;
    return Math.max(0, (defaultBalances[typeId] || 0) - used);
  }

  resetFilters() {
    this.filters = {
      status: 'All',
      leaveTypeId: '',
      fromDate: '',
      toDate: '',
      sortBy: 'startDate'
    };
    this.applyFilters();
  }
}
