import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';

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
  error: string = '';
  technologyForm: FormGroup;
  expertiseForm: FormGroup;
  submitted = false;
  showLoader = false;

  constructor(
    private superadminService: SuperadminService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notificationService: NotificationService
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
    this.superadminService.getExpertiseDropdownList(this.selectedExpertiseType).subscribe({
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
        return 'expertise Sector Settings';
      case 'category':
        return 'Category Settings';
      default:
        return 'Admin Data Settings';
    }
  }
}
