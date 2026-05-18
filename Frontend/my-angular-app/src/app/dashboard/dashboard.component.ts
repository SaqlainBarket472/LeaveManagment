import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeaveService } from '../core/services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

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
    sortBy: 'startDate',
    search: ''
  };

  statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  leaveTypeOptions = [
    { id: 1, name: 'Casual Leave' },
    { id: 2, name: 'Sick Leave' },
    { id: 3, name: 'Personal Leave' }
  ];

  statusMap: Record<number, string> = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected'
  };

  defaultBalances: Record<number, number> = { 1: 12, 2: 10, 3: 8 };
  private searchTerm = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private service: LeaveService) {}

  ngOnInit() {
    this.service.getAll().subscribe((res: any[]) => {
      this.leaves = (res || []).map((leave) => ({
        ...leave,
        statusLabel: this.statusMap[leave.status] ?? leave.status,
      }));
      this.applyFilters();
    });

    this.searchTerm.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((term) => {
      this.filters.search = term.trim();
      this.applyFilters();
    });
  }

  applyFilters() {
    const searchQuery = this.filters.search?.toLowerCase().trim();

    this.filteredLeaves = this.leaves
      .filter((leave) => {
        const leaveStatus = typeof leave.status === 'number' ? leave.statusLabel : leave.status;
        const matchesStatus = this.filters.status === 'All' || leaveStatus === this.filters.status;
        const matchesType = !this.filters.leaveTypeId || leave.leaveTypeId === +this.filters.leaveTypeId;
        const matchesFrom = !this.filters.fromDate || new Date(leave.startDate) >= new Date(this.filters.fromDate);
        const matchesTo = !this.filters.toDate || new Date(leave.endDate) <= new Date(this.filters.toDate);
        const matchesSearch =
          !searchQuery ||
          String(leave.employeeId).includes(searchQuery) ||
          String(leave.reason || '').toLowerCase().includes(searchQuery) ||
          this.getLeaveTypeName(leave.leaveTypeId).toLowerCase().includes(searchQuery);

        return matchesStatus && matchesType && matchesFrom && matchesTo && matchesSearch;
      })
      .sort((a, b) => this.compareLeaves(a, b));
  }

  compareLeaves(a: any, b: any) {
    if (this.filters.sortBy === 'status') {
      return (a.statusLabel || '').localeCompare(b.statusLabel || '');
    }
    if (this.filters.sortBy === 'endDate') {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }

  getLeaveTypeName(typeId: number) {
    return this.leaveTypeOptions.find((type) => type.id === typeId)?.name || 'Unknown';
  }

  onSearchChange(value: string) {
    this.searchTerm.next(value);
  }

  getTypeBalance(typeId: number) {
    const used = this.leaves.filter((leave) => Number(leave.leaveTypeId) === typeId).length;
    return Math.max(0, (this.defaultBalances[typeId] || 0) - used);
  }

  getTypeBalancePercent(typeId: number) {
    const available = this.defaultBalances[typeId] || 0;
    const remaining = this.getTypeBalance(typeId);
    return available > 0 ? Math.round((remaining / available) * 100) : 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
