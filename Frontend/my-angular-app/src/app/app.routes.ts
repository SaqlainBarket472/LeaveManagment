import { Routes } from '@angular/router';
import { ApplyLeaveComponent } from './features/apply-leave/apply-leave.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApprovalComponent } from './approval/approval.component';
import { LeaveTypesComponent } from './leave-types/leave-types.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'apply', component: ApplyLeaveComponent },
  { path: 'approval', component: ApprovalComponent },
  { path: 'leave-types', component: LeaveTypesComponent }
];