import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HttpParams } from '@angular/common/http';

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
  tags: any[] = [];
  error: string = '';
  success: string = '';
  technologyForm: FormGroup;
  expertiseForm: FormGroup;
  editExpertiseForm: FormGroup;
  userForm: FormGroup;
  tagForm: FormGroup;
  tagSubmitted: boolean = false;
  tagSearchQuery: string = '';
  tagSearchTimeout: any;
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
  editUserForm: FormGroup;
  editUserSubmitted = false;
  selectedUserForEdit: any;
  servicesList: any[] = [];
  selectedUserRole: string = '';
  rolesList: any[] = [];
  @ViewChild('editUserModal') editUserModal: any;

  // Pound Rate properties
  poundRateForm: FormGroup;
  poundRateSubmitted: boolean = false;
  currentPoundRate: number | null = null;

  editRoleData: any = {
    name: '',
    otherRoles: []
  };
  selectedRoleId: string = '';

  editTagForm: FormGroup;
  editTagSubmitted: boolean = false;
  selectedTagId: string = '';

  constructor(
    private superadminService: SuperadminService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.servicesList = [
      { name: 'Pre-Built Software Solutions', value: 'Pre-Built Software Solutions' },
      { name: 'Custom Software Development', value: 'Custom Software Development' },
      { name: 'Hosting & Infrastructure', value: 'Hosting & Infrastructure' },
      { name: 'IT Consulting & System Integration', value: 'IT Consulting & System Integration' },
      { name: 'Support & Maintenance', value: 'Support & Maintenance' },
      { name: 'Analytics & Reporting', value: 'Analytics & Reporting' },
      { name: 'Security & Compliance', value: 'Security & Compliance' },
      { name: 'Logos, UI/UX', value: 'Logos, UI/UX' },
      { name: 'Digital Marketing & SEO', value: 'Digital Marketing & SEO' },
      { name: 'DevOps & Automation', value: 'DevOps & Automation' },
      { name: 'AI & Machine Learning', value: 'AI & Machine Learning' },
      { name: 'Data Migration & Legacy Modernisation', value: 'Data Migration & Legacy Modernisation' },
      { name: 'Quality Assurance and Software Testing', value: 'Quality Assurance and Software Testing' },
      { name: 'Blockchain Development', value: 'Blockchain Development' },
      { name: 'IoT Development', value: 'IoT Development' }
    ];

    this.rolesList = [
      { label: 'Sales Manager', value: 'BOS' },
      { label: 'Super Admin', value: 'Admin' },
      { label: 'Process Manager', value: 'ProcessManagerAdmin' },
      { label: 'Bid Manager', value: 'ProjectManager' },
      { label: 'Users', value: 'SalesManager' },
      { label: 'SupplierAdmin', value: 'SupplierAdmin' }
    ];

    this.technologyForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.expertiseForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      tags: [[]]
    });
    this.editExpertiseForm = this.fb.group({
      name: ['', [Validators.required]],
      itemId: ['', [Validators.required]],
      promoteToType: ['', [Validators.required]],
      tags: [[]]
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
    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      role: ['', Validators.required],
      companyName: [''],
      designation: [''],
      poc_name: ['', Validators.required],
      poc_email: ['', [Validators.required, Validators.email]],
      poc_phone: ['', Validators.required]
    });
    this.poundRateForm = this.fb.group({
      rate: ['', [Validators.required, Validators.min(0.01)]]
    });
    this.tagForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.editTagForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTechnologies();
    // Load pound rate if it's the selected option
    if (this.selectedOption === 'pound-rate') {
      this.loadPoundRate();
    }
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
    } else if (option === 'pound-rate') {
      this.loadPoundRate();
    } else if (option === 'tags') {
      this.loadTags();
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
          // Log the response to see the data structure
          console.log('Sub Expertise Response:', response);
          this.subExpertises = response.data || [];
          // Log the mapped data
          console.log('Mapped Sub Expertises:', this.subExpertises);
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
    this.expertiseForm.patchValue({
      tags: []
    });
    this.submitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmitExpertise(): void {
    this.submitted = true;
    if (this.expertiseForm.invalid) {
      return;
    }

    this.showLoader = true;

    // Remove "-other" suffix from type
    let expertiseType = this.expertiseForm.value.type;
    if (expertiseType.endsWith('-other')) {
      expertiseType = expertiseType.replace('-other', '');
    }

    const payload = {
      name: this.expertiseForm.value.name,
      type: expertiseType,
      tags: this.expertiseForm.value.tags
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
      case 'pound-rate':
        return 'Pound Rate Settings';
      case 'tags':
        return 'Tags/Services Settings';
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
    // Reset the role data
    this.roleData = {
      name: '',
      otherRoles: []
    };
    this.newOtherRole = '';
    this.modalService.open(content, { size: 'lg' });
  }

  addOtherRole(): void {
    const trimmedRole = this.newOtherRole?.trim();
    if (trimmedRole) {
      // Add to roleData.otherRoles if we're adding new
      if (!this.selectedRoleId) {
        if (!this.roleData.otherRoles) {
          this.roleData.otherRoles = [];
        }
        if (!this.roleData.otherRoles.includes(trimmedRole)) {
          this.roleData.otherRoles.push(trimmedRole);
        }
      }
      // Add to editRoleData.otherRoles if we're editing
      else {
        if (!this.editRoleData.otherRoles) {
          this.editRoleData.otherRoles = [];
        }
        if (!this.editRoleData.otherRoles.includes(trimmedRole)) {
          this.editRoleData.otherRoles.push(trimmedRole);
        }
      }
      this.newOtherRole = ''; // Clear the input
    }
  }

  removeOtherRole(index: number): void {
    // Remove from roleData.otherRoles if we're adding new
    if (!this.selectedRoleId && this.roleData.otherRoles) {
      this.roleData.otherRoles.splice(index, 1);
    }
    // Remove from editRoleData.otherRoles if we're editing
    else if (this.selectedRoleId && this.editRoleData.otherRoles) {
      this.editRoleData.otherRoles.splice(index, 1);
    }
  }

  onSubmitRole(): void {
    if (!this.roleData.name?.trim()) {
      this.toastr.error('Please enter role name');
      return;
    }

    this.isLoading = true;
    const payload = {
      name: this.roleData.name.trim(),
      otherRole: this.roleData.otherRoles || []
    };

    this.superadminService.addRole(payload).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.toastr.success('Role added successfully');
          this.loadRoles();
          this.closeModal();
        } else {
          this.toastr.error(response?.message || 'Failed to add role');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.toastr.error(error?.message || 'An error occurred while adding role');
        this.isLoading = false;
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
    // Get the ID from either _id or id field
    const subExpertiseId = subExpertise._id || subExpertise.id;

    if (!subExpertiseId) {
      this.notificationService.showError('Invalid sub expertise ID');
      return;
    }

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
        this.superadminService.deleteSubExpertiseById(subExpertiseId).subscribe({
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

    // Debug log to see expertise object structure
    console.log('Expertise object:', expertise);
    console.log('Selected expertise type:', this.selectedExpertiseType);

    // Get the expertise type and append "-other" if it doesn't already have it
    let expertiseType = expertise.type || this.selectedExpertiseType;
    if (!expertiseType.endsWith('-other')) {
      expertiseType = `${expertiseType}-other`;
    }

    this.editExpertiseForm.patchValue({
      name: expertise.name,
      itemId: expertise._id,
      promoteToType: expertiseType,
      tags: expertise.tags || []
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmitEditExpertise(): void {
    this.editSubmitted = true;
    if (this.editExpertiseForm.invalid) {
      return;
    }

    this.showLoader = true;

    // Remove "-other" suffix from promoteToType
    let promoteToType = this.editExpertiseForm.value.promoteToType;
    if (promoteToType.endsWith('-other')) {
      promoteToType = promoteToType.replace('-other', '');
    }

    const payload = {
      itemId: this.editExpertiseForm.value.itemId,
      name: this.editExpertiseForm.value.name,
      promoteToType: promoteToType,
      tags: this.editExpertiseForm.value.tags,
      isMandatory: this.selectedExpertise.isMandatory
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
    const params: any = {
      search: this.userSearchQuery
    };

    // Only add userRoles parameter if a role is selected
    if (this.selectedUserRole) {
      params.userRoles = this.selectedUserRole;
    }

    this.superadminService.getAllUsers(params).subscribe({
      next: (response: any) => {
        if (response?.status) {
          // Fix: data is directly in response.data, not response.data.users
          this.users = response?.data || [];
        } else {
          this.error = response?.message || 'Failed to load users';
        }
        this.showLoader = false;
      },
      error: (error: any) => {
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

  editUser(user: any) {
    this.selectedUserForEdit = user;
    this.editUserForm.patchValue({
      name: user.name,
      email: user.email,
      userName: user.userName,
      role: user.role,
      companyName: user.companyName || '',
      designation: user.designation || '',
      poc_name: user.poc_name,
      poc_email: user.poc_email,
      poc_phone: user.poc_phone
    });
    this.modalService.open(this.editUserModal, { size: 'lg' });
  }

  onSubmitEditUser() {
    this.editUserSubmitted = true;
    if (this.editUserForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.editUserForm.value;
    formData._id = this.selectedUserForEdit._id;

    this.superadminService.updateUser(formData).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response?.status === true) {
          this.notificationService.showSuccess('User updated successfully');
          this.modalService.dismissAll();
          this.loadUsers(); // Refresh the users list
        } else {
          this.notificationService.showError(response?.message || 'Failed to update user');
        }
      },
      (error) => {
        this.isLoading = false;
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to update user');
      }
    );
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

  onUserRoleFilterChange(selectedRole: string): void {
    this.selectedUserRole = selectedRole;
    this.loadUsers();
  }

  toggleMandatory(expertise: any): void {
    // Get the expertise type and remove "-other" suffix if it exists
    let expertiseType = expertise.type || this.selectedExpertiseType;
    if (expertiseType.endsWith('-other')) {
      expertiseType = expertiseType.replace('-other', '');
    }

    const updatedData = {
      itemId: expertise._id,
      promoteToType: expertiseType,
      isMandatory: !expertise.isMandatory
    };

    this.superadminService.promoteExpertise(updatedData).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.toastr.success('Expertise updated successfully');
          this.loadExpertises();
        } else {
          this.toastr.error(response?.message || 'Failed to update expertise');
          expertise.isMandatory = !expertise.isMandatory;
        }
      },
      error: (error: any) => {
        this.toastr.error(error?.message || 'An error occurred while updating expertise');
        expertise.isMandatory = !expertise.isMandatory;
      }
    });
  }

  // Pound Rate Methods
  loadPoundRate(): void {
    this.error = '';
    this.success = '';
    this.showLoader = true;

    this.superadminService.getPoundRate().subscribe({
      next: (response: any) => {
        console.log('Pound Rate API Response:', response);
        if (response?.status) {
          // Handle different possible response structures
          const rate = response.data?.rate || response.rate || null;
          this.currentPoundRate = rate;

          if (this.currentPoundRate !== null) {
            // Pre-populate the form with the current/previous value
            this.poundRateForm.patchValue({
              rate: this.currentPoundRate
            });
            console.log('Previous pound rate loaded:', this.currentPoundRate);
          } else {
            // If no previous value exists, set default or leave empty
            this.poundRateForm.patchValue({ rate: '' });
            console.log('No previous pound rate found');
          }
        } else {
          this.error = response?.message || 'Failed to load pound rate';
          // Still allow form to be used even if no previous value
          this.poundRateForm.patchValue({ rate: '' });
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        console.error('Error loading pound rate:', error);
        this.error = error?.message || error?.error?.message || 'An error occurred while loading pound rate';
        // Allow form to be used even if API fails
        this.poundRateForm.patchValue({ rate: '' });
        this.currentPoundRate = null;
        this.showLoader = false;
      }
    });
  }

  onSubmitPoundRate(): void {
    this.poundRateSubmitted = true;
    this.error = '';
    this.success = '';

    if (this.poundRateForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = {
      rate: this.poundRateForm.value.rate
    };

    this.superadminService.updatePoundRate(formData).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.success = 'Pound rate updated successfully';
          this.currentPoundRate = formData.rate;
          this.poundRateSubmitted = false;
        } else {
          this.error = response?.message || 'Failed to update pound rate';
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error?.message || 'An error occurred while updating pound rate';
        this.isLoading = false;
      }
    });
  }

  // Tag related methods
  loadTags(): void {
    this.showLoader = true;
    const params = new HttpParams().set('search', this.tagSearchQuery || '');

    this.superadminService.getTags({ params }).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.tags = response.data?.tags || [];
        } else {
          this.error = response?.message || 'Failed to load tags';
        }
      },
      error: (error: any) => {
        this.error = error?.error?.message || 'Failed to load tags';
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  onTagSearchChange(query: string): void {
    if (this.tagSearchTimeout) {
      clearTimeout(this.tagSearchTimeout);
    }
    this.tagSearchTimeout = setTimeout(() => {
      this.tagSearchQuery = query;
      this.loadTags();
    }, 500);
  }

  openAddTagModal(content: any): void {
    this.tagForm.reset();
    this.tagSubmitted = false;
    this.modalService.open(content);
  }

  onSubmitTag(): void {
    this.tagSubmitted = true;
    if (this.tagForm.valid) {
      this.isLoading = true;
      this.superadminService.addTag(this.tagForm.value).subscribe({
        next: (response: any) => {
          if (response?.status) {
            this.toastr.success('Tag added successfully');
            this.modalService.dismissAll();
            this.loadTags();
          } else {
            this.error = response?.message || 'Failed to add tag';
          }
        },
        error: (error: any) => {
          this.error = error?.error?.message || 'Failed to add tag';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  deleteTag(tagId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this tag!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.superadminService.deleteTag(tagId).subscribe({
          next: (response: any) => {
            if (response?.status) {
              this.toastr.success('Tag deleted successfully');
              this.loadTags();
            } else {
              this.error = response?.message || 'Failed to delete tag';
            }
          },
          error: (error: any) => {
            this.error = error?.error?.message || 'Failed to delete tag';
          }
        });
      }
    });
  }

  openEditRoleModal(content: any, role: any): void {
    this.editRoleData = {
      name: role.name,
      otherRoles: [...(role.otherRoles || [])]  // Create a new array to avoid reference issues
    };
    this.selectedRoleId = role._id;
    this.modalService.open(content, { size: 'lg' });
  }

  onSubmitEditRole(): void {
    if (!this.editRoleData.name?.trim()) {
      this.toastr.error('Role name is required');
      return;
    }

    this.isLoading = true;
    const payload = {
      name: this.editRoleData.name.trim(),
      otherRoles: this.editRoleData.otherRoles || []
    };

    this.superadminService.updateRole(this.selectedRoleId, payload).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.toastr.success('Role updated successfully');
          this.loadRoles();
          this.closeModal();
        } else {
          this.toastr.error(response?.message || 'Failed to update role');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.toastr.error(error?.message || 'An error occurred while updating role');
        this.isLoading = false;
      }
    });
  }

  openEditTagModal(content: any, tag: any): void {
    this.editTagForm.patchValue({
      name: tag.name
    });
    this.selectedTagId = tag._id;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmitEditTag(): void {
    this.editTagSubmitted = true;

    if (this.editTagForm.invalid) {
      return;
    }

    this.isLoading = true;
    const payload = {
      name: this.editTagForm.value.name
    };

    this.superadminService.updateTag(this.selectedTagId, payload).subscribe({
      next: (response) => {
        this.toastr.success('Tag updated successfully');
        this.modalService.dismissAll();
        this.loadTags();
        this.isLoading = false;
        this.editTagSubmitted = false;
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'Failed to update tag');
        this.isLoading = false;
      }
    });
  }
}
