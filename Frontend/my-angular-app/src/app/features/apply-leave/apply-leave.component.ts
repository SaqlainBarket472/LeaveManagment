import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';
import { CommonModule } from '@angular/common';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {

  model: any = {
    employeeId: 1,
    employeeName: 'Saqlain',
    leaveTypeId: 1,
    startDate: '',
    endDate: '',
    daysRequested: 0   // ✅ calculated value
  };

  toasts: Toast[] = [];
  isLoading = false;
  private toastId = 0;

  constructor(private service: LeaveService) {}

  submit() {
    this.isLoading = true;

    // ✅ Calculate working days excluding Saturday + Sunday
    this.model.daysRequested = this.calculateWorkingDays(
      this.model.startDate,
      this.model.endDate
    );

    this.service.applyLeave(this.model).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        const message =
          typeof response === 'string'
            ? response
            : response?.message || 'Leave applied successfully';

        this.showToast(message, 'success');

        // reset form
        this.model = {
          employeeId: 1,
          employeeName: 'Saqlain',
          leaveTypeId: 1,
          startDate: '',
          endDate: '',
          daysRequested: 0
        };
      },

      error: (err) => {
        this.isLoading = false;

        const errorMsg =
          err.error?.message || err.error || 'Error applying leave. Please try again.';

        this.showToast(errorMsg, 'error');
      }
    });
  }

  // ✅ WEEKEND SKIP LOGIC (Saturday + Sunday excluded)
  calculateWorkingDays(start: string, end: string): number {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {

      const isWeekend =
        current.getDay() === 0 || // Sunday
        current.getDay() === 6;   // Saturday

      if (!isWeekend) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.toastId;
    const toast: Toast = { id, message, type };

    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}