import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { NgxSpinnerService } from 'ngx-spinner';

declare var bootstrap: any;

interface Expertise {
  name: string;
  type?: string;
  itemId?: string | null;
  subExpertise: string[];
}

interface ExpertiseItem {
  name: string;
  type?: string;
  itemId?: any;
  value: string;
  subExpertise?: string[];
  originalType?: string;
}

interface SubExpertise {
  _id: string;
  name: string;
}

interface ServiceItem {
  name: string;
  value: string;
}

@Component({
  selector: 'app-add-new-supplier',
  templateUrl: './add-new-supplier.component.html',
  styleUrls: ['./add-new-supplier.component.scss']
})
export class BossUserAddNewSupplierComponent implements OnInit, AfterViewInit {
  companyForm: any = {
    companyName: '',
    website: '',
    companyAddress: '',
    country: '',
    email: '',
    companyContactNumber: '',
    yearOfEstablishment: '',
    executiveSummary: '',
    pocDetails: [
      {
        name: '',
        phone: '',
        email: '',
        role: ''
      }
    ],
    typeOfCompany: [],
    employeeCount: '',
    turnover: '',
    totalProjectsExecuted: '',
    certifications: [],
    expertise: [],
    expertiseICanDo: [],
    categoryList: [],
    technologyStack: [],
    keyClients: [],
    resourceSharingSupplier: false,
    subcontractingSupplier: false,
    inHoldComment: [],
    isSendMail: false
  };
  showLoader: boolean = false;
  showSupplierTypeError: boolean = false;
  currentExpertise: string = '';
  currentSubExpertise: string = '';
  selectedExpertise: ExpertiseItem | null = null;
  selectedSubExpertise: string[] = [];
  selectedSubExpertiseMap: { [key: number]: string[] } = {};
  selectedExpertiseName: string = '';
  currentExpertiseIndex: number = -1;
  subExpertiseOptions: string[] = [];
  subExpertiseInput$ = new Subject<string>();
  randomString: string = '';
  today: string = new Date().toISOString().split('T')[0];
  expertiseDropdownOptions: ExpertiseItem[] = [];
  selectedExpertiseItems: ExpertiseItem[] = [];
  inHoldComment: string = '';
  categoryDomains: any[] = [];
  selectedCategories: string[] = [];
  technologiesList: any[] = [];
  selectedTechnologies: string[] = [];

  // Business Types properties
  businessTypesList: any[] = [];
  selectedBusinessTypes: string[] = [];

  // Properties for I Can Do field
  selectedExpertiseICanDoItems: ExpertiseItem[] = [];
  selectedSubExpertiseICanDoMap: { [key: number]: string[] } = {};
  newExpertiseICanDoType: string = 'technologies';

  // Properties for expertise modal
  showExpertiseModal: boolean = false;
  newExpertiseName: string = '';
  newExpertiseType: string = 'technologies'; // Changed to lowercase to match the expertise-list component
  addExpertiseTag = false; // Disabling automatic tag addition

  // Separate properties for I Can Do
  expertiseICanDoDropdownOptions: ExpertiseItem[] = [];
  selectedExpertiseICanDo: ExpertiseItem | null = null;
  selectedSubExpertiseICanDo: string[] = [];
  selectedExpertiseICanDoName: string = '';
  currentExpertiseICanDoIndex: number = -1;
  subExpertiseICanDoOptions: string[] = [];
  subExpertiseICanDoInput$ = new Subject<string>();

  // Add this property
  addingNewSubExpertise: boolean = false;

  servicesList: ServiceItem[] = [];
  selectedServices: ServiceItem[] = [];
  tagSearchQuery: string = '';
  tagSearchTimeout: any;
  tagSearchInput$ = new Subject<string>();

