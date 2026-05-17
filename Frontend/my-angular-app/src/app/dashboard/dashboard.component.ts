import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../core/services/leave.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  leaves: any[] = [];

  constructor(private service: LeaveService) {}

  ngOnInit() {
    this.service.getAll().subscribe((res: any[]) => {
      this.leaves = res;
    });
  }
}