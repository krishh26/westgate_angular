import { Component, OnInit } from '@angular/core';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-wise-resources-list',
  templateUrl: './role-wise-resources-list.component.html',
  styleUrls: ['./role-wise-resources-list.component.scss']
})
export class RoleWiseResourcesListComponent implements OnInit {
  rolesList: any[] = [];
  loading: boolean = false;
  page: number = 1;
  pagesize: number = 10;
  totalRecords: number = 0;
  searchText: string = '';

  constructor(
    private superadminService: SuperadminService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRolesList();
  }

  getRolesList() {
    this.loading = true;
    this.spinner.show();
    this.superadminService.getRolesList().subscribe({
      next: (response) => {
        this.rolesList = response.data?.roles || [];
        this.totalRecords = this.rolesList.length;
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  searchtext() {
    this.page = 1;
    this.getRolesList();
  }

  pageChanged(event: any) {
    this.page = event;
    this.getRolesList();
  }

  viewRoleDetails(role: any) {
    // Navigate to resources view with role ID
    this.router.navigate(['/super-admin/resources-view'], {
      queryParams: { roleId: role._id }
    });
  }
}
