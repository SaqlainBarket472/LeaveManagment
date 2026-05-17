import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../core/services/leave.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {

  model: any = {
    employeeId: 1,
    leaveTypeId: 1
  };

  constructor(private service: LeaveService) {}

  submit() {
    this.service.applyLeave(this.model).subscribe({
      next: () => alert('Leave Applied Successfully'),
      error: (err) => alert(err.error.message)
    });
  }
}