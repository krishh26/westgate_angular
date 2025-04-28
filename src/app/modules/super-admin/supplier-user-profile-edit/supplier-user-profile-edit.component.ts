import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
    executiveSummary: '',
    poc_name: '',
    poc_phone: '',
    poc_email: '',
    poc_role: '',
    typeOfCompany: [],
    industry_Sector: [],
    employeeCount: '',
    turnover: '',
    totalProjectsExecuted: '',
    certifications: [],
    expertise: [],
    categoryList: [],
    technologyStack: [],
    keyClients: [],
    resourceSharingSupplier: false,
    subcontractingSupplier: false
  };

  showLoader: boolean = false;
  showSupplierTypeError: boolean = false;
  currentExpertise: string = '';
  currentSubExpertise: string = '';
  selectedExpertise: ExpertiseItem | null = null;
  selectedExpertiseName: string = '';
  subExpertiseOptions: string[] = [];
  subExpertiseInput$ = new Subject<string>();
  randomString: string = '';
  expertiseDropdownOptions: ExpertiseItem[] = [];
  inHoldComment: string = '';

  // Individual selection for the active sub-expertise dropdown
  activeSubExpertiseSelection: string[] = [];
  activeExpertiseIndex: number = -1;

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
      // Map old field names to new ones if they exist
      this.mapLegacyFieldNames(data);

      // Initialize arrays if they don't exist in the incoming data
      const arrayFields = ['typeOfCompany', 'industry_Sector', 'certifications', 'expertise', 'categoryList', 'technologyStack', 'keyClients'];
      arrayFields.forEach(field => {
        if (!data[field]) {
          data[field] = [];
        }
      });

      this.supplierDetails = { ...this.supplierDetails, ...data };

      // Extract inHoldComment if it exists
      if (this.supplierDetails.inHoldComment && this.supplierDetails.inHoldComment.length > 0) {
        this.inHoldComment = this.supplierDetails.inHoldComment[0]?.comment || '';
      }
    }

    // Setup typeahead for sub-expertise search
    this.subExpertiseInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.showLoader = true;
        return this.superadminService.getSubExpertiseDropdownList(term);
      })
    ).subscribe(response => {
      this.showLoader = false;
      if (response?.status) {
        this.subExpertiseOptions = response.data || [];
      }
    });
  }

  ngOnInit(): void {
    // Initialize if needed
    this.getExpertiseDropdownData();
    this.getSubExpertiseDropdownData();
  }

  // Method to set the active expertise being edited
  setActiveExpertise(index: number) {
    this.activeExpertiseIndex = index;
    this.activeSubExpertiseSelection = [];
    console.log('Set active expertise to index:', index);
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

  getSubExpertiseDropdownData(searchText: string = '') {
    this.showLoader = true;
    console.log('Fetching sub-expertise data...');

    this.superadminService.getSubExpertiseDropdownList(searchText).subscribe(
      (response) => {
        console.log('Sub-expertise API response:', response);

        if (response?.status) {
          // Handle the array of strings directly
          this.subExpertiseOptions = response.data || [];
          console.log('Loaded sub-expertise options:', this.subExpertiseOptions);

          // Add dummy data if API returns empty
          if (this.subExpertiseOptions.length === 0) {
            this.addFallbackSubExpertiseOptions();
          }
        } else {
          console.error('Failed to fetch sub-expertise dropdown data:', response?.message);
          this.notificationService.showError('Failed to fetch sub-expertise dropdown data');
          this.addFallbackSubExpertiseOptions();
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching sub-expertise dropdown data:', error);
        this.notificationService.showError('Error fetching sub-expertise dropdown data');
        this.addFallbackSubExpertiseOptions();
        this.showLoader = false;
      }
    );
  }

  addFallbackSubExpertiseOptions() {
    // This is just for testing if the dropdown works with data
    this.subExpertiseOptions = [
      'Banking',
      'Information Technology (IT)',
      'Education',
      'Healthcare',
      'Insurance'
    ];
    console.log('Added fallback sub-expertise options:', this.subExpertiseOptions);
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

  addExpertiseFromSelection() {
    console.log('Method called with selectedExpertiseName:', this.selectedExpertiseName);
    console.log('Available expertiseDropdownOptions:', this.expertiseDropdownOptions);

    if (this.selectedExpertiseName) {
      // Find the selected expertise from the dropdown options
      const selectedExp = this.expertiseDropdownOptions.find(exp => exp.name === this.selectedExpertiseName);

      console.log('Found expertise object:', selectedExp);

      if (selectedExp) {
        // Check if this expertise already exists in the list
        const exists = this.supplierDetails.expertise.some((item: any) =>
          item.name === this.selectedExpertiseName
        );

        console.log('Expertise already exists:', exists);

        if (!exists) {
          // Initialize expertise array if it doesn't exist
          if (!this.supplierDetails.expertise) {
            this.supplierDetails.expertise = [];
          }

          // Add the new expertise
          this.supplierDetails.expertise.push({
            name: selectedExp.name,
            type: selectedExp.type || 'technologies',
            itemId: selectedExp.itemId,
            subExpertise: []
          });

          console.log('Added expertise:', selectedExp.name);
          console.log('Updated expertise list:', this.supplierDetails.expertise);

          // Notify user of successful addition
          this.notificationService.showSuccess(`Added expertise: ${selectedExp.name}`);
        } else {
          console.log('Expertise already exists:', selectedExp.name);
          this.notificationService.showInfo(`Expertise "${selectedExp.name}" already exists`);
        }
      } else {
        console.log('Selected expertise not found in dropdown options');

        // Try adding by name directly as a fallback
        if (!this.supplierDetails.expertise) {
          this.supplierDetails.expertise = [];
        }

        this.supplierDetails.expertise.push({
          name: this.selectedExpertiseName,
          type: 'technologies',
          subExpertise: []
        });

        console.log('Added expertise by name directly:', this.selectedExpertiseName);
        this.notificationService.showSuccess(`Added expertise: ${this.selectedExpertiseName}`);
      }

      // Clear the selection
      this.selectedExpertiseName = '';
    } else {
      console.log('No expertise selected');
      this.notificationService.showWarning('Please select an expertise first');
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

  // Add multiple sub-expertise method updated to use the active selection
  addMultipleSubExpertise(expertiseIndex: number) {
    console.log('Adding multiple sub-expertise:', this.activeSubExpertiseSelection, 'to expertise index:', expertiseIndex);

    if (this.activeSubExpertiseSelection && this.activeSubExpertiseSelection.length > 0) {
      // Get existing sub-expertise as a Set for faster lookup
      const existingSubExpertise = new Set(this.supplierDetails.expertise[expertiseIndex].subExpertise);

      // Add each selected sub-expertise that doesn't already exist
      for (const subExp of this.activeSubExpertiseSelection) {
        if (!existingSubExpertise.has(subExp)) {
          this.supplierDetails.expertise[expertiseIndex].subExpertise.push(subExp);
        }
      }

      console.log('Updated sub-expertise list:', this.supplierDetails.expertise[expertiseIndex].subExpertise);

      // Clear the selection
      this.activeSubExpertiseSelection = [];
    } else {
      console.log('No sub-expertise selected');
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

  checkSupplierTypeSelection() {
    // Hide error message if at least one supplier type is selected
    this.showSupplierTypeError = !this.supplierDetails.resourceSharingSupplier && !this.supplierDetails.subcontractingSupplier;
  }

  hasInvalidExpertise(): boolean {
    if (!this.supplierDetails.expertise || this.supplierDetails.expertise.length === 0) {
      return false; // No expertise selected yet, so not invalid
    }

    return this.supplierDetails.expertise.some((exp: any) =>
      !exp.subExpertise || exp.subExpertise.length === 0
    );
  }

  submitForm() {
    if (!this.supplierDetails.companyName || !this.supplierDetails.poc_name || !this.supplierDetails.poc_phone) {
      this.notificationService.showError('Please fill in all required fields: Company Name, POC Name, and POC Phone');
      return;
    }

    // Check at least one supplier type is selected
    if (!this.supplierDetails.resourceSharingSupplier && !this.supplierDetails.subcontractingSupplier) {
      this.showSupplierTypeError = true;
      this.notificationService.showError('Please select at least one supplier type');
      return;
    } else {
      this.showSupplierTypeError = false;
    }

    // Check if all expertise items have at least one sub-expertise
    if (this.supplierDetails.expertise.length > 0) {
      const missingSubExpertise = this.supplierDetails.expertise.some((expertise: any) =>
        !expertise.subExpertise || expertise.subExpertise.length === 0
      );

      if (missingSubExpertise) {
        this.notificationService.showError('Each expertise must have at least one sub-expertise');
        return;
      }
    }

    // Create a new object with the proper structure
    const supplierDataToSend = { ...this.supplierDetails };

    // Ensure we have arrays initialized for all required fields
    if (!supplierDataToSend.industry_Sector) supplierDataToSend.industry_Sector = [];
    if (!supplierDataToSend.categoryList) supplierDataToSend.categoryList = [];
    if (!supplierDataToSend.technologyStack) supplierDataToSend.technologyStack = [];
    if (!supplierDataToSend.expertise) supplierDataToSend.expertise = [];
    if (!supplierDataToSend.typeOfCompany) supplierDataToSend.typeOfCompany = [];
    if (!supplierDataToSend.certifications) supplierDataToSend.certifications = [];
    if (!supplierDataToSend.keyClients) supplierDataToSend.keyClients = [];

    // Format inHoldComment according to API requirements
    if (this.inHoldComment && this.inHoldComment.trim()) {
      supplierDataToSend.inHoldComment = [
        {
          comment: this.inHoldComment.trim()
        }
      ];
    } else {
      supplierDataToSend.inHoldComment = [];
    }

    // Convert year of establishment to proper format if it exists
    if (supplierDataToSend.yearOfEstablishment) {
      const date = new Date(supplierDataToSend.yearOfEstablishment);
      supplierDataToSend.yearOfEstablishment = date.toISOString().split('T')[0];
    }

    // Remove empty fields to avoid issues with the API
    if (!supplierDataToSend.email) delete supplierDataToSend.email;
    if (!supplierDataToSend.poc_email) delete supplierDataToSend.poc_email;

    console.log('Submitting updated supplier details:', supplierDataToSend);

    this.showLoader = true;
    this.supplierService.updateSuppilerDetails(supplierDataToSend, supplierDataToSend._id).subscribe(
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

  // Method to map legacy field names to new format
  mapLegacyFieldNames(data: any) {
    // Map industryFocus to industry_Sector if needed
    if (data.industryFocus && !data.industry_Sector) {
      data.industry_Sector = data.industryFocus;
      delete data.industryFocus;
    }

    // Map category to categoryList if needed
    if (data.category && !data.categoryList) {
      data.categoryList = data.category;
      delete data.category;
    }

    // Map technologies to technologyStack if needed
    if (data.technologies && !data.technologyStack) {
      data.technologyStack = data.technologies;
      delete data.technologies;
    }

    return data;
  }
}
