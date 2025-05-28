import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-admin-data-settings',
  templateUrl: './admin-data-settings.component.html',
  styleUrls: ['./admin-data-settings.component.scss']
})
export class AdminDataSettingsComponent implements OnInit {
  selectedOption: string = 'technology';
  selectedExpertiseType: string = 'technologies-other';
  technologies: any[] = [];
  expertises: any[] = [];
  roles: any[] = [];
  subExpertises: any[] = [];
  users: any[] = [];
  error: string = '';
  success: string = '';
  technologyForm: FormGroup;
  expertiseForm: FormGroup;
  editExpertiseForm: FormGroup;
  userForm: FormGroup;
  selectedExpertise: any = null;
  roleData: any = {
    name: '',
    otherRoles: []
  };
  isLoading: boolean = false;
  showLoader: boolean = false;
  newOtherRole: string = '';
  otherRoles: string[] = [];
  submitted: boolean = false;
  editSubmitted: boolean = false;
  searchQuery: string = '';
  searchTimeout: any;
  expertiseSearchQuery: string = '';
  expertiseSearchTimeout: any;
  subExpertiseSearchQuery: string = '';
  subExpertiseSearchTimeout: any;
  technologySearchQuery: string = '';
  technologySearchTimeout: any;
  addSubExpertiseName: string = '';
  addSubExpertiseSubmitted: boolean = false;
  userSearchQuery: string = '';
  userSearchTimeout: any;
  userSubmitted: boolean = false;

