import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

interface ExpertiseItem {
  name: string;
  type?: string;
  itemId?: string | null;
  value?: string;
  originalType?: string;
  subExpertise?: string[];
}

declare var bootstrap: any;

@Component({
  selector: 'app-boss-user-supplier-user-profile-edit',
  templateUrl: './boss-user-supplier-user-profile-edit.component.html',
  styleUrls: ['./boss-user-supplier-user-profile-edit.component.scss'],
})
export class BossUserSupplierUserProfileEditComponent implements OnInit, AfterViewInit {
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
    subcontractingSupplier: false,
    expertiseICanDo: [],
    icando: [],
    isUpdateSendMail: false,
    pocDetails: [{
      name: '',
      phone: '',
      email: '',
      role: ''
    }]
  };
  servicesList: any[] = [];
  selectedServices: any[] = [];
  isLoadingServices: boolean = false;
  servicesInput$ = new Subject<string>();

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
  // industryList: any[] = [];
  // selectedIndustries: string[] = [];

  // Business Types properties
  businessTypesList: any[] = [];
  selectedBusinessTypes: string[] = [];

  categoryDomains: any[] = [];
  selectedCategories: string[] = [];
  technologiesList: any[] = [];
  selectedTechnologies: { name: string; value: string; }[] = [];
  isLoadingTechnologies: boolean = false;
  technologiesInput$ = new Subject<string>();

  // Expertise selection properties
  selectedExpertiseItems: any[] = [];
  selectedSubExpertiseMap: { [key: number]: string[] } = {};
  activeSubExpertiseSelection: string[] = [];
  activeExpertiseIndex: number = -1;

  // Properties for expertise type selection
  newExpertiseType: string = 'technologies';

  // I Can Do properties
  selectedExpertiseICanDoItems: any[] = [];
  selectedSubExpertiseICanDoMap: { [key: number]: any[] } = {};
  newExpertiseICanDoType: string = 'technologies';

  // Add this property to match register-new-supplier
  addingNewSubExpertise: boolean = false;

  // Separate properties for I Can Do
  expertiseICanDoDropdownOptions: ExpertiseItem[] = [];
  subExpertiseICanDoOptions: string[] = [];
  subExpertiseICanDoInput$ = new Subject<string>();

  // New properties for expertise dropdown functionality
  expertiseGroupedOptions: ExpertiseItem[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private supplierService: SupplierAdminService,
    private superadminService: SuperadminService,
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.randomString = Math.random().toString(36).substring(2, 15);
    this.initializeFromNavigationState();
    this.setupServicesTypeahead();

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
    this.loadInitialServices();
    this.getExpertiseDropdownData();
    this.getExpertiseICanDoDropdownData();
    this.getSubExpertiseDropdownData();
    this.getSubExpertiseICanDoDropdownData();
    this.getCategoryDomains();
    this.getTechnologiesList();
    this.loadTags();

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

    // Initialize selections from supplier details
    this.initializeSelectionsFromSupplierDetails();

    // Add fallback options if needed
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

  private initializeFromNavigationState() {
    const navigation = this.router.getCurrentNavigation();
    const data = navigation?.extras.state;
    if (data) {
      this.mapLegacyFieldNames(data);
      this.initializeArrayFields(data);
      this.supplierDetails = { ...this.supplierDetails, ...data };
      this.handleInHoldComment();

      // Initialize selectedServices from expertiseICanDo
      if (this.supplierDetails?.expertiseICanDo?.length > 0) {
        this.selectedServices = this.supplierDetails.expertiseICanDo.map((item: { name: string; itemId: string }) => ({
          name: item.name,
          itemId: item.itemId,
          _id: item.itemId
        }));
      } else {
        this.selectedServices = [];
      }
    }
  }

  private loadInitialServices() {
    this.isLoadingServices = true;
    this.http.get<any>(`${environment.baseUrl}/tags?search=`).subscribe({
      next: (response: any) => {
        this.isLoadingServices = false;
        if (response?.status && response?.data?.tags) {
          this.servicesList = response.data.tags.map((item: any) => ({
            name: item.name,
            itemId: item._id,
            _id: item._id
          }));
        }
      },
      error: (error) => {
        this.isLoadingServices = false;
        console.error('Error loading services:', error);
      }
    });
  }

  private setupServicesTypeahead() {
    this.servicesInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoadingServices = true;
        return this.http.get<any>(`${environment.baseUrl}/tags?search=${term}`).pipe(
          catchError(error => {
            console.error('Error fetching services:', error);
            return of([]);
          })
        );
      })
    ).subscribe({
      next: (response: any) => {
        this.isLoadingServices = false;
        if (response?.status && response?.data?.tags) {
          this.servicesList = response.data.tags.map((item: any) => ({
            name: item.name,
            itemId: item._id,
            _id: item._id
          }));
        }
      },
      error: (error) => {
        this.isLoadingServices = false;
        console.error('Error in services typeahead:', error);
      }
    });
  }

  toggleSelectAllServices(event: any) {
    if (event.target.checked) {
      this.selectedServices = [...this.servicesList];
    } else {
      this.selectedServices = [];
    }
    this.onServicesChange();
  }

  onServicesChange() {
    if (this.supplierDetails) {
      this.supplierDetails.expertiseICanDo = this.selectedServices.map(service => ({
        itemId: service.itemId || service._id,
        name: service.name
      }));
    }
  }

  // Update loadTags method to only include necessary fields
  loadTags(search: string = ''): void {
    this.showLoader = true;
    const params = new HttpParams().set('search', search);

    this.superadminService.getTags({ params }).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.servicesList = (response.data?.tags || []).map((tag: any) => ({
            name: tag.name,
            _id: tag._id,
            itemId: tag._id
          }));
        }
        this.showLoader = false;
      },
      error: (error: any) => {
        console.error('Error loading tags:', error);
        this.showLoader = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize tooltips after view is initialized
    setTimeout(() => {
      this.initializeTooltips();
    }, 100);
  }

  private initializeTooltips(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Initialize selections from supplier details
  initializeSelectionsFromSupplierDetails() {
    // Initialize category selections
    if (this.supplierDetails.categoryList && this.supplierDetails.categoryList.length > 0) {
      this.selectedCategories = [...this.supplierDetails.categoryList];
    }

    // Initialize technology selections
    if (this.supplierDetails.technologyStack && this.supplierDetails.technologyStack.length > 0) {
      this.selectedTechnologies = this.supplierDetails.technologyStack.map((tech: string) => ({
        name: tech,
        value: tech
      }));
    }

    // Initialize selectedSubExpertiseMap
    if (this.supplierDetails.expertise && this.supplierDetails.expertise.length > 0) {
      this.supplierDetails.expertise.forEach((expertise: any, index: number) => {
        if (expertise.subExpertise) {
          this.selectedSubExpertiseMap[index] = [...expertise.subExpertise];
        } else {
          this.selectedSubExpertiseMap[index] = [];
        }
      });
    }

    // Initialize business type selections
    if (this.supplierDetails.typeOfCompany && this.supplierDetails.typeOfCompany.length > 0) {
      this.selectedBusinessTypes = [...this.supplierDetails.typeOfCompany];
    }
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
    this.http.get<any>(`${environment.baseUrl}/tech-language/technologies`).subscribe({
      next: (response) => {
        this.isLoadingTechnologies = false;
        if (response?.status) {
          this.technologiesList = (response.data || []).map((tech: any) => ({
            name: tech.name || tech,
            value: tech.name || tech
          }));

          // Initialize selected technologies if they exist in supplier details
          if (this.supplierDetails.technologyStack?.length > 0) {
            this.selectedTechnologies = this.supplierDetails.technologyStack.map((tech: string) => ({
              name: tech,
              value: tech
            }));
          }
        }
      },
      error: (error) => {
        this.isLoadingTechnologies = false;
        console.error('Error fetching technologies:', error);
        this.notificationService.showError('Error fetching technologies');
      }
    });
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

  // Method to handle changes in the business type selection
  onBusinessTypeChange() {
    if (this.selectedBusinessTypes && this.selectedBusinessTypes.length > 0) {
      this.supplierDetails.typeOfCompany = [...this.selectedBusinessTypes];
    } else {
      this.supplierDetails.typeOfCompany = [];
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
      this.supplierDetails.technologyStack = this.selectedTechnologies.map(tech => tech.name || tech);
    } else {
      this.supplierDetails.technologyStack = [];
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

  // Method to handle adding custom expertise items
  onItemAddExpertise(event: any) {
    if (event && typeof event === 'string') {
      const exists = this.expertiseDropdownOptions.some(item => item.name === event);
      if (!exists) {
        this.expertiseDropdownOptions.push({
          itemId: null,
          name: event,
          type: 'technologies',
          value: event
        });
      }
    }
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
          this.expertiseGroupedOptions = allItems;
          console.log('Processed expertise list for ng-select:', this.expertiseGroupedOptions);
        } else {
          console.error('Failed to fetch expertise data:', response?.message);
          this.notificationService.showError('Failed to fetch expertise data');
          this.expertiseDropdownOptions = [];
          this.expertiseGroupedOptions = [];
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching expertise data:', error);
        this.notificationService.showError('Error fetching expertise data');
        this.showLoader = false;
        this.expertiseDropdownOptions = [];
        this.expertiseGroupedOptions = [];
      }
    );
  }

  // Add method for getting I Can Do expertise dropdown data
  getExpertiseICanDoDropdownData() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/drop-down-list?mandatory=true`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response?.status || response?.data) {
          const data = response.data || response;
          if (Array.isArray(data)) {
            this.expertiseICanDoDropdownOptions = data.map((item: any) => ({
              itemId: item.itemId || item._id,
              name: item.name,
              type: item.type || 'technologies',
              value: item.name
            }));
          }
        } else {
          this.notificationService.showError('Failed to fetch I Can Do expertise data');
          this.expertiseICanDoDropdownOptions = [];
        }
        this.showLoader = false;
      },
      (error) => {
        this.notificationService.showError('Error fetching I Can Do expertise data');
        this.showLoader = false;
        this.expertiseICanDoDropdownOptions = [];
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

  getSubExpertiseICanDoDropdownData(searchText: string = '') {
    this.showLoader = true;
    this.superadminService.getSubExpertiseDropdownList(searchText).subscribe(
      (response) => {
        if (response?.status) {
          this.subExpertiseICanDoOptions = response.data || [];
        } else {
          this.notificationService.showError('Failed to fetch I Can Do sub-expertise dropdown data');
          this.addFallbackSubExpertiseICanDoOptions();
        }
        this.showLoader = false;
      },
      (error) => {
        this.notificationService.showError('Error fetching I Can Do sub-expertise dropdown data');
        this.addFallbackSubExpertiseICanDoOptions();
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

  addExpertise(name: string, type: string) {
    const newExpertise: ExpertiseItem = {
      name: name,
      type: type,
      itemId: null,
      value: name,
      subExpertise: []
    };
    this.supplierDetails.expertise.push(newExpertise);
  }

  addSelectedExpertise() {
    if (this.selectedExpertiseItems && this.selectedExpertiseItems.length > 0) {
      this.selectedExpertiseItems.forEach(item => {
        const exists = this.supplierDetails.expertise.some((exp: any) => exp.name === item.name);
        if (!exists) {
          this.supplierDetails.expertise.push({
            name: item.name,
            type: item.type || this.newExpertiseType,
            itemId: item.itemId,
            value: item.value,
            subExpertise: []
          });
        }
      });
      this.selectedExpertiseItems = [];
      this.notificationService.showSuccess('Expertise added successfully');
    }
  }

  // Update the loadExpertises method to include value property
  loadExpertises() {
    this.showLoader = true;
    this.superadminService.getExpertiseList().subscribe(
      (response) => {
        if (response.status === 200) {
          this.expertiseDropdownOptions = response.data.map((item: any) => ({
            name: item.name,
            value: item.name,
            type: item.type,
            itemId: item.itemId
          }));
        } else {
          this.toastr.error('Failed to load expertise list');
          // Set fallback options if API fails
          this.expertiseDropdownOptions = [
            { name: 'Web Development', value: 'Web Development', type: 'technologies', itemId: '1' },
            { name: 'Mobile Development', value: 'Mobile Development', type: 'technologies', itemId: '2' },
            { name: 'Cloud Services', value: 'Cloud Services', type: 'product', itemId: '3' },
            { name: 'Healthcare', value: 'Healthcare', type: 'domain', itemId: '4' },
            { name: 'Finance', value: 'Finance', type: 'domain', itemId: '5' }
          ];
        }
        this.showLoader = false;
      },
      (error) => {
        this.toastr.error('Error loading expertise list');
        this.showLoader = false;
        // Set fallback options if API fails
        this.expertiseDropdownOptions = [
          { name: 'Web Development', value: 'Web Development', type: 'technologies', itemId: '1' },
          { name: 'Mobile Development', value: 'Mobile Development', type: 'technologies', itemId: '2' },
          { name: 'Cloud Services', value: 'Cloud Services', type: 'product', itemId: '3' },
          { name: 'Healthcare', value: 'Healthcare', type: 'domain', itemId: '4' },
          { name: 'Finance', value: 'Finance', type: 'domain', itemId: '5' }
        ];
      }
    );
  }

  // Method to map legacy field names to new format
  private mapLegacyFieldNames(data: any) {
    // Map legacy field names to new ones
    if (data.company_name) data.companyName = data.company_name;
    if (data.company_address) data.companyAddress = data.company_address;
    if (data.company_contact_number) data.companyContactNumber = data.company_contact_number;
    if (data.year_of_establishment) data.yearOfEstablishment = data.year_of_establishment;
    if (data.executive_summary) data.executiveSummary = data.executive_summary;
    if (data.total_projects_executed) data.totalProjectsExecuted = data.total_projects_executed;
    if (data.key_clients) data.keyClients = data.key_clients;
    if (data.technology_stack) data.technologyStack = data.technology_stack;
    if (data.category_list) data.categoryList = data.category_list;
    if (data.type_of_company) data.typeOfCompany = data.type_of_company;
    if (data.employee_count) data.employeeCount = data.employee_count;
    if (data.expertise_i_can_do) data.expertiseICanDo = data.expertise_i_can_do;
  }

  private initializeArrayFields(data: any) {
    // Initialize arrays with empty arrays if they don't exist
    this.supplierDetails.typeOfCompany = data.typeOfCompany || [];
    this.supplierDetails.certifications = data.certifications || [];
    this.supplierDetails.expertise = data.expertise || [];
    this.supplierDetails.categoryList = data.categoryList || [];
    this.supplierDetails.technologyStack = data.technologyStack || [];
    this.supplierDetails.keyClients = data.keyClients || [];
    this.supplierDetails.expertiseICanDo = data.expertiseICanDo || [];
    this.supplierDetails.icando = data.icando || [];

    // Initialize selections
    this.selectedBusinessTypes = [...this.supplierDetails.typeOfCompany];
    this.selectedCategories = [...this.supplierDetails.categoryList];
    this.selectedTechnologies = this.supplierDetails.technologyStack.map((tech: string) => ({
      name: tech,
      value: tech
    }));
  }

  // Add missing methods
  NumberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  removeExpertise(index: number) {
    this.supplierDetails.expertise.splice(index, 1);
  }

  removeSubExpertise(expertiseIndex: number, subExpertiseIndex: number) {
    this.supplierDetails.expertise[expertiseIndex].subExpertise.splice(subExpertiseIndex, 1);
  }

  addMultipleSubExpertise(expertiseIndex: number) {
    if (this.selectedSubExpertiseMap[expertiseIndex] && this.selectedSubExpertiseMap[expertiseIndex].length > 0) {
      const expertise = this.supplierDetails.expertise[expertiseIndex];
      this.selectedSubExpertiseMap[expertiseIndex].forEach(subExpertise => {
        if (!expertise.subExpertise.includes(subExpertise)) {
          expertise.subExpertise.push(subExpertise);
        }
      });
      this.selectedSubExpertiseMap[expertiseIndex] = [];
    }
  }

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

  // Add missing methods for I Can Do functionality
  removeExpertiseICanDo(index: number) {
    this.supplierDetails.expertiseICanDo.splice(index, 1);
  }

  removeSubExpertiseICanDo(expertiseIndex: number, subExpertiseIndex: number) {
    this.supplierDetails.expertiseICanDo[expertiseIndex].subExpertise.splice(subExpertiseIndex, 1);
  }

  onSubExpertiseICanDoChange(expertiseIndex: number, selectedItems: any) {
    this.selectedSubExpertiseICanDoMap[expertiseIndex] = selectedItems;
  }

  addMultipleSubExpertiseICanDo(expertiseIndex: number) {
    if (this.selectedSubExpertiseICanDoMap[expertiseIndex] && this.selectedSubExpertiseICanDoMap[expertiseIndex].length > 0) {
      const expertise = this.supplierDetails.expertiseICanDo[expertiseIndex];
      this.selectedSubExpertiseICanDoMap[expertiseIndex].forEach(subExpertise => {
        if (!expertise.subExpertise.includes(subExpertise)) {
          expertise.subExpertise.push(subExpertise);
        }
      });
      this.selectedSubExpertiseICanDoMap[expertiseIndex] = [];
    }
  }

  onAddTagICanDo = (name: string) => {
    return new Promise<any>((resolve) => {
      if (!this.newExpertiseICanDoType) {
        this.toastr.error('Please select a type for the new expertise');
        resolve(null);
        return;
      }

      const newExpertise = {
        name: name,
        type: this.newExpertiseICanDoType,
        value: name
      };

      this.superadminService.createCustomExpertise(newExpertise).subscribe(
        (response) => {
          if (response?.status) {
            this.toastr.success('Expertise added successfully');
            resolve(newExpertise);
          } else {
            this.toastr.error(response?.message || 'Failed to add expertise');
            resolve(null);
          }
        },
        (error) => {
          this.toastr.error('Error adding expertise');
          resolve(null);
        }
      );
    });
  }

  addSelectedExpertiseICanDo() {
    if (this.selectedExpertiseICanDoItems && this.selectedExpertiseICanDoItems.length > 0) {
      this.selectedExpertiseICanDoItems.forEach(item => {
        // Check if this expertise already exists
        const exists = this.supplierDetails.expertiseICanDo.some((exp: ExpertiseItem) => exp.name === item.name);
        if (!exists) {
          this.supplierDetails.expertiseICanDo.push({
            name: item.name,
            type: item.type || this.newExpertiseICanDoType,
            itemId: item.itemId,
            value: item.name,
            subExpertise: []
          });
        }
      });
      this.selectedExpertiseICanDoItems = [];
    }
  }

  checkSupplierTypeSelection() {
    return this.supplierDetails.resourceSharingSupplier || this.supplierDetails.subcontractingSupplier;
  }

  checkMandatoryFields(): { isValid: boolean, messages: string[] } {
    const result = {
        isValid: true,
        messages: [] as string[]
    };

    // Check company name
    if (!this.supplierDetails.companyName) {
        result.messages.push('Company Name is required');
        result.isValid = false;
    }

    // Check Contact Email
    if (!this.supplierDetails.email) {
        result.messages.push('Contact Email is required');
        result.isValid = false;
    }

    // Check POC details - only first POC is mandatory
    if (!this.supplierDetails.pocDetails?.length) {
        result.messages.push('At least one POC is required');
        result.isValid = false;
    } else {
        const firstPOC = this.supplierDetails.pocDetails[0];
        if (!firstPOC?.name) {
            result.messages.push('POC Name is required');
            result.isValid = false;
        }
        if (!firstPOC?.email) {
            result.messages.push('POC Email is required');
            result.isValid = false;
        }
        if (!firstPOC?.phone) {
            result.messages.push('POC Phone is required');
            result.isValid = false;
        }
    }

    // Check supplier type
    if (!this.supplierDetails.resourceSharingSupplier && !this.supplierDetails.subcontractingSupplier) {
        result.messages.push('At least one Supplier Type must be selected');
        result.isValid = false;
    }

    // Log the validation results
    console.log('Validation Results:', {
        isValid: result.isValid,
        messages: result.messages,
        supplierDetails: {
            companyName: this.supplierDetails.companyName,
            email: this.supplierDetails.email,
            pocDetails: this.supplierDetails.pocDetails?.[0],
            resourceSharingSupplier: this.supplierDetails.resourceSharingSupplier,
            subcontractingSupplier: this.supplierDetails.subcontractingSupplier
        }
    });

    return result;
  }

  hasInvalidExpertise(): boolean {
    const validation = this.checkMandatoryFields();
    if (!validation.isValid) {
        validation.messages.forEach(msg => {
            this.notificationService.showError(msg);
        });
    }
    return !validation.isValid;
  }

  submitForm() {
    if (!this.checkSupplierTypeSelection()) {
      this.showSupplierTypeError = true;
      return;
    }

    if (this.hasInvalidExpertise()) {
      this.notificationService.showError('Please select at least one expertise and sub-expertise for each expertise type.');
      return;
    }

    // Validate POC details
    const isValidPOCs = this.supplierDetails.pocDetails.every((poc: any) =>
      poc.name && poc.phone && poc.email
    );

    if (!this.supplierDetails.companyName) {
      this.notificationService.showError('Please enter Company Name');
      return;
    }

    if (!isValidPOCs) {
      this.notificationService.showError('Please fill in all required POC fields (Name, Phone, and Email)');
      return;
    }

    // Remove old POC fields if they exist
    delete this.supplierDetails.poc_name;
    delete this.supplierDetails.poc_phone;
    delete this.supplierDetails.poc_email;
    delete this.supplierDetails.poc_role;

    // Create a copy of the supplier details for submission
    const submissionData = {
      ...this.supplierDetails,
      typeOfCompany: this.selectedBusinessTypes,
      categoryList: this.selectedCategories,
      technologyStack: this.selectedTechnologies.map(tech => tech.name || tech),
      expertiseICanDo: this.selectedServices.map(service => ({
        name: service.name,
        itemId: service.itemId || service._id,
        subExpertise: service.subExpertise || []
      }))
    };

    // Get the supplier ID
    const id = this.supplierDetails._id;
    if (!id) {
      this.notificationService.showError('Supplier ID not found');
      return;
    }

    // Show loader
    this.showLoader = true;

    // Make the API call using the supplier service
    this.supplierService.updateSuppilerDetails(id, submissionData)
      .subscribe({
        next: (response: any) => {
          this.showLoader = false;
          if (response?.status) {
            this.notificationService.showSuccess('Supplier details updated successfully');
            this.router.navigate(['/boss-user/supplier']);
          } else {
            this.notificationService.showError(response?.message || 'Failed to update supplier details');
          }
        },
        error: (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.message || 'Failed to update supplier details');
        }
      });
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

  onAddTagSubExpertise = (name: string) => {
    if (!name.trim()) {
      return null;
    }

    this.addingNewSubExpertise = true;
    const newSubExpertise = name.trim();

    // Show loader
    this.showLoader = true;

    // Call the API to add the new sub-expertise
    this.superadminService.addSubExpertiseByName(newSubExpertise).subscribe({
      next: (response: any) => {
        if (response?.status) {
          // Add to local options array
          if (!this.subExpertiseOptions.includes(newSubExpertise)) {
            this.subExpertiseOptions.push(newSubExpertise);
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

    // Return the new sub-expertise so it appears in the dropdown immediately
    return newSubExpertise;
  }

  toggleSelectAllSubExpertise(expertiseIndex: number, event: any) {
    if (event.target.checked) {
      this.selectedSubExpertiseMap[expertiseIndex] = [...this.subExpertiseOptions];
    } else {
      this.selectedSubExpertiseMap[expertiseIndex] = [];
    }
  }

  toggleSelectAllSubExpertiseICanDo(expertiseIndex: number, event: any) {
    if (event.target.checked) {
      this.selectedSubExpertiseICanDoMap[expertiseIndex] = [...this.subExpertiseOptions];
    } else {
      this.selectedSubExpertiseICanDoMap[expertiseIndex] = [];
    }
  }

  private handleInHoldComment() {
    if (this.supplierDetails.inHoldComment?.length > 0) {
      this.inHoldComment = this.supplierDetails.inHoldComment[0]?.comment || '';
    }
  }

  addNewPOC() {
    this.supplierDetails.pocDetails.push({
      name: '',
      phone: '',
      email: '',
      role: ''
    });
  }

  removePOC(index: number) {
    if (this.supplierDetails.pocDetails.length > 1) {
      this.supplierDetails.pocDetails.splice(index, 1);
    }
  }
}

