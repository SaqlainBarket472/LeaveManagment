import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveType } from '../shared/models/leave.model';

@Component({
  standalone: true,
  selector: 'app-leave-types',
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-types.component.html'
})
export class LeaveTypesComponent {
  leaveTypes: LeaveType[] = [
    { id: 1, name: 'Casual Leave', defaultBalance: 12, isAccrued: true },
    { id: 2, name: 'Sick Leave', defaultBalance: 10, isAccrued: false },
    { id: 3, name: 'Personal Leave', defaultBalance: 8, isAccrued: false }
  ];

  formModel: LeaveType = this.createEmptyType();
  editMode = false;
  feedback = '';

  saveLeaveType() {
    const name = this.formModel.name?.trim();
    if (!name) {
      this.feedback = 'Leave type name is required.';
      return;
    }

    if (this.editMode) {
      const index = this.leaveTypes.findIndex((item) => item.id === this.formModel.id);
      if (index !== -1) {
        this.leaveTypes[index] = { ...this.formModel };
        this.feedback = 'Leave type updated successfully.';
      }
    } else {
      const nextId = this.leaveTypes.length ? Math.max(...this.leaveTypes.map((item) => item.id)) + 1 : 1;
      this.leaveTypes.push({ ...this.formModel, id: nextId });
      this.feedback = 'Leave type added successfully.';
    }

    this.resetForm();
  }

  editLeaveType(item: LeaveType) {
    this.formModel = { ...item };
    this.editMode = true;
    this.feedback = '';
  }

  deleteLeaveType(id: number) {
    this.leaveTypes = this.leaveTypes.filter((item) => item.id !== id);
    if (this.formModel.id === id) {
      this.resetForm();
    }
    this.feedback = 'Leave type removed.';
  }

  resetForm() {
    this.formModel = this.createEmptyType();
    this.editMode = false;
    this.feedback = '';
  }

  private createEmptyType(): LeaveType {
    return {
      id: 0,
      name: '',
      defaultBalance: 0,
      isAccrued: false
    };
  }
}