  constructor(
    private superadminService: SuperadminService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.technologyForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.expertiseForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
    this.editExpertiseForm = this.fb.group({
      name: ['', [Validators.required]],
      itemId: ['', [Validators.required]],
      promoteToType: ['', [Validators.required]]
    });
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      companyName: [''],
      designation: [''],
      poc_name: ['', [Validators.required]],
      poc_email: ['', [Validators.required, Validators.email]],
      poc_phone: ['', [Validators.required]]
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
    } else if (option === 'user') {
      this.loadUsers();
    }
  }

  selectExpertiseType(type: string): void {
    if (type === 'technologies') {
      this.selectedExpertiseType = 'technologies-other';
    } else if (type === 'product') {
      this.selectedExpertiseType = 'product-other';
    } else if (type === 'domain') {
      this.selectedExpertiseType = 'domain-other';
    } else {
      this.selectedExpertiseType = type;
    }
    this.loadExpertises();
  }

  loadTechnologies(): void {
    this.showLoader = true;

    // Create params object to include search if present
    const params: any = {};
    if (this.technologySearchQuery) {
      params.search = this.technologySearchQuery;
    }

    this.superadminService.getTechnologies(params).subscribe({
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
    this.superadminService.getWithoutSupplierSubExpertiseDropdownList(this.subExpertiseSearchQuery).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.subExpertises = response.data || [];
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

  deleteExpertise(expertise: any): void {
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
        this.superadminService.deleteExpertiseWithoutSupplier(expertise._id).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.loadExpertises();
              this.notificationService.showSuccess('Expertise deleted successfully');
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
      case 'user':
        return 'User Settings';
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

  deleteSubExpertise(subExpertise: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this sub expertise?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.superadminService.deleteSubExpertiseById(subExpertise.id).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.loadSubExpertises();
              this.notificationService.showSuccess('Sub expertise deleted successfully');
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete sub expertise');
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            this.notificationService.showError(error?.message || 'An error occurred while deleting sub expertise');
            this.showLoader = false;
          }
        });
      }
    });
  }

  openAddSubExpertiseModal(content: any): void {
    this.addSubExpertiseName = '';
    this.addSubExpertiseSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  closeAddSubExpertiseModal(): void {
    this.modalService.dismissAll();
  }

  onSubmitAddSubExpertise(): void {
    this.addSubExpertiseSubmitted = true;
    if (!this.addSubExpertiseName.trim()) {
      return;
    }
    this.showLoader = true;
    this.superadminService.addSubExpertiseByName(this.addSubExpertiseName.trim()).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Sub expertise added successfully');
          this.closeAddSubExpertiseModal();
          this.loadSubExpertises();
        } else {
          this.notificationService.showError(response?.message || 'Failed to add sub expertise');
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.notificationService.showError(error?.message || 'An error occurred while adding sub expertise');
        this.showLoader = false;
      }
    });
  }

  onTechnologySearchChange(query: string): void {
    // Clear any existing timeout
    if (this.technologySearchTimeout) {
      clearTimeout(this.technologySearchTimeout);
    }

    // Set a new timeout to debounce the search
    this.technologySearchTimeout = setTimeout(() => {
      this.technologySearchQuery = query;
      this.loadTechnologies();
    }, 300); // Wait for 300ms after user stops typing
  }

  openEditExpertiseModal(content: any, expertise: any): void {
    this.selectedExpertise = expertise;
    this.editSubmitted = false;
    this.editExpertiseForm.patchValue({
      name: expertise.name,
      itemId: expertise._id,
      promoteToType: this.selectedExpertiseType
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmitEditExpertise(): void {
    this.editSubmitted = true;
    if (this.editExpertiseForm.invalid) {
      return;
    }

    this.showLoader = true;
    const payload = {
      itemId: this.editExpertiseForm.value.itemId,
      promoteToType: this.editExpertiseForm.value.promoteToType
    };

    this.superadminService.promoteExpertise(payload).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Expertise promoted successfully');
          this.modalService.dismissAll();
          this.loadExpertises();
        } else {
          this.notificationService.showError(response?.message || 'Failed to promote expertise');
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.notificationService.showError(error?.message || 'An error occurred while promoting expertise');
        this.showLoader = false;
      }
    });
  }

  loadUsers(): void {
    this.showLoader = true;
    const params = {
      search: this.userSearchQuery
    };
    this.superadminService.getAllUsers(params).subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Debug log
        if (response?.status) {
          // Fix: data is directly in response.data, not response.data.users
          this.users = response?.data || [];
          console.log('Users loaded:', this.users); // Debug log
        } else {
          this.error = response?.message || 'Failed to load users';
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error); // Debug log
        this.error = error?.message || 'An error occurred while loading users';
        this.showLoader = false;
      }
    });
  }

  onUserSearchChange(query: string): void {
    // Clear any existing timeout
    if (this.userSearchTimeout) {
      clearTimeout(this.userSearchTimeout);
    }

    // Set a new timeout to debounce the search
    this.userSearchTimeout = setTimeout(() => {
      this.userSearchQuery = query;
      this.loadUsers();
    }, 300); // Wait for 300ms after user stops typing
  }

  openAddUserModal(content: any): void {
    this.userForm.reset();
    this.userSubmitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmitUser(): void {
    this.userSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    this.showLoader = true;
    this.superadminService.registerUser(this.userForm.value).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('User added successfully');
          this.modalService.dismissAll();
          this.loadUsers();
        } else {
          this.notificationService.showError(response?.message || 'Failed to add user');
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        this.notificationService.showError(error?.message || 'An error occurred while adding user');
        this.showLoader = false;
      }
    });
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.superadminService.deleteUser(userId).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.notificationService.showSuccess('User deleted successfully');
              this.loadUsers();
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete user');
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            this.notificationService.showError(error?.message || 'An error occurred while deleting user');
            this.showLoader = false;
          }
        });
      }
    });
  }

  viewUserDetails(user: any): void {
    // Format user details for display
    const userDetails = `
      <div style="text-align: left;">
        <h6><strong>Basic Information:</strong></h6>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Username:</strong> ${user.userName || 'N/A'}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Status:</strong> ${user.active ? 'Active' : 'Inactive'}</p>

        <h6><strong>Company Information:</strong></h6>
        <p><strong>Company:</strong> ${user.companyName || 'N/A'}</p>
        <p><strong>Website:</strong> ${user.website || 'N/A'}</p>
        <p><strong>Location:</strong> ${user.location || 'N/A'}</p>
        <p><strong>Country:</strong> ${user.country || 'N/A'}</p>

        <h6><strong>Contact Information:</strong></h6>
        <p><strong>POC Name:</strong> ${user.poc_name || 'N/A'}</p>
        <p><strong>POC Email:</strong> ${user.poc_email || 'N/A'}</p>
        <p><strong>POC Phone:</strong> ${user.poc_phone || 'N/A'}</p>

        <h6><strong>Activity:</strong></h6>
        <p><strong>Last Login:</strong> ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
        <p><strong>Joined:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
      </div>
    `;

    Swal.fire({
      title: `User Details - ${user.name}`,
      html: userDetails,
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#0d6efd',
      width: '600px'
    });
  }

  editUser(user: any): void {
    // Populate form with user data for editing
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      userName: user.userName,
      role: user.role,
      companyName: user.companyName,
      poc_name: user.poc_name,
      poc_email: user.poc_email,
      poc_phone: user.poc_phone
    });

    // Remove password requirement for editing
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();

    this.userSubmitted = false;
    // TODO: Open edit modal instead of add modal
    // For now, we'll use the same modal but modify the submit behavior
  }

  toggleUserStatus(user: any): void {
    const action = user.active ? 'deactivate' : 'activate';
    const newStatus = !user.active;

    Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      text: `Are you sure you want to ${action} ${user.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#198754' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}!`
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        // Update user status using AuthService
        const payload = { active: newStatus };

        this.authService.updateUser(user._id, payload).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.notificationService.showSuccess(`User ${action}d successfully`);
              this.loadUsers();
            } else {
              this.notificationService.showError(response?.message || `Failed to ${action} user`);
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            this.notificationService.showError(error?.message || `An error occurred while ${action}ing user`);
            this.showLoader = false;
          }
        });
      }
    });
  }
}
