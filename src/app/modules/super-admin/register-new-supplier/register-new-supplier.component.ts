import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

interface Expertise {
  name: string;
  type?: string;
  itemId?: string | null;
  subExpertise: string[];
}

interface ExpertiseItem {
  itemId: string | null;
  name: string;
  type: string;
}

@Component({
  selector: 'app-register-new-supplier',
  templateUrl: './register-new-supplier.component.html',
  styleUrls: ['./register-new-supplier.component.css']
})
export class RegisterNewSupplierComponent implements OnInit {
  companyForm: any = {};
  showLoader: boolean = false;
  showSupplierTypeError: boolean = false;
  currentExpertise: string = '';
  currentSubExpertise: string = '';
  randomString: string = '';
  today: string = new Date().toISOString().split('T')[0];
  expertiseDropdownOptions: ExpertiseItem[] = [];
  inHoldComment: string = '';


  constructor(
    private superadminService: SuperadminService,
    private notificationService: NotificationService,
  ) {
    // Generate a random string to prevent form autofill
    this.randomString = Math.random().toString(36).substring(2, 15);
  }

  ngOnInit(): void {
    this.companyForm = {
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
      industryFocus: [],
      employeeCount: '',
      certifications: [],
      expertise: [],
      category: [],
      technologies: [],
      keyClients: [],
      resourceSharingSupplier: false,
      subcontractingSupplier: false
    };
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

  addExpertise() {
    if (this.currentExpertise) {
      this.companyForm.expertise.push({
        name: this.currentExpertise.trim(),
        subExpertise: []
      });
      this.currentExpertise = '';
    }
  }

  addSubExpertise(expertiseIndex: number) {
    if (this.currentSubExpertise) {
      this.companyForm.expertise[expertiseIndex].subExpertise.push(this.currentSubExpertise.trim());
      this.currentSubExpertise = '';
    }
  }

  removeExpertise(index: number) {
    this.companyForm.expertise.splice(index, 1);
  }

  removeSubExpertise(expertiseIndex: number, subExpertiseIndex: number) {
    this.companyForm.expertise[expertiseIndex].subExpertise.splice(subExpertiseIndex, 1);
  }

  addArrayItem(arrayName: string, value: string) {
    if (value.trim()) {
      if (!this.companyForm[arrayName]) {
        this.companyForm[arrayName] = [];
      }
      this.companyForm[arrayName].push(value.trim());
      value = '';
    }
  }

  removeArrayItem(arrayName: string, index: number) {
    this.companyForm[arrayName].splice(index, 1);
  }

  submitForm() {
    // Check required fields
    if (!this.companyForm.companyName || !this.companyForm.poc_name || !this.companyForm.poc_phone) {
      this.notificationService.showError('Please fill in all required fields: Company Name, POC Name, and POC Phone');
      return;
    }

    // Check at least one supplier type is selected
    if (!this.companyForm.resourceSharingSupplier && !this.companyForm.subcontractingSupplier) {
      this.showSupplierTypeError = true;
      this.notificationService.showError('Please select at least one supplier type');
      return;
    } else {
      this.showSupplierTypeError = false;
    }

    // Create a copy of the form data
    const formData = { ...this.companyForm };

    // Remove empty email field
    if (!formData.email) {
      delete formData.email;
    }

    // Remove empty POC email field
    if (!formData.poc_email) {
      delete formData.poc_email;
    }

    // Prepare year of establishment
    if (formData.yearOfEstablishment) {
      const date = new Date(formData.yearOfEstablishment);
      formData.yearOfEstablishment = date.toISOString().split('T')[0];
    }

    // If expertise is empty, initialize it
    if (!formData.expertise) {
      formData.expertise = [];
    }

    // Ensure all expertise items have the required structure
    // If the expertise items are already in the correct format, this step is not needed
    const formattedExpertise = formData.expertise.map((item: any) => {
      // If item is already in correct format
      if (item.name && (item.subExpertise || Array.isArray(item.subExpertise))) {
        return item;
      }

      // If item is the direct ExpertiseItem from the dropdown
      return {
        name: item.name,
        type: item.type || 'technologies',
        itemId: item.itemId,
        subExpertise: []
      };
    });

    // Update formData with the formatted expertise
    formData.expertise = formattedExpertise;

    // Add inHoldComment in the required format
    if (this.inHoldComment.trim()) {
      formData.inHoldComment = [
        {
          comment: this.inHoldComment.trim()
        }
      ];
    } else {
      formData.inHoldComment = [];
    }

    console.log('Submitting Data:', formData);
    this.superadminService.supplierregister(formData).subscribe((response) => {
      if (response?.status === true) {
        this.showLoader = false;
        this.notificationService.showSuccess('Supplier admin added successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message);
      this.showLoader = false;
    });
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  handleEnterKey(event: Event, arrayName: string) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
      this.addArrayItem(arrayName, input.value);
      input.value = '';
    }
  }

  checkSupplierTypeSelection() {
    // Hide error message if at least one supplier type is selected
    this.showSupplierTypeError = !this.companyForm.resourceSharingSupplier && !this.companyForm.subcontractingSupplier;
  }
}
