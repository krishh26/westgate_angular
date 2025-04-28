import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface ExpertiseItem {
  itemId: string | null;
  name: string;
  type: string;
}

@Component({
  selector: 'app-boss-user-supplier-user-profile-edit',
  templateUrl: './boss-user-supplier-user-profile-edit.component.html',
  styleUrls: ['./boss-user-supplier-user-profile-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BossUserSupplierUserProfileEditComponent implements OnInit {
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
  selectedExpertiseName: string = '';
  subExpertiseOptions: string[] = [];
  randomString: string = '';
  expertiseDropdownOptions: ExpertiseItem[] = [];
  today: string = new Date().toISOString().split('T')[0];

  // Industry, Category, and Technology lists
  industryList: any[] = [];
  selectedIndustries: string[] = [];
  categoryDomains: any[] = [];
  selectedCategories: string[] = [];
  technologiesList: any[] = [];
  selectedTechnologies: string[] = [];

  // Individual selection for the active sub-expertise dropdown
  activeSubExpertiseSelection: string[] = [];
  activeExpertiseIndex: number = -1;
  subExpertiseInput$ = new Subject<string>();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private supplierService: SupplierAdminService,
    private http: HttpClient
  ) {
    this.randomString = Math.random().toString(36).substring(2, 15);

    const navigation = this.router.getCurrentNavigation();
    const data = navigation?.extras.state;
    if (data) {
      // Map legacy field names if they exist
      this.mapLegacyFieldNames(data);

      // Initialize arrays if they don't exist in the incoming data
      const arrayFields = ['typeOfCompany', 'industry_Sector', 'certifications', 'expertise', 'categoryList', 'technologyStack', 'keyClients'];
      arrayFields.forEach(field => {
        if (!data[field]) {
          data[field] = [];
        }
      });

      this.supplierDetails = { ...this.supplierDetails, ...data };
    }

    // Setup typeahead for sub-expertise search
    this.subExpertiseInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.showLoader = true;
        return this.http.get<any>(`${environment.baseUrl}/web-user/sub-expertise/list?search=${term}`);
      })
    ).subscribe(response => {
      this.showLoader = false;
      if (response?.status) {
        this.subExpertiseOptions = response.data || [];
      }
    });
  }

  ngOnInit(): void {
    // Load expertise options
    this.loadExpertiseOptions();
    this.loadSubExpertiseOptions();

    // Load dropdown data
    this.getCategoryDomains();
    this.getTechnologiesList();
    this.getIndustryList();

    // Initialize selections from supplier details
    this.initializeSelectionsFromSupplierDetails();
  }

  // Initialize selections from supplier details
  initializeSelectionsFromSupplierDetails() {
    // Initialize industry selections
    if (this.supplierDetails.industry_Sector && this.supplierDetails.industry_Sector.length > 0) {
      this.selectedIndustries = [...this.supplierDetails.industry_Sector];
    }

    // Initialize category selections
    if (this.supplierDetails.categoryList && this.supplierDetails.categoryList.length > 0) {
      this.selectedCategories = [...this.supplierDetails.categoryList];
    }

    // Initialize technology selections
    if (this.supplierDetails.technologyStack && this.supplierDetails.technologyStack.length > 0) {
      this.selectedTechnologies = [...this.supplierDetails.technologyStack];
    }
  }

  // Method to load expertise options from the database
  loadExpertiseOptions() {
    this.showLoader = true;
    this.http.get<any>(`${environment.baseUrl}/roles/get-expertise`).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status || response?.data) {
          const data = response.data || response;
          if (Array.isArray(data)) {
            this.expertiseDropdownOptions = data.map((item: any) => {
              return {
                itemId: item.id || item._id || null,
                name: item.name || item.expertise || JSON.stringify(item),
                type: item.type || 'technologies'
              };
            });
          }
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error loading expertise options:', error);
        // Fallback options
        this.expertiseDropdownOptions = [
          { itemId: '1', name: 'Software Development', type: 'technologies' },
          { itemId: '2', name: 'UI/UX Design', type: 'technologies' },
          { itemId: '3', name: 'Cloud Services', type: 'technologies' },
          { itemId: '4', name: 'Data Analytics', type: 'technologies' },
          { itemId: '5', name: 'Cybersecurity', type: 'technologies' }
        ];
      }
    );
  }

  // Method to load sub-expertise options
  loadSubExpertiseOptions() {
    this.showLoader = true;
    this.http.get<any>(`${environment.baseUrl}/web-user/sub-expertise/list`).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          if (response.data && Array.isArray(response.data)) {
            this.subExpertiseOptions = response.data.map((item: any) =>
              item.name || item.subExpertise || item
            );
          }
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error loading sub-expertise options:', error);
        // Fallback options
        this.subExpertiseOptions = [
          'Web Development', 'Mobile Development', 'Desktop Applications',
          'Frontend Development', 'Backend Development', 'Full Stack Development',
          'UI Design', 'UX Research', 'Wireframing', 'Prototyping',
          'AWS', 'Azure', 'Google Cloud', 'DevOps',
          'Big Data', 'Machine Learning', 'Business Intelligence',
          'Network Security', 'Application Security', 'Security Auditing'
        ];
      }
    );
  }

  // Get category domains for dropdown
  getCategoryDomains() {
    this.showLoader = true;
    this.http.get<any>(`${environment.baseUrl}/roles/get-categories`).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status || response?.data) {
          const data = response.data || response;
          if (Array.isArray(data)) {
            this.categoryDomains = data.map((item: any) => {
              const value = item.name || item.value || item.category || JSON.stringify(item);
              return { name: value, value: value };
            });
          }
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error loading category domains:', error);
        // Fallback categories
        this.categoryDomains = [
          { name: 'IT Services', value: 'IT Services' },
          { name: 'Software Development', value: 'Software Development' },
          { name: 'Consulting', value: 'Consulting' },
          { name: 'Cloud Services', value: 'Cloud Services' }
        ];
      }
    );
  }

  // Get technologies list for dropdown
  getTechnologiesList() {
    this.showLoader = true;
    this.http.get<any>(`${environment.baseUrl}/roles/get-technologies`).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status || response?.data) {
          const data = response.data || response;
          if (Array.isArray(data)) {
            this.technologiesList = data.map((item: any) => {
              const value = item.name || item.value || item.technology || JSON.stringify(item);
              return { name: value, value: value };
            });
          }
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error loading technologies list:', error);
        // Fallback technologies
        this.technologiesList = [
          { name: 'Angular', value: 'Angular' },
          { name: 'React', value: 'React' },
          { name: 'Node.js', value: 'Node.js' },
          { name: 'Python', value: 'Python' },
          { name: 'Java', value: 'Java' }
        ];
      }
    );
  }

  // Get industry list for dropdown
  getIndustryList() {
    this.showLoader = true;
    this.http.get<any>(`${environment.baseUrl}/web-user/sub-expertise/list`).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          if (response.data && Array.isArray(response.data)) {
            this.industryList = response.data.map((item: any) => {
              const value = item.name || item.value || item.industry || JSON.stringify(item);
              return { name: value, value: value };
            });
          }
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error loading industry list:', error);
        // Fallback industries
        this.industryList = [
          { name: 'Healthcare', value: 'Healthcare' },
          { name: 'Finance', value: 'Finance' },
          { name: 'Education', value: 'Education' },
          { name: 'Retail', value: 'Retail' },
          { name: 'Manufacturing', value: 'Manufacturing' }
        ];
      }
    );
  }

  // Update method to handle changes in the industry selection
  onIndustryChange() {
    if (this.selectedIndustries && this.selectedIndustries.length > 0) {
      this.supplierDetails.industry_Sector = [...this.selectedIndustries];
    } else {
      this.supplierDetails.industry_Sector = [];
    }
  }

  // Update method to handle changes in the category selection
  onCategoryChange() {
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      this.supplierDetails.categoryList = [...this.selectedCategories];
    } else {
      this.supplierDetails.categoryList = [];
    }
  }

  // Update method to handle changes in the technology selection
  onTechnologiesChange() {
    if (this.selectedTechnologies && this.selectedTechnologies.length > 0) {
      this.supplierDetails.technologyStack = [...this.selectedTechnologies];
    } else {
      this.supplierDetails.technologyStack = [];
    }
  }

  // Add custom industry item
  onItemAddIndustry(event: any) {
    if (event) {
      // If it's a string from addTag
      if (typeof event === 'string') {
        // Check if this value already exists in the list
        const exists = this.industryList.some(item => item.value === event);
        if (!exists) {
          this.industryList.push({ name: event, value: event });
        }
      } else if (event && event.value) {
        // It's an object from the selection
        const exists = this.industryList.some(item => item.value === event.value);
        if (!exists) {
          this.industryList.push(event);
        }
      }
    }
  }

  // Add custom category item
  onItemAddCategory(event: any) {
    if (event) {
      if (typeof event === 'string') {
        const exists = this.categoryDomains.some(item => item.value === event);
        if (!exists) {
          this.categoryDomains.push({ name: event, value: event });
        }
      } else if (event && event.value) {
        const exists = this.categoryDomains.some(item => item.value === event.value);
        if (!exists) {
          this.categoryDomains.push(event);
        }
      }
    }
  }

  // Add custom technology item
  onItemAddTechnology(event: any) {
    if (event) {
      if (typeof event === 'string') {
        const exists = this.technologiesList.some(item => item.value === event);
        if (!exists) {
          this.technologiesList.push({ name: event, value: event });
        }
      } else if (event && event.value) {
        const exists = this.technologiesList.some(item => item.value === event.value);
        if (!exists) {
          this.technologiesList.push(event);
        }
      }
    }
  }

  // Method to set the active expertise being edited
  setActiveExpertise(index: number) {
    this.activeExpertiseIndex = index;
    this.activeSubExpertiseSelection = [];
  }

  // Method to handle supplier type selection validation
  checkSupplierTypeSelection() {
    this.showSupplierTypeError =
      !this.supplierDetails.resourceSharingSupplier &&
      !this.supplierDetails.subcontractingSupplier;
  }

  // Method to handle the Enter key press for array items
  handleEnterKey(event: Event, arrayName: string) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();

    if (value && this.supplierDetails[arrayName]) {
      if (!this.supplierDetails[arrayName].includes(value)) {
        this.supplierDetails[arrayName].push(value);
        target.value = '';
      }
    }
  }

  // Method to remove an item from an array
  removeArrayItem(arrayName: string, index: number) {
    if (this.supplierDetails[arrayName]) {
      this.supplierDetails[arrayName].splice(index, 1);
    }
  }

  // Method to restrict input to numbers only
  NumberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
    if (this.selectedExpertiseName) {
      // Find the selected expertise from the dropdown options
      const selectedExp = this.expertiseDropdownOptions.find(exp => exp.name === this.selectedExpertiseName);

      if (selectedExp) {
        // Check if this expertise already exists in the list
        const exists = this.supplierDetails.expertise.some((item: any) =>
          item.name === this.selectedExpertiseName
        );

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

          // Notify user of successful addition
          this.notificationService.showSuccess(`Added expertise: ${selectedExp.name}`);
        } else {
          this.notificationService.showInfo(`Expertise "${selectedExp.name}" already exists`);
        }
      } else {
        // Try adding by name directly as a fallback
        if (!this.supplierDetails.expertise) {
          this.supplierDetails.expertise = [];
        }

        this.supplierDetails.expertise.push({
          name: this.selectedExpertiseName,
          type: 'technologies',
          subExpertise: []
        });

        this.notificationService.showSuccess(`Added expertise: ${this.selectedExpertiseName}`);
      }

      // Clear the selection
      this.selectedExpertiseName = '';
    } else {
      this.notificationService.showWarning('Please select an expertise first');
    }
  }

  addSubExpertise(expertiseIndex: number) {
    if (this.currentSubExpertise && this.supplierDetails.expertise[expertiseIndex]) {
      this.supplierDetails.expertise[expertiseIndex].subExpertise.push(this.currentSubExpertise.trim());
      this.currentSubExpertise = '';
    }
  }

  // Add multiple sub-expertise method
  addMultipleSubExpertise(expertiseIndex: number) {
    if (this.activeSubExpertiseSelection && this.activeSubExpertiseSelection.length > 0) {
      // Get existing sub-expertise as a Set for faster lookup
      const existingSubExpertise = new Set(this.supplierDetails.expertise[expertiseIndex].subExpertise);

      // Add each selected sub-expertise that doesn't already exist
      for (const subExp of this.activeSubExpertiseSelection) {
        if (!existingSubExpertise.has(subExp)) {
          this.supplierDetails.expertise[expertiseIndex].subExpertise.push(subExp);
        }
      }

      // Clear the selection
      this.activeSubExpertiseSelection = [];
    }
  }

  removeExpertise(index: number) {
    if (this.supplierDetails.expertise) {
      this.supplierDetails.expertise.splice(index, 1);
    }
  }

  removeSubExpertise(expertiseIndex: number, subExpertiseIndex: number) {
    if (this.supplierDetails.expertise[expertiseIndex]?.subExpertise) {
      this.supplierDetails.expertise[expertiseIndex].subExpertise.splice(subExpertiseIndex, 1);
    }
  }

  hasInvalidExpertise(): boolean {
    if (!this.supplierDetails.expertise || this.supplierDetails.expertise.length === 0) {
      return false; // No expertise selected yet, so not invalid
    }

    return this.supplierDetails.expertise.some((exp: any) =>
      !exp.subExpertise || exp.subExpertise.length === 0
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

  submitForm() {
    // Update the supplier details with the selected dropdown values
    this.onIndustryChange();
    this.onCategoryChange();
    this.onTechnologiesChange();

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

    // Create a copy of the supplier details to send
    const supplierDataToSend = { ...this.supplierDetails };

    // Map any legacy field names that might be present
    this.mapLegacyFieldNames(supplierDataToSend);

    // Ensure arrays are initialized
    if (!supplierDataToSend.industry_Sector) supplierDataToSend.industry_Sector = [];
    if (!supplierDataToSend.categoryList) supplierDataToSend.categoryList = [];
    if (!supplierDataToSend.technologyStack) supplierDataToSend.technologyStack = [];
    if (!supplierDataToSend.expertise) supplierDataToSend.expertise = [];
    if (!supplierDataToSend.typeOfCompany) supplierDataToSend.typeOfCompany = [];
    if (!supplierDataToSend.certifications) supplierDataToSend.certifications = [];
    if (!supplierDataToSend.keyClients) supplierDataToSend.keyClients = [];

    // Convert year of establishment to proper format if it exists
    if (supplierDataToSend.yearOfEstablishment) {
      const date = new Date(supplierDataToSend.yearOfEstablishment);
      supplierDataToSend.yearOfEstablishment = date.toISOString().split('T')[0];
    }

    // Remove empty email fields to avoid issues with the API
    if (!supplierDataToSend.email) delete supplierDataToSend.email;
    if (!supplierDataToSend.poc_email) delete supplierDataToSend.poc_email;

    console.log('Submitting updated supplier details:', supplierDataToSend);

    this.showLoader = true;
    this.supplierService.updateSuppilerDetails(supplierDataToSend, supplierDataToSend._id).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          this.notificationService.showSuccess('Supplier Details Updated successfully.');
          this.router.navigate(['/boss-user/supplier-user-profile']);
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
