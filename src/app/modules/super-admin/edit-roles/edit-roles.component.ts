import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class EditRolesComponent implements OnInit {
  roleForm: FormGroup;
  roleId: string = '';
  isLoading: boolean = false;
  newOtherRole: string = '';
  otherRoles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private superService: SuperadminService,
    private notificationService: NotificationService
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      otherRoles: []
    });
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.params['id'];
    if (this.roleId) {
      this.getRoleDetails();
    }
  }

  getRoleDetails() {
    this.isLoading = true;
    this.superService.getRoleById(this.roleId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.status) {
          const roleData = response.data;
          this.roleForm.patchValue({
            name: roleData.name
          });
          this.otherRoles = roleData.otherRoles || [];
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch role details');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notificationService.showError(error?.message || 'An error occurred while fetching role details');
      }
    });
  }

  addOtherRole(): void {
    if (this.newOtherRole?.trim() && !this.otherRoles.includes(this.newOtherRole.trim())) {
      this.otherRoles.push(this.newOtherRole.trim());
      this.newOtherRole = '';
    }
  }

  removeOtherRole(index: number): void {
    this.otherRoles.splice(index, 1);
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.isLoading = true;
      const formData = {
        ...this.roleForm.value,
        otherRoles: this.otherRoles
      };

      this.superService.updateRole(this.roleId, formData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response && response.status) {
            this.notificationService.showSuccess('Role updated successfully');
            this.router.navigate(['/super-admin/roles-list']);
          } else {
            this.notificationService.showError(response?.message || 'Failed to update role');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.notificationService.showError(error?.message || 'An error occurred while updating the role');
        }
      });
    }
  }
}
