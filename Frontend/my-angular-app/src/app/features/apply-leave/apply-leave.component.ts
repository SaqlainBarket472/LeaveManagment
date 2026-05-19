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
  employeeName: 'Saqlain',   // ✅ ADDED
  leaveTypeId: 1
};

  toasts: Toast[] = [];
  isLoading = false;
  private toastId = 0;

  constructor(private service: LeaveService) {}

  submit() {
    this.isLoading = true;

    this.service.applyLeave(this.model).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const message = typeof response === 'string' ? response : response?.message || 'Leave applied successfully';
        this.showToast(message, 'success');
        
        this.model = {
          employeeId: 1,
          leaveTypeId: 1
        };
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err.error?.message || err.error || 'Error applying leave. Please try again.';
        this.showToast(errorMsg, 'error');
      }
    });
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