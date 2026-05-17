import { Component, OnInit } from '@angular/core';
 import { LeaveService } from '../core/services/leave.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-approval',
  imports: [CommonModule],
  templateUrl: './approval.component.html'
})
export class ApprovalComponent implements OnInit {

  requests: any[] = [];

  constructor(private service: LeaveService) {}

  ngOnInit() {
    this.service.getAll().subscribe((res: any[]) => {
      this.requests = res.filter((x: any) => x.status === 'Pending');
    });
  }

  approve(id: number) {
    this.service.approveLeave(id).subscribe(() => location.reload());
  }

  reject(id: number) {
    this.service.rejectLeave(id).subscribe(() => location.reload());
  }
}