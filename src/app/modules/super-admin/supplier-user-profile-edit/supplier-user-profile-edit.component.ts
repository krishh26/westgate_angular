import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
interface ExpertiseItem {
  itemId: string | null;
  name: string;
  type: string;
}

@Component({
  selector: 'app-supplier-user-profile-edit',
  templateUrl: './supplier-user-profile-edit.component.html',
  styleUrls: ['./supplier-user-profile-edit.component.scss']
})
export class SupplierUserProfileEditComponent implements OnInit {
  supplierDetails: any = {
    companyName: '',
    // logo: '',
    website: '',
    companyAddress: '',
    country: '',
    email: '',
    companyContactNumber: '',
    yearOfEstablishment: '',
    poc_name: '',
    poc_phone: '',
    poc_email: '',
    poc_role: '',
    typeOfCompany: [],
    industry_Sector: [],
    employeeCount: '',
    certifications: [],
    expertise: [],
    categoryList: [],
    technologyStack: [],
    keyClients: []
  };

  showLoader: boolean = false;
  currentExpertise: string = '';
  currentSubExpertise: string = '';
  randomString: string = '';
  expertiseDropdownOptions: ExpertiseItem[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private supplierService: SupplierAdminService,
    private superadminService: SuperadminService
  ) {
    this.randomString = Math.random().toString(36).substring(2, 15);

    const navigation = this.router.getCurrentNavigation();
    const data = navigation?.extras.state;
    if (data) {
      // Initialize arrays if they don't exist in the incoming data
      const arrayFields = ['typeOfCompany', 'industry_Sector', 'certifications', 'expertise', 'categoryList', 'technologyStack', 'keyClients'];
      arrayFields.forEach(field => {
        if (!data[field]) {
          data[field] = [];
        }
      });

      this.supplierDetails = { ...this.supplierDetails, ...data };
    }
  }

  ngOnInit(): void {
    // Initialize if needed
    this.getExpertiseDropdownData();
  }

  getExpertiseDropdownData() {
    this.showLoader = true;
    this.superadminService.getExpertiseDropdown().subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseDropdownOptions = response.data || [];
          this.expertiseDropdownOptions = this.expertiseDropdownOptions.map(item => {
            // Get the type and remove "-other" suffix if it exists
            let type = item.type || 'technologies';
            if (type.endsWith('-other')) {
              type = type.replace('-other', '');
            }

            return {
              itemId: item.itemId || (item as any)._id,
              name: item.name,
              type: type
            };
          });
        } else {
          console.error('Failed to fetch expertise dropdown data:', response?.message);
          this.notificationService.showError('Failed to fetch expertise dropdown data');
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching expertise dropdown data:', error);
        this.notificationService.showError('Error fetching expertise dropdown data');
        this.showLoader = false;
      }
    );
  }


  removeArrayItem(arrayName: string, index: number) {
    if (this.supplierDetails[arrayName]) {
      this.supplierDetails[arrayName].splice(index, 1);
    }
  }

  handleEnterKey(event: Event, arrayName: string) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      if (!this.supplierDetails[arrayName]) {
        this.supplierDetails[arrayName] = [];
      }
      this.supplierDetails[arrayName].push(input.value.trim());
      input.value = '';
    }
  }

  addExpertise() {
    if (this.currentExpertise) {
      if (!this.supplierDetails.expertise) {
        this.supplierDetails.expertise = [];
      }
      this.supplierDetails.expertise.push({
        name: this.currentExpertise.trim(),
        subExpertise: []
      });
      this.currentExpertise = '';
    }
  }

  removeExpertise(index: number) {
    if (this.supplierDetails.expertise) {
      this.supplierDetails.expertise.splice(index, 1);
    }
  }

  addSubExpertise(expertiseIndex: number) {
    if (this.currentSubExpertise && this.supplierDetails.expertise[expertiseIndex]) {
      this.supplierDetails.expertise[expertiseIndex].subExpertise.push(this.currentSubExpertise.trim());
      this.currentSubExpertise = '';
    }
  }

  removeSubExpertise(expertiseIndex: number, subExpertiseIndex: number) {
    if (this.supplierDetails.expertise[expertiseIndex]?.subExpertise) {
      this.supplierDetails.expertise[expertiseIndex].subExpertise.splice(subExpertiseIndex, 1);
    }
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  submitForm() {
    if (!this.supplierDetails.companyName || !this.supplierDetails.email) {
      this.notificationService.showError('Company Name and Email are required.');
      return;
    }

    this.showLoader = true;
    this.supplierService.updateSuppilerDetails(this.supplierDetails, this.supplierDetails._id).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          this.notificationService.showSuccess('Supplier Details Updated successfully.');
          this.router.navigate(['/super-admin/supplier-user-profile']);
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }
}
