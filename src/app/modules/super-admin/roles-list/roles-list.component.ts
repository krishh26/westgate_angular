import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RolesListComponent implements OnInit {
  rolesList: any[] = [];
  isLoading = false;

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getRolesList();
  }

  getRolesList() {
    this.isLoading = true;
    this.superService.getRolesList().subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.status) {
          this.rolesList = response?.data?.roles || [];
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch roles');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notificationService.showError(error?.message || 'An error occurred while fetching roles');
      }
    });
  }

  deleteRole(roleId: string) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.superService.deleteRole(roleId).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.notificationService.showSuccess('Role deleted successfully');
            this.getRolesList(); // Refresh the list
          } else {
            this.notificationService.showError(response?.message || 'Failed to delete role');
          }
        },
        error: (error: any) => {
          this.notificationService.showError(error?.message || 'An error occurred while deleting the role');
        }
      });
    }
  }
}
