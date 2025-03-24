import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AddRolesComponent implements OnInit {
  roleData = {
    name: ''
  };
  isLoading = false;

  constructor(
    private superService: SuperadminService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.roleData.name.trim()) {
      this.notificationService.showError('Please enter a role name');
      return;
    }

    this.isLoading = true;
    this.superService.addRole(this.roleData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.status) {
          this.notificationService.showSuccess('Role added successfully');
          this.router.navigate(['/super-admin/roles-list']);
        } else {
          this.notificationService.showError(response?.message || 'Failed to add role');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notificationService.showError(error?.message || 'An error occurred while adding the role');
      }
    });
  }
}
