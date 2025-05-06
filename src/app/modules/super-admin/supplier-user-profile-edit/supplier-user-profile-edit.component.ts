import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

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
  today: string = new Date().toISOString().split('T')[0];

  // Industry, Category, and Technology lists
  industryList: any[] = [];
  selectedIndustries: string[] = [];
  categoryDomains: any[] = [];
  selectedCategories: string[] = [];
  technologiesList: any[] = [];
  selectedTechnologies: any[] = [];
  isLoadingTechnologies: boolean = false;
  technologiesInput$ = new Subject<string>();

  // Expertise selection properties
  selectedExpertiseItems: any[] = [];
  selectedSubExpertiseMap: { [key: number]: string[] } = {};
  activeSubExpertiseSelection: string[] = [];
  activeExpertiseIndex: number = -1;

  // Properties for expertise type selection
  newExpertiseType: string = 'technologies';

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private supplierService: SupplierAdminService,
    private superadminService: SuperadminService,
    private http: HttpClient
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

    // Setup typeahead for technologies search
    this.technologiesInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoadingTechnologies = true;
        return this.http.get<any>(`${environment.baseUrl}/tech-language/technologies?search=${term}`);
      })
    ).subscribe(
      response => {
        this.isLoadingTechnologies = false;
        if (response?.status) {
          this.technologiesList = response.data || [];
        }
      },
      error => {
        this.isLoadingTechnologies = false;
        console.error('Error fetching technologies:', error);
        this.notificationService.showError('Error fetching technologies');
      }
    );
  }

  ngOnInit(): void {
    // Initialize if needed
    this.getExpertiseDropdownData();
    this.getSubExpertiseDropdownData();

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
      this.selectedTechnologies = this.supplierDetails.technologyStack.map((tech: string) => ({
        name: tech
      }));
    }

    // Initialize selectedSubExpertiseMap
    if (this.supplierDetails.expertise && this.supplierDetails.expertise.length > 0) {
      this.supplierDetails.expertise.forEach((expertise: any, index: number) => {
        this.selectedSubExpertiseMap[index] = [];
      });
    }
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

  // Get category domains for dropdown
  getCategoryDomains() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/drop-down?type=domain`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response?.status) {
          // Check if the data is an array of objects or simple strings
          if (response.data && response.data.length > 0) {
            if (typeof response.data[0] === 'object') {
              // If data contains objects, transform to format compatible with ng-select
              this.categoryDomains = response.data.map((item: any) => {
                // For ng-select, we need objects with consistent properties
                // If item already has name/value, use it
                if (item.name && item.value) {
                  return item;
                }

                // Try different property names that might exist
                const value = item.name || item.value || item.domain || item.category || JSON.stringify(item);
                return {
                  name: value,
                  value: value
                };
              });
            } else {
              // If data is already an array of strings, convert to objects for ng-select
              this.categoryDomains = response.data.map((item: string) => {
                return {
                  name: item,
                  value: item
                };
              });
            }
          } else {
            this.categoryDomains = [];
          }
        } else {
          this.notificationService.showError('Failed to fetch category domains');
          this.categoryDomains = [];
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching category domains:', error);
        this.notificationService.showError('Error fetching category domains');
        this.showLoader = false;
        this.categoryDomains = [];
      }
    );
  }

  // Get technologies list for dropdown
  getTechnologiesList() {
    this.isLoadingTechnologies = true;
    this.http.get<any>(`${environment.baseUrl}/tech-language/technologies`).subscribe(
      response => {
        this.isLoadingTechnologies = false;
        if (response?.status) {
          this.technologiesList = response.data || [];

          // If we have existing technologies in the form, select them
          if (this.supplierDetails.technologyStack?.length) {
            this.selectedTechnologies = this.supplierDetails.technologyStack.map((tech: string) => ({
              name: tech
            }));
          }
        } else {
          console.error('Failed to fetch technologies:', response?.message);
          this.notificationService.showError('Failed to fetch technologies');
        }
      },
      error => {
        this.isLoadingTechnologies = false;
        console.error('Error fetching technologies:', error);
        this.notificationService.showError('Error fetching technologies');
      }
    );
  }

  // Method to set the active expertise being edited
  setActiveExpertise(index: number) {
    this.activeExpertiseIndex = index;
    this.activeSubExpertiseSelection = [];
  }

  // Method to handle changes in sub-expertise selection
  onSubExpertiseChange(expertiseIndex: number, selectedItems: any) {
    // Store the selection for the current expertise index
    this.selectedSubExpertiseMap[expertiseIndex] = selectedItems;
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
      this.supplierDetails.technologyStack = this.selectedTechnologies.map(tech =>
        typeof tech === 'string' ? tech : tech.name
      );
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

  // Add Promise-based method for adding industries
  addIndustry = (name: string) => {
    return new Promise<any>((resolve) => {
      // Check if industry already exists
      const exists = this.industryList.some(item => item.value === name);
      if (!exists) {
        const newIndustry = { name: name, value: name };
        this.industryList.push(newIndustry);
        resolve(newIndustry);
      } else {
        // Return existing industry
        const existingIndustry = this.industryList.find(item => item.value === name);
        resolve(existingIndustry);
      }
    });
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

  // Add Promise-based method for adding categories
  addCategory = (name: string) => {
    return new Promise<any>((resolve) => {
      // Check if category already exists
      const exists = this.categoryDomains.some(item => item.value === name);
      if (!exists) {
        const newCategory = { name: name, value: name };
        this.categoryDomains.push(newCategory);
        resolve(newCategory);
      } else {
        // Return existing category
        const existingCategory = this.categoryDomains.find(item => item.value === name);
        resolve(existingCategory);
      }
    });
  }

  // Add custom technology item
  onItemAddTechnology(event: any) {
    if (event) {
      console.log('Adding custom technology:', event);
      // If it's a string from addTag
      if (typeof event === 'string') {
        // Call API to create new technology
        this.showLoader = true;
        const url = `${environment.baseUrl}/tech-language/technologies`;
        const payload = { name: event };

        this.http.post(url, payload).subscribe({
          next: (response: any) => {
            if (response?.status) {
              // Add to local list if API call successful
              this.technologiesList.push({ name: event, value: event });

              // Add to selected technologies if not already there
              if (!this.selectedTechnologies.find(t => t.name === event)) {
                this.selectedTechnologies = [...this.selectedTechnologies, { name: event, value: event }];
                this.onTechnologiesChange();
              }

              this.notificationService.showSuccess('Technology added successfully');
            } else {
              this.notificationService.showError(response?.message || 'Failed to add technology');
            }
            this.showLoader = false;
          },
          error: (error: any) => {
            this.notificationService.showError(error?.message || 'Failed to add technology');
            this.showLoader = false;
          }
        });
      } else if (event && event.value) {
        // It's an object from the selection
        const exists = this.technologiesList.some(item => item.value === event.value);
        if (!exists) {
          this.technologiesList.push(event);
        }
      }
    }
  }

  // Add this method to handle adding new technologies with Promise
  addTechnology = (name: string) => {
    return new Promise<any>((resolve) => {
      this.showLoader = true;
      const url = `${environment.baseUrl}/tech-language/technologies`;
      const payload = { name: name };

      this.http.post(url, payload).subscribe({
        next: (response: any) => {
          if (response?.status) {
            const newTech = { name: name, value: name };
            this.technologiesList = [...this.technologiesList, newTech];
            this.notificationService.showSuccess('Technology added successfully');
            resolve(newTech);
          } else {
            this.notificationService.showError(response?.message || 'Failed to add technology');
            resolve(null);
          }
          this.showLoader = false;
        },
        error: (error: any) => {
          this.notificationService.showError(error?.message || 'Failed to add technology');
          this.showLoader = false;
          resolve(null);
        }
      });
    });
  }

  // Method to handle adding custom expertise items
  onItemAddExpertise(event: any) {
    if (event && typeof event === 'string') {
      // Check if this expertise already exists in the dropdown options
      const exists = this.expertiseDropdownOptions.some(item => item.name === event);
      if (!exists) {
        // Add the new expertise to the dropdown options
        this.expertiseDropdownOptions.push({
          itemId: null,
          name: event,
          type: 'technologies'
        });
      }
    }
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

    this.superadminService.getSubExpertiseDropdownList(searchText).subscribe(
      (response) => {
        if (response?.status) {
          // Handle the array of strings directly
          this.subExpertiseOptions = response.data || [];

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

  // Method to add expertise from multi-select dropdown
  addSelectedExpertise() {
    if (this.selectedExpertiseItems && this.selectedExpertiseItems.length > 0) {
      // Initialize expertise array if it doesn't exist
      if (!this.supplierDetails.expertise) {
        this.supplierDetails.expertise = [];
      }

      // Add each selected expertise item
      for (const item of this.selectedExpertiseItems) {
        // Check if this expertise already exists
        const exists = this.supplierDetails.expertise.some((exp: any) =>
          exp.name === (typeof item === 'string' ? item : item.name)
        );

        if (!exists) {
          // Add the expertise item
          if (typeof item === 'string') {
            // Handle string items (from addTag)
            this.supplierDetails.expertise.push({
              name: item,
              type: 'technologies',
              subExpertise: []
            });
          } else {
            // Handle object items (from dropdown)
            this.supplierDetails.expertise.push({
              name: item.name,
              type: item.type || 'technologies',
              itemId: item.itemId,
              subExpertise: []
            });
          }
        }
      }

      // Clear the selection
      this.selectedExpertiseItems = [];
      this.notificationService.showSuccess('Expertise added successfully');
    } else {
      this.notificationService.showWarning('Please select at least one expertise');
    }
  }

  // Implementation of onAddTag for adding expertise with type selection
  onAddTag = (name: string) => {
    if (!this.newExpertiseType) {
      this.notificationService.showError('Please select expertise type');
      return null;
    }

    const expertiseType = this.newExpertiseType;

    const newExpertise: ExpertiseItem = {
      name: name,
      type: expertiseType,
      itemId: null
    };

    // Make API call to create custom expertise
    this.showLoader = true;
    this.superadminService.createCustomExpertise({
      name: name,
      type: expertiseType
    }).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (response?.status) {
          // Update the itemId with the returned ID
          newExpertise.itemId = response.data._id || response.data.itemId;
          this.notificationService.showSuccess('New expertise added successfully');
        } else {
          this.notificationService.showError(response?.message || 'Failed to create expertise');
        }
      },
      (error: any) => {
        this.showLoader = false;
        this.notificationService.showError(error?.message || 'Failed to create expertise');
      }
    );

    // Add to dropdown options if it doesn't exist
    if (!this.expertiseDropdownOptions.some(e => e.name === newExpertise.name)) {
      this.expertiseDropdownOptions.push(newExpertise);
    }

    // Return the new expertise object so it can be added to the list while API call is in progress
    return newExpertise;
  }

  // Update the addExpertiseFromSelection method to handle the new selectedExpertiseName format
  addExpertiseFromSelection() {
    if (this.selectedExpertiseName) {
      // If selectedExpertiseName is an object (from ng-select), extract the name
      const expertiseName = typeof this.selectedExpertiseName === 'object'
        ? (this.selectedExpertiseName as any).name
        : this.selectedExpertiseName;

      // Find the selected expertise from the dropdown options
      const selectedExp = this.expertiseDropdownOptions.find(exp =>
        exp.name === expertiseName
      );

      if (selectedExp) {
        // Check if this expertise already exists in the list
        const exists = this.supplierDetails.expertise.some((item: any) =>
          item.name === selectedExp.name
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

  // Add multiple sub-expertise method
  addMultipleSubExpertise(expertiseIndex: number) {
    if (this.selectedSubExpertiseMap[expertiseIndex] && this.selectedSubExpertiseMap[expertiseIndex].length > 0) {
      // Get existing sub-expertise as a Set for faster lookup
      const existingSubExpertise = new Set(this.supplierDetails.expertise[expertiseIndex].subExpertise);

      // Add each selected sub-expertise that doesn't already exist
      for (const subExp of this.selectedSubExpertiseMap[expertiseIndex]) {
        if (!existingSubExpertise.has(subExp)) {
          this.supplierDetails.expertise[expertiseIndex].subExpertise.push(subExp);
        }
      }

      // Clear the selection
      this.selectedSubExpertiseMap[expertiseIndex] = [];
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

    // Remove activeStatus parameter
    if (supplierDataToSend.hasOwnProperty('activeStatus')) {
      delete supplierDataToSend.activeStatus;
    }

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