  constructor(
    private superadminService: SuperadminService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    // Generate a random string to prevent form autofill
    this.randomString = Math.random().toString(36).substring(2, 15);

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

    // Setup typeahead for I Can Do sub-expertise search
    this.subExpertiseICanDoInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        this.showLoader = true;
        return this.superadminService.getSubExpertiseDropdownList(term);
      })
    ).subscribe(response => {
      this.showLoader = false;
      if (response?.status) {
        this.subExpertiseICanDoOptions = response.data || [];
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getExpertiseDropdownData();
    this.getExpertiseICanDoDropdownData();
    this.getSubExpertiseDropdownData();
    this.getSubExpertiseICanDoDropdownData();
    this.getCategoryDomains();
    this.getTechnologiesList();
    this.initializeServicesList();

    // Add fallback options for both expertise and I Can Do
    if (this.subExpertiseOptions.length === 0) {
      this.addFallbackSubExpertiseOptions();
    }
    if (this.subExpertiseICanDoOptions.length === 0) {
      this.addFallbackSubExpertiseICanDoOptions();
    }

    // Initialize expertiseDropdownOptions with value property
    this.expertiseDropdownOptions = this.expertiseDropdownOptions.map(item => ({
      ...item,
      value: item.name
    }));
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap tooltips
    setTimeout(() => {
      this.initializeTooltips();
    }, 100);
  }

  initializeTooltips(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]') as NodeListOf<HTMLElement>;
    Array.from(tooltipTriggerList).forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  populateSampleData() {
    // This method can be used to populate the form with test data
    // Uncomment if needed for testing
    /*
    this.companyForm = {
      companyName: "testing data",
      website: "",
      companyAddress: "",
      country: "",
      companyContactNumber: "",
      yearOfEstablishment: "",
      executiveSummary: "Brief overview of the company and its key services.",
      poc_name: "fg",
      poc_phone: "3453453453",
      poc_role: "",
      typeOfCompany: [
        "Healthcare",
        "Insurance"
      ],
      industry_Sector: [
        "Healthcare",
        "Insurance"
      ],
      employeeCount: "",
      turnover: "2",
      totalProjectsExecuted: "1",
      certifications: [],
      expertise: [
        {
          name: "Google Cloud Platform (GCP)",
          type: "technologies",
          itemId: "67fca5c289b158a4378bd26a",
          subExpertise: [
            "Banking",
            "Information Technology (IT)"
          ]
        }
      ],
      categoryList: [
        "DevOps",
        "E-commerce Development"
      ],
      technologyStack: [
        "Java",
        "C"
      ],
      keyClients: [],
      resourceSharingSupplier: true,
      subcontractingSupplier: false,
      inHoldComment: []
    };

    // Update the selection models to match the form data
    this.selectedIndustries = [...this.companyForm.industry_Sector];
    this.selectedCategories = [...this.companyForm.categoryList];
    this.selectedTechnologies = [...this.companyForm.technologyStack];
    */
  }

  initializeForm() {
    this.companyForm = {
      companyName: '',
      website: '',
      companyAddress: '',
      country: '',
      email: '',
      companyContactNumber: '',
      yearOfEstablishment: '',
      executiveSummary: '',
      pocDetails: [
        {
          name: '',
          phone: '',
          email: '',
          role: ''
        }
      ],
      typeOfCompany: [],
      employeeCount: '',
      turnover: '',
      totalProjectsExecuted: '',
      certifications: [],
      expertise: [],
      expertiseICanDo: [],
      categoryList: [],
      technologyStack: [],
      keyClients: [],
      resourceSharingSupplier: false,
      subcontractingSupplier: false,
      inHoldComment: [],
      isSendMail: false
    };
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

  getExpertiseDropdownData() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/drop-down-list?mandatory=true`;
    console.log('Fetching expertise data from URL:', url);

    this.http.get<any>(url).subscribe(
      (response) => {
        console.log('Raw expertise API response:', response);
        if (response?.status && response?.data) {
          const data = response.data || [];

          // Define the 6 specific types we want to display
          const typeGroups: { [key: string]: ExpertiseItem[] } = {
            'product': [],
            'domain': [],
            'technologies': [],
            'product-other': [],
            'domain-other': [],
            'technologies-other': []
          };

          // Process grouped data from the API
          data.forEach((group: any) => {
            if (!group || Object.keys(group).length === 0) {
              return; // Skip empty groups
            }

            // Each group is an object with a single key (the type) and array value
            const groupType = Object.keys(group)[0];
            const items = group[groupType] || [];

            // Check if this is one of our tracked types
            if (groupType in typeGroups) {
              // Process items in this group
              items.forEach((item: any) => {
                typeGroups[groupType].push({
                  itemId: item._id,
                  name: item.name,
                  type: groupType,
                  originalType: groupType,
                  value: item.name
                });
              });
            }
          });

          // Combine all items into a single array in the desired order
          let allItems: ExpertiseItem[] = [];
          // First add the 3 main types
          allItems = allItems.concat(
            typeGroups['product'],
            typeGroups['domain'],
            typeGroups['technologies']
          );

          // Then add the 3 "other" types
          allItems = allItems.concat(
            typeGroups['product-other'],
            typeGroups['domain-other'],
            typeGroups['technologies-other']
          );

          this.expertiseDropdownOptions = allItems;
          console.log('Processed expertise list for ng-select:', this.expertiseDropdownOptions);
        } else {
          console.error('Failed to fetch expertise data:', response?.message);
          this.notificationService.showError('Failed to fetch expertise data');
          this.expertiseDropdownOptions = [];
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching expertise data:', error);
        this.notificationService.showError('Error fetching expertise data');
        this.showLoader = false;
        this.expertiseDropdownOptions = [];
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
        } else {
          console.error('Failed to fetch sub-expertise dropdown data:', response?.message);
          this.notificationService.showError('Failed to fetch sub-expertise dropdown data');
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching sub-expertise dropdown data:', error);
        this.notificationService.showError('Error fetching sub-expertise dropdown data');
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
    // Validate POC details
    const isValidPOCs = this.companyForm.pocDetails.every((poc: any) =>
      poc.name && poc.phone && poc.email
    );

    if (!this.companyForm.companyName) {
      this.notificationService.showError('Please enter Company Name');
      return;
    }

    if (!this.companyForm.email) {
      this.notificationService.showError('Please enter Contact Email');
      return;
    }

    if (!isValidPOCs) {
      this.notificationService.showError('Please fill in all required POC fields (Name, Phone, and Email)');
      return;
    }

    if (!this.companyForm.resourceSharingSupplier && !this.companyForm.subcontractingSupplier) {
      this.showSupplierTypeError = true;
      this.notificationService.showError('Please select at least one supplier type');
      return;
    }

    this.showSupplierTypeError = false;

    // Create a copy of the form data
    const formData = { ...this.companyForm };

    // Remove empty email field
    if (!formData.email) {
      delete formData.email;
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

    // If expertiseICanDo is empty, initialize it
    if (!formData.expertiseICanDo) {
      formData.expertiseICanDo = [];
    }

    // Add inHoldComment in the required format
    if (this.inHoldComment?.trim()) {
      formData.inHoldComment = [
        {
          comment: this.inHoldComment.trim()
        }
      ];
    }

    this.spinner.show();
    this.superadminService.supplierregister(formData).subscribe({
      next: (response: any) => {
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
        this.spinner.hide();
      },
      error: (error: any) => {
        this.notificationService.showError(error?.error?.message);
        this.showLoader = false;
        this.spinner.hide();
      }
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

  hasInvalidExpertise(): boolean {
    return this.companyForm.expertise.some((expertise: ExpertiseItem) =>
      !expertise.subExpertise || expertise.subExpertise.length === 0
    ) || this.companyForm.expertiseICanDo.some((expertise: ExpertiseItem) =>
      !expertise.subExpertise || expertise.subExpertise.length === 0
    );
  }

  toggleSelectAllExpertise(event: any) {
    if (event.target.checked) {
      this.selectedExpertiseItems = [...this.expertiseDropdownOptions];
    } else {
      this.selectedExpertiseItems = [];
    }
  }

  toggleSelectAllExpertiseICanDo(event: any) {
    if (event.target.checked) {
      this.selectedExpertiseICanDoItems = [...this.expertiseDropdownOptions];
    } else {
      this.selectedExpertiseICanDoItems = [];
    }
  }

  addMultipleSubExpertise(expertiseIndex: number) {
    console.log('Adding multiple sub-expertise for index:', expertiseIndex);

    // Get the selected sub-expertise for this expertise index
    const selectedItems = this.selectedSubExpertiseMap[expertiseIndex] || [];
    console.log('Selected sub-expertise:', selectedItems);

    if (selectedItems && selectedItems.length > 0) {
      // Get existing sub-expertise as a Set for faster lookup
      const existingSubExpertise = new Set(this.companyForm.expertise[expertiseIndex].subExpertise);

      // Add each selected sub-expertise that doesn't already exist
      for (const subExp of selectedItems) {
        if (!existingSubExpertise.has(subExp)) {
          this.companyForm.expertise[expertiseIndex].subExpertise.push(subExp);
        }
      }

      console.log('Updated sub-expertise list:', this.companyForm.expertise[expertiseIndex].subExpertise);

      // Clear the selection
      this.selectedSubExpertiseMap[expertiseIndex] = [];
    } else {
      console.log('No sub-expertise selected');
    }
  }

  // Method to toggle select all for sub-expertise
  toggleSelectAllSubExpertise(expertiseIndex: number, event: any) {
    if (event.target.checked) {
      this.selectedSubExpertiseMap[expertiseIndex] = [...this.subExpertiseOptions];
    } else {
      this.selectedSubExpertiseMap[expertiseIndex] = [];
    }
  }

  // Method to handle selection changes for sub-expertise
  onSubExpertiseChange(expertiseIndex: number, selected: string[]) {
    console.log(`Sub-expertise selection changed for expertise ${expertiseIndex}:`, selected);
    // Update the map with the new selection
    this.selectedSubExpertiseMap[expertiseIndex] = [...selected];
  }

  addExpertiseFromDropdown() {
    if (this.selectedExpertise) {
      // Check if this expertise already exists in the list
      const exists = this.companyForm.expertise.some((item: any) =>
        item.name === this.selectedExpertise?.name
      );

      if (!exists) {
        this.companyForm.expertise.push({
          name: this.selectedExpertise.name,
          type: this.selectedExpertise.type || 'technologies',
          itemId: this.selectedExpertise.itemId,
          subExpertise: []
        });
      }
      // Clear the selection
      this.selectedExpertise = null;
    }
  }

  addExpertiseFromSelection() {
    if (this.selectedExpertiseName) {
      // Find the selected expertise from the dropdown options
      const selectedExp = this.expertiseDropdownOptions.find(exp => exp.name === this.selectedExpertiseName);

      if (selectedExp) {
        // Check if this expertise already exists in the list
        const exists = this.companyForm.expertise.some((item: any) =>
          item.name === this.selectedExpertiseName
        );

        if (!exists) {
          this.companyForm.expertise.push({
            name: selectedExp.name,
            type: selectedExp.type || 'technologies',
            itemId: selectedExp.itemId,
            subExpertise: []
          });

          console.log('Added expertise:', selectedExp.name);
          console.log('Updated expertise list:', this.companyForm.expertise);
        } else {
          console.log('Expertise already exists:', selectedExp.name);
        }
      } else {
        console.log('Selected expertise not found in dropdown options');
      }

      // Clear the selection
      this.selectedExpertiseName = '';
    } else {
      console.log('No expertise selected');
    }
  }

  getCategoryDomains() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/drop-down?type=domain`;
    console.log('Fetching domain categories from URL:', url);

    this.http.get<any>(url).subscribe(
      (response) => {
        console.log('Raw domain API response:', response);
        if (response?.status) {
          // Check if the data is an array of objects or simple strings
          if (response.data && response.data.length > 0) {
            console.log('First item in data:', response.data[0]);
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
          console.log('Processed category domains for ng-select:', this.categoryDomains);
        } else {
          console.error('Failed to fetch category domains:', response?.message);
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

  // Updated method to handle changes in the category ng-select component
  onCategoryChange() {
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      // Extract just the values/names directly to the form array
      this.companyForm.categoryList = [...this.selectedCategories];
    } else {
      this.companyForm.categoryList = [];
    }
    console.log('Updated categories in form:', this.companyForm.categoryList);
  }

  // Add method for adding custom items
  onItemAddCategory(event: any) {
    if (event) {
      console.log('Adding custom category:', event);
      // If it's a string from addTag
      if (typeof event === 'string') {
        // Check if the object with this value already exists
        const exists = this.categoryDomains.some(item => item.value === event);
        if (!exists) {
          this.categoryDomains.push({ name: event, value: event });
        }
      } else if (event && event.value) {
        // It's an object from the selection
        const exists = this.categoryDomains.some(item => item.value === event.value);
        if (!exists) {
          this.categoryDomains.push(event);
        }
      }
    }
  }

  getTechnologiesList() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/roles/get-technologies`;
    console.log('Fetching technologies data from URL:', url);

    this.http.get<any>(url).subscribe(
      (response) => {
        console.log('Raw technologies API response:', response);
        if (response?.status || response?.data) {
          // Extract data from response
          const data = response.data || response;

          // Process the data to make it compatible with ng-select
          if (Array.isArray(data)) {
            if (data.length > 0) {
              if (typeof data[0] === 'object') {
                // If data contains objects, transform to format compatible with ng-select
                this.technologiesList = data.map((item: any) => {
                  // For ng-select, we need objects with consistent properties
                  const value = item.name || item.value || item.technology || JSON.stringify(item);
                  return {
                    name: value,
                    value: value
                  };
                });
              } else {
                // If data is already an array of strings, convert to objects for ng-select
                this.technologiesList = data.map((item: string) => {
                  return {
                    name: item,
                    value: item
                  };
                });
              }
            }
          } else {
            // Handle case where data might be an object with arrays inside
            this.technologiesList = [];
            for (const key in data) {
              if (Array.isArray(data[key])) {
                data[key].forEach((item: any) => {
                  const value = typeof item === 'object' ?
                    (item.name || item.value || item.technology || JSON.stringify(item)) :
                    item;
                  this.technologiesList.push({
                    name: value,
                    value: value
                  });
                });
              }
            }
          }

          console.log('Processed technologies list for ng-select:', this.technologiesList);
        } else {
          console.error('Failed to fetch technologies data:', response?.message);
          this.notificationService.showError('Failed to fetch technologies data');
          this.technologiesList = [];
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching technologies data:', error);
        this.notificationService.showError('Error fetching technologies data');
        this.showLoader = false;
        this.technologiesList = [];
      }
    );
  }

  // Updated method to handle changes in the technologies ng-select component
  onTechnologiesChange() {
    if (this.selectedTechnologies && this.selectedTechnologies.length > 0) {
      // Extract just the values/names directly to the form array
      this.companyForm.technologyStack = [...this.selectedTechnologies];
    } else {
      this.companyForm.technologyStack = [];
    }
    console.log('Updated technologies in form:', this.companyForm.technologyStack);
  }

  // Renamed method for adding custom technology items
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

  initializeServicesList() {
    this.servicesList = [
      { name: "Pre-Built Software Solutions", value: "pre-built-software-solutions" },
      { name: "Custom Software Development", value: "custom-software-development" },
      { name: "Hosting & Infrastructure", value: "hosting-infrastructure" },
      { name: "Cloud Services", value: "cloud-services" },
      { name: "IT Consulting", value: "it-consulting" },
      { name: "IT Support & Maintenance", value: "it-support-maintenance" },
      { name: "IT Training", value: "it-training" },
      { name: "IT Security", value: "it-security" },
      { name: "IT Audit", value: "it-audit" },
      { name: "IT Governance", value: "it-governance" },
      { name: "IT Risk Management", value: "it-risk-management" },
      { name: "IT Compliance", value: "it-compliance" },
      { name: "IT Strategy", value: "it-strategy" },
      { name: "IT Architecture", value: "it-architecture" }
    ];

    // Initialize business types list
    this.businessTypesList = [
      { name: 'Private Limited Company', value: 'Private Limited Company' },
      { name: 'Public Limited Company', value: 'Public Limited Company' },
      { name: 'Limited Liability Partnership (LLP)', value: 'Limited Liability Partnership (LLP)' },
      { name: 'Partnership Firm', value: 'Partnership Firm' },
      { name: 'Sole Proprietorship', value: 'Sole Proprietorship' },
      { name: 'One Person Company (OPC)', value: 'One Person Company (OPC)' },
      { name: 'Section 8 Company (Non-Profit)', value: 'Section 8 Company (Non-Profit)' },
      { name: 'Hindu Undivided Family (HUF)', value: 'Hindu Undivided Family (HUF)' },
      { name: 'Cooperative Society', value: 'Cooperative Society' },
      { name: 'Trust', value: 'Trust' }
    ];
  }

  onServicesChange() {
    if (this.selectedServices) {
      this.companyForm.expertiseICanDo = this.selectedServices.map(service => service.value);
    }
  }

  onBusinessTypeChange() {
    if (this.selectedBusinessTypes && this.selectedBusinessTypes.length > 0) {
      this.companyForm.typeOfCompany = [...this.selectedBusinessTypes];
    } else {
      this.companyForm.typeOfCompany = [];
    }
  }

  getExpertiseICanDoDropdownData() {
    // Simplified version since we removed industry sector
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/drop-down-list`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response?.status && response?.data) {
          this.expertiseICanDoDropdownOptions = response.data.map((item: any) => ({
            itemId: item._id,
            name: item.name,
            type: item.type,
            value: item.name
          }));
        }
        this.showLoader = false;
      },
      (error) => {
        this.notificationService.showError('Error fetching expertise data');
        this.showLoader = false;
        this.expertiseICanDoDropdownOptions = [];
      }
    );
  }

  getSubExpertiseICanDoDropdownData(searchText: string = '') {
    this.showLoader = true;
    this.superadminService.getSubExpertiseDropdownList(searchText).subscribe(
      (response) => {
        if (response?.status) {
          this.subExpertiseICanDoOptions = response.data || [];
        }
        this.showLoader = false;
      },
      (error) => {
        this.notificationService.showError('Error fetching sub-expertise data');
        this.showLoader = false;
      }
    );
  }

  addFallbackSubExpertiseICanDoOptions() {
    this.subExpertiseICanDoOptions = [
      'Banking',
      'Information Technology (IT)',
      'Education',
      'Healthcare',
      'Insurance'
    ];
  }

  // Add back necessary methods for expertise handling
  onAddTag = (term: string) => {
    if (!this.newExpertiseType) {
      this.notificationService.showError('Please select expertise type');
      return null;
    }

    const expertiseType = this.newExpertiseType;
    const newExpertise = {
      name: term,
      value: term,
      type: expertiseType,
      itemId: null
    };

    this.showLoader = true;
    this.superadminService.createCustomExpertise({
      name: term,
      value: term,
      type: expertiseType
    }).subscribe(
      (response: any) => {
        if (response?.status) {
          newExpertise.itemId = response.data._id;
          this.expertiseDropdownOptions = [...this.expertiseDropdownOptions, newExpertise];
          this.notificationService.showSuccess('Expertise added successfully');
        } else {
          this.notificationService.showError(response?.message || 'Failed to add expertise');
        }
        this.showLoader = false;
      },
      (error: any) => {
        this.notificationService.showError(error?.message || 'Failed to add expertise');
        this.showLoader = false;
      }
    );

    return newExpertise;
  }

  addSelectedExpertise() {
    if (this.selectedExpertiseItems && this.selectedExpertiseItems.length > 0) {
      this.selectedExpertiseItems.forEach(item => {
        this.companyForm.expertise.push({
          name: item.name,
          type: this.newExpertiseType,
          itemId: item.itemId,
          value: item.value,
          subExpertise: []
        });
      });
      this.selectedExpertiseItems = [];
    }
  }

  addTechnology = (name: string) => {
    return new Promise<any>((resolve) => {
      this.showLoader = true;
      const url = `${environment.baseUrl}/tech-language/technologies`;
      const payload = { name: name, value: name };

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

  onAddTagSubExpertise = (name: string) => {
    if (!name.trim()) {
      return null;
    }

    this.addingNewSubExpertise = true;
    const newSubExpertise = name.trim();

    this.showLoader = true;

    this.superadminService.addSubExpertiseByName(newSubExpertise).subscribe({
      next: (response: any) => {
        if (response?.status) {
          if (!this.subExpertiseOptions.includes(newSubExpertise)) {
            this.subExpertiseOptions.push(newSubExpertise);
          }
          if (!this.subExpertiseICanDoOptions.includes(newSubExpertise)) {
            this.subExpertiseICanDoOptions.push(newSubExpertise);
          }
          this.notificationService.showSuccess('Sub-expertise added successfully');
        } else {
          this.notificationService.showError(response?.message || 'Failed to add sub-expertise');
        }
        this.showLoader = false;
        this.addingNewSubExpertise = false;
      },
      error: (error: any) => {
        this.notificationService.showError(error?.message || 'Failed to add sub-expertise');
        this.showLoader = false;
        this.addingNewSubExpertise = false;
      }
    });

    return newSubExpertise;
  }

  onAddTagSubExpertiseICanDo = (name: string) => {
    return this.onAddTagSubExpertise(name);
  }

  addNewPOC() {
    this.companyForm.pocDetails.push({
      name: '',
      phone: '',
      email: '',
      role: ''
    });
  }

  removePOC(index: number) {
    if (this.companyForm.pocDetails.length > 1) {
      this.companyForm.pocDetails.splice(index, 1);
    }
  }
}
