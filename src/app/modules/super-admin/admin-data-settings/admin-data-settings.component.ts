import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-data-settings',
  templateUrl: './admin-data-settings.component.html',
  styleUrls: ['./admin-data-settings.component.scss']
})
export class AdminDataSettingsComponent implements OnInit {
  selectedOption: string = 'technology';
  selectedExpertiseType: string = 'technologies';
  technologies: any[] = [];
  expertises: any[] = [];
  roles: any[] = [];
  subExpertises: any[] = [];
  error: string = '';
  technologyForm: FormGroup;
  expertiseForm: FormGroup;
  roleData: any = {
    name: '',
    otherRoles: []
  };
  isLoading: boolean = false;
  showLoader: boolean = false;
  newOtherRole: string = '';
  otherRoles: string[] = [];
  submitted: boolean = false;
  searchQuery: string = '';
  searchTimeout: any;
  expertiseSearchQuery: string = '';
  expertiseSearchTimeout: any;
  subExpertiseSearchQuery: string = '';
  subExpertiseSearchTimeout: any;

  constructor(
    private superadminService: SuperadminService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) {
    this.technologyForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.expertiseForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTechnologies();
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    if (option === 'technology') {
      this.loadTechnologies();
    } else if (option === 'expertise') {
      this.loadExpertises();
    } else if (option === 'subexpertise') {
      this.loadSubExpertises();
    } else if (option === 'role') {
      this.loadRoles();
    }
  }

  selectExpertiseType(type: string): void {
    this.selectedExpertiseType = type;
    this.loadExpertises();
  }

  loadTechnologies(): void {
    this.showLoader = true;
    this.superadminService.getTechnologies().subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.technologies = response.data || [];
        } else {
          this.error = response?.message || 'Failed to load technologies';
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.error = error?.message || 'An error occurred while loading technologies';
        this.showLoader = false;
      }
    });
  }

  loadExpertises(): void {
    this.showLoader = true;

    this.superadminService.getExpertiseDropdownList(this.selectedExpertiseType, this.expertiseSearchQuery).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.expertises = response.data || [];
        } else {
          this.error = response?.message || 'Failed to load expertises';
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.error = error?.message || 'An error occurred while loading expertises';
        this.showLoader = false;
      }
    });
  }

  loadSubExpertises(): void {
    this.showLoader = true;
    this.superadminService.getSubExpertiseDropdownList(this.subExpertiseSearchQuery).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.subExpertises = response.data.map((item: string) => ({
            name: item
          }));
        } else {
          this.error = response?.message || 'Failed to load sub expertises';
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.error = error?.message || 'An error occurred while loading sub expertises';
        this.showLoader = false;
      }
    });
  }

  loadRoles(): void {
    this.showLoader = true;
    const params = {
      search: this.searchQuery
    };
    this.superadminService.getAllRoles(params).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.roles = response?.data?.roles || [];
        } else {
          this.error = response?.message || 'Failed to load roles';
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.error = error?.message || 'An error occurred while loading roles';
        this.showLoader = false;
      }
    });
  }

  onSearchChange(query: string): void {
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a new timeout to debounce the search
    this.searchTimeout = setTimeout(() => {
      this.searchQuery = query;
      this.loadRoles();
    }, 300); // Wait for 300ms after user stops typing
  }

  openAddTechnologyModal(content: any): void {
    this.technologyForm.reset();
    this.submitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.technologyForm.invalid) {
      return;
    }

    this.showLoader = true;
    this.superadminService.createTechnology(this.technologyForm.value).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Technology added successfully');
          this.modalService.dismissAll();
          this.loadTechnologies();
        } else {
          this.notificationService.showError(response?.message || 'Failed to add technology');
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.notificationService.showError(error?.message || 'An error occurred while adding technology');
        this.showLoader = false;
      }
    });
  }

  deleteTechnology(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this technology?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.superadminService.deleteTechnology(id).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.notificationService.showSuccess('Technology deleted successfully');
              this.loadTechnologies();
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete technology');
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            this.notificationService.showError(error?.message || 'An error occurred while deleting technology');
            this.showLoader = false;
          }
        });
      }
    });
  }

  deleteExpertise(expertiseId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this expertise?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.superadminService.deleteExpertiseWithoutSupplier(expertiseId).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.notificationService.showSuccess('Expertise deleted successfully');
              this.loadExpertises();
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete expertise');
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            this.notificationService.showError(error?.message || 'An error occurred while deleting expertise');
            this.showLoader = false;
          }
        });
      }
    });
  }

  openAddExpertiseModal(content: any): void {
    this.expertiseForm.reset();
    this.submitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmitExpertise(): void {
    this.submitted = true;
    if (this.expertiseForm.invalid) {
      return;
    }

    this.showLoader = true;
    const payload = {
      name: this.expertiseForm.value.name,
      type: this.expertiseForm.value.type
    };

    this.superadminService.createCustomExpertise(payload).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Expertise added successfully');
          this.modalService.dismissAll();
          this.loadExpertises();
        } else {
          this.notificationService.showError(response?.message || 'Failed to add expertise');
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.notificationService.showError(error?.message || 'An error occurred while adding expertise');
        this.showLoader = false;
      }
    });
  }

  getSelectedOptionTitle(): string {
    switch (this.selectedOption) {
      case 'technology':
        return 'Technology Settings';
      case 'expertise':
        return 'Expertise Settings';
      case 'subexpertise':
        return 'Sub Expertise Settings';
      case 'role':
        return 'Role Settings';
      default:
        return 'Admin Data Settings';
    }
  }

  deleteRole(roleId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.superadminService.deleteRole(roleId).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.roles = this.roles.filter(role => role._id !== roleId);
              this.notificationService.showSuccess('Role deleted successfully');
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete role');
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            console.error('Error deleting role:', error);
            this.notificationService.showError('Failed to delete role');
            this.showLoader = false;
          }
        });
      }
    });
  }

  openAddRoleModal(content: any): void {
    this.roleData = {
      name: '',
      otherRoles: []
    };
    this.otherRoles = [];
    this.newOtherRole = '';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
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

  onSubmitRole(): void {
    if (!this.roleData.name) {
      this.notificationService.showError('Please enter role name');
      return;
    }

    this.isLoading = true;
    this.roleData.otherRoles = this.otherRoles;

    this.superadminService.addRole(this.roleData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.status) {
          this.notificationService.showSuccess('Role added successfully');
          this.modalService.dismissAll();
          this.loadRoles();
        } else {
          this.notificationService.showError(response.message || 'Failed to add role');
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notificationService.showError(error.message || 'An error occurred while adding role');
      }
    });
  }

  onExpertiseSearchChange(query: string): void {
    // Clear any existing timeout
    if (this.expertiseSearchTimeout) {
      clearTimeout(this.expertiseSearchTimeout);
    }

    // Set a new timeout to debounce the search
    this.expertiseSearchTimeout = setTimeout(() => {
      this.expertiseSearchQuery = query;
      this.loadExpertises();
    }, 300); // Wait for 300ms after user stops typing
  }

  onSubExpertiseSearchChange(query: string): void {
    // Clear any existing timeout
    if (this.subExpertiseSearchTimeout) {
      clearTimeout(this.subExpertiseSearchTimeout);
    }

    // Set a new timeout to debounce the search
    this.subExpertiseSearchTimeout = setTimeout(() => {
      this.subExpertiseSearchQuery = query;
      this.loadSubExpertises();
    }, 300); // Wait for 300ms after user stops typing
  }
}
