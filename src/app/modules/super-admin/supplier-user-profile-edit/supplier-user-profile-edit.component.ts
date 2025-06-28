import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var bootstrap: any;

interface ExpertiseItem {
  name: string;
  type?: string;
  itemId?: string | null;
  value?: string;
  originalType?: string;
  subExpertise?: string[];
}

export interface POCDetails {
  name: string;
  phone: string;
  email: string;
  role: string;
  isPrimary: boolean;
  _id?: string;
}

@Component({
  selector: 'app-supplier-user-profile-edit',
  templateUrl: './supplier-user-profile-edit.component.html',
  styleUrls: ['./supplier-user-profile-edit.component.scss']
})
export class SupplierUserProfileEditComponent implements OnInit, AfterViewInit {
  supplierId: string = '';
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
      role: '',
      isPrimary: true
    }] as POCDetails[]
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
  industryList: { name: string; value: string; }[] = [];
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
    // Get supplier ID from route params if not set from navigation state
    if (!this.supplierId) {
      this.route.queryParams.subscribe(params => {
        this.supplierId = params['id'] || '';
        if (this.supplierId) {
          this.loadSupplierDetails();
        }
      });
    }

    // Load all dropdown data
    this.loadInitialServices();
    this.setupServicesTypeahead();
    this.getExpertiseDropdownData();
    this.getIndustryList();
    this.getCategoryDomains();
    this.getTechnologiesList();
    this.getExpertiseICanDoDropdownData();
    this.getSubExpertiseDropdownData();
    this.getSubExpertiseICanDoDropdownData();
    this.loadTags(); // Load initial tags

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

    // Initialize selections from existing data
    this.initializeSelectionsFromSupplierDetails();
  }

  private initializeFromNavigationState() {
    const navigation = this.router.getCurrentNavigation();
    const data = navigation?.extras.state;
    if (data) {
      console.log('Initial navigation data:', data);
      this.mapLegacyFieldNames(data);
      this.initializeArrayFields(data);

      // Set the supplier ID
      this.supplierId = data['_id'] || '';

      // First spread the data, then override with required fields to ensure they're not null
      this.supplierDetails = {
        ...data,
        _id: data['_id'] || '',
        companyName: data['companyName'] || '',
        poc_name: data['poc_name'] || '',
        poc_phone: data['poc_phone'] || '',
        resourceSharingSupplier: data['resourceSharingSupplier'] ?? false,
        subcontractingSupplier: data['subcontractingSupplier'] ?? false,
        // Ensure expertiseICanDo is an array and filter out invalid items
        expertiseICanDo: Array.isArray(data['expertiseICanDo'])
          ? data['expertiseICanDo']
              .filter((item: any) => item && item.itemId && item.name)
              .map((item: any) => ({
                itemId: item.itemId,
                name: item.name
              }))
          : []
      };

      // Initialize selectedServices from expertiseICanDo
      this.selectedServices = this.supplierDetails.expertiseICanDo
        .filter((item: any) => item && item.itemId && item.name)
        .map((item: any) => ({
          name: item.name,
          _id: item.itemId
        }));
    }
  }

  private initializeArrayFields(data: any) {
    const arrayFields = [
      'typeOfCompany',
      'industry_Sector',
      'certifications',
      'expertise',
      'categoryList',
      'technologyStack',
      'keyClients',
      'expertiseICanDo'
    ];
    arrayFields.forEach(field => {
      if (!data[field]) {
        data[field] = [];
      }
    });
  }

  private handleInHoldComment() {
    if (this.supplierDetails.inHoldComment?.length > 0) {
      this.inHoldComment = this.supplierDetails.inHoldComment[0]?.comment || '';
    }
  }

  private loadInitialServices() {
    this.isLoadingServices = true;
    this.http.get<any>(`${environment.baseUrl}/tags?search=`).subscribe({
      next: (response: any) => {
        this.isLoadingServices = false;
        console.log('Initial services response:', response);

        if (response?.status && response?.data?.tags) {
          this.servicesList = response.data.tags
            .filter((item: any) => item && item._id && item.name)
            .map((item: any) => ({
              name: item.name,
              _id: item._id
            }));

          // If we have existing expertiseICanDo, map it to selectedServices
          if (this.supplierDetails.expertiseICanDo?.length > 0) {
            this.selectedServices = this.supplierDetails.expertiseICanDo
              .filter((item: any) => item && item.itemId && item.name)
              .map((item: any) => ({
                name: item.name,
                _id: item.itemId
              }));
          }

          console.log('Initial services list:', this.servicesList);
          console.log('Initial selected services:', this.selectedServices);
        }
      },
      error: (error) => {
        this.isLoadingServices = false;
        console.error('Error loading initial services:', error);
        this.servicesList = [];
        this.selectedServices = [];
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
            value: item.name,
            _id: item._id
          }));
        }
      },
      error: (error) => {
        this.isLoadingServices = false;
        console.error('Error in services subscription:', error);
      }
    });
  }

  onServicesChange() {
    console.log('Selected services before mapping:', this.selectedServices);

    if (!Array.isArray(this.selectedServices)) {
      this.selectedServices = [];
    }

    // Filter out any invalid services and map to the correct format
    const validServices = this.selectedServices
      .filter(service => service && service._id && service.name)
      .map(service => ({
        itemId: service._id,
        name: service.name
      }));

    console.log('Valid services mapped:', validServices);

    // Update expertiseICanDo in supplierDetails
    this.supplierDetails = {
      ...this.supplierDetails,
      expertiseICanDo: validServices
    };

    console.log('Updated supplier details:', {
      expertiseICanDo: this.supplierDetails.expertiseICanDo,
      selectedServices: this.selectedServices
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

  // Initialize selections from supplier details
  initializeSelectionsFromSupplierDetails() {
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

    // Initialize business type selections
    if (this.supplierDetails.typeOfCompany && this.supplierDetails.typeOfCompany.length > 0) {
      this.selectedBusinessTypes = [...this.supplierDetails.typeOfCompany];
      console.log('Initialized business types:', this.selectedBusinessTypes);
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
    console.log('Fetching category domains...');
    const url = `${environment.baseUrl}/web-user/drop-down?type=domain`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('Category domains response:', response);
        if (response?.status) {
          if (response.data && response.data.length > 0) {
            if (typeof response.data[0] === 'object') {
              this.categoryDomains = response.data.map((item: any) => ({
                name: item.name || item.value || item.domain || item.category || JSON.stringify(item),
                value: item.name || item.value || item.domain || item.category || JSON.stringify(item)
              }));
            } else {
              this.categoryDomains = response.data.map((item: string) => ({
                name: item,
                value: item
              }));
            }
          }
          console.log('Processed category domains:', this.categoryDomains);
        } else {
          console.error('Failed to fetch category domains:', response?.message);
          this.notificationService.showError('Failed to fetch category domains');
          this.setFallbackCategoryDomains();
        }
        this.showLoader = false;
      },
      error: (error) => {
        console.error('Error fetching category domains:', error);
        this.notificationService.showError('Error fetching category domains');
        this.setFallbackCategoryDomains();
        this.showLoader = false;
      }
    });
  }

  private setFallbackCategoryDomains() {
    this.categoryDomains = [
      { name: 'Software Development', value: 'Software Development' },
      { name: 'IT Services', value: 'IT Services' },
      { name: 'Consulting', value: 'Consulting' },
      { name: 'Digital Marketing', value: 'Digital Marketing' },
      { name: 'Cloud Services', value: 'Cloud Services' }
    ];
  }

  // Get technologies list for dropdown
  getTechnologiesList() {
    this.isLoadingTechnologies = true;
    console.log('Fetching technologies list...');

    this.http.get<any>(`${environment.baseUrl}/tech-language/technologies`).subscribe({
      next: (response) => {
        console.log('Technologies response:', response);
        if (response?.status) {
          this.technologiesList = response.data || [];

          // If we have existing technologies in the form, select them
          if (this.supplierDetails.technologyStack?.length) {
            this.selectedTechnologies = this.supplierDetails.technologyStack.map((tech: string) => ({
              name: tech
            }));
          }
          console.log('Processed technologies list:', this.technologiesList);
        } else {
          console.error('Failed to fetch technologies:', response?.message);
          this.notificationService.showError('Failed to fetch technologies');
          this.setFallbackTechnologies();
        }
        this.isLoadingTechnologies = false;
      },
      error: (error) => {
        console.error('Error fetching technologies:', error);
        this.notificationService.showError('Error fetching technologies');
        this.setFallbackTechnologies();
        this.isLoadingTechnologies = false;
      }
    });
  }

  private setFallbackTechnologies() {
    this.technologiesList = [
      { name: 'JavaScript', value: 'JavaScript' },
      { name: 'Python', value: 'Python' },
      { name: 'Java', value: 'Java' },
      { name: 'C#', value: 'C#' },
      { name: 'PHP', value: 'PHP' }
    ];
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
    const url = `${environment.baseUrl}/web-user/drop-down-list`;
    console.log('Fetching expertise data from URL:', url);

    this.http.get<any>(url).subscribe({
      next: (response) => {
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
          console.log('Processed expertise list:', this.expertiseGroupedOptions);
        } else {
          console.error('Failed to fetch expertise data:', response?.message);
          this.notificationService.showError('Failed to fetch expertise data');
          this.setFallbackExpertise();
        }
        this.showLoader = false;
      },
      error: (error) => {
        console.error('Error fetching expertise data:', error);
        this.notificationService.showError('Error fetching expertise data');
        this.setFallbackExpertise();
        this.showLoader = false;
      }
    });
  }

  private setFallbackExpertise() {
    this.expertiseDropdownOptions = [
      { name: 'Web Development', value: 'Web Development', type: 'technologies', itemId: '1' },
      { name: 'Mobile Development', value: 'Mobile Development', type: 'technologies', itemId: '2' },
      { name: 'Cloud Services', value: 'Cloud Services', type: 'product', itemId: '3' },
      { name: 'Healthcare', value: 'Healthcare', type: 'domain', itemId: '4' },
      { name: 'Finance', value: 'Finance', type: 'domain', itemId: '5' }
    ];
    this.expertiseGroupedOptions = [...this.expertiseDropdownOptions];
  }

  // Add method for getting I Can Do expertise dropdown data
  getExpertiseICanDoDropdownData() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/drop-down-list`;

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
    console.log('Fetching sub-expertise data with search:', searchText);

    this.superadminService.getSubExpertiseDropdownList(searchText).subscribe({
      next: (response) => {
        console.log('Sub-expertise response:', response);
        if (response?.status) {
          this.subExpertiseOptions = response.data || [];
          console.log('Processed sub-expertise options:', this.subExpertiseOptions);

          // Add fallback data if API returns empty
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
      error: (error) => {
        console.error('Error fetching sub-expertise dropdown data:', error);
        this.notificationService.showError('Error fetching sub-expertise dropdown data');
        this.addFallbackSubExpertiseOptions();
        this.showLoader = false;
      }
    });
  }

  addFallbackSubExpertiseOptions() {
    console.log('Adding fallback sub-expertise options');
    this.subExpertiseOptions = [
      'Banking',
      'Information Technology (IT)',
      'Education',
      'Healthcare',
      'Insurance',
      'E-commerce',
      'Manufacturing',
      'Telecommunications',
      'Retail',
      'Media & Entertainment'
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
    this.showSupplierTypeError = !this.supplierDetails.resourceSharingSupplier && !this.supplierDetails.subcontractingSupplier;
  }

  hasInvalidExpertise(): boolean {
    // Only check expertise section for sub-expertise requirement
    return this.supplierDetails.expertise.some((expertise: ExpertiseItem) =>
      !expertise.subExpertise || expertise.subExpertise.length === 0
    );
  }

  onSubmit() {
    // Validate POC details
    if (!this.validatePOCDetails()) {
      this.notificationService.showError('Please fill in all required POC details');
      return;
    }

    // Create the payload
    const payload = {
      ...this.supplierDetails,
      // Remove old POC fields if they exist
      poc_name: undefined,
      poc_phone: undefined,
      poc_email: undefined,
      poc_role: undefined,
      // Keep the pocDetails array
      pocDetails: this.supplierDetails.pocDetails
    };

    // Get the correct supplier ID
    const id = this.supplierId || this.supplierDetails['_id'];
    if (!id) {
      this.notificationService.showError('Supplier ID not found');
      return;
    }

    this.showLoader = true;
    this.supplierService.updateSuppilerDetails(id, payload).subscribe({
      next: (response: any) => {
        this.showLoader = false;
        if (response.status) {
          this.notificationService.showSuccess('Supplier details updated successfully');
          this.router.navigate(['/super-admin/super-admin-supplier']);
        } else {
          this.notificationService.showError(response.message || 'Failed to update supplier details');
        }
      },
      error: (error: any) => {
        this.showLoader = false;
        this.notificationService.showError(error?.error?.message || error?.message || 'Failed to update supplier details');
      }
    });
  }

  validatePOCDetails(): boolean {
    // Check if at least one POC is present
    if (!this.supplierDetails.pocDetails || this.supplierDetails.pocDetails.length === 0) {
      return false;
    }

    // Check if all required fields are filled
    for (const poc of this.supplierDetails.pocDetails as POCDetails[]) {
      if (!poc.name || !poc.phone || !poc.email) {
        return false;
      }
    }

    // Ensure at least one POC is marked as primary
    if (!this.supplierDetails.pocDetails.some((poc: POCDetails) => poc.isPrimary)) {
      this.supplierDetails.pocDetails[0].isPrimary = true;
    }

    return true;
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

  loadServices(searchTerm: string = '') {
    this.isLoadingServices = true;
    this.http.get<any>(`${environment.baseUrl}/tags?search=${searchTerm}`).pipe(
      catchError(error => {
        console.error('Error fetching services:', error);
        return of({ status: false, data: { tags: [] } });
      })
    ).subscribe(
      (response: any) => {
        this.isLoadingServices = false;
        console.log('Services API response:', response);

        if (response?.status && response?.data?.tags) {
          this.servicesList = response.data.tags
            .filter((item: any) => item && item._id && item.name) // Filter out invalid items
            .map((item: any) => ({
              name: item.name,
              _id: item._id
            }));

          console.log('Processed services list:', this.servicesList);
        } else {
          console.warn('Invalid services response:', response);
          this.servicesList = [];
        }
      },
      error => {
        this.isLoadingServices = false;
        console.error('Error loading services:', error);
        this.servicesList = [];
      }
    );
  }

  isUpdateButtonDisabled(): boolean {
    const isDisabled = !this.supplierDetails['companyName'] ||
                      !this.supplierDetails['poc_name'] ||
                      !this.supplierDetails['poc_phone'] ||
                      (!this.supplierDetails['resourceSharingSupplier'] && !this.supplierDetails['subcontractingSupplier']);

    console.log('Button disabled state:', {
      companyName: this.supplierDetails['companyName'],
      pocName: this.supplierDetails['poc_name'],
      pocPhone: this.supplierDetails['poc_phone'],
      resourceSharing: this.supplierDetails['resourceSharingSupplier'],
      subcontracting: this.supplierDetails['subcontractingSupplier'],
      isDisabled: isDisabled
    });

    return isDisabled;
  }

  loadTags() {
    // Implementation of loadTags method
  }

  addNewPOC() {
    this.supplierDetails.pocDetails.push({
      name: '',
      phone: '',
      email: '',
      role: '',
      isPrimary: false
    } as POCDetails);
  }

  removePOC(index: number) {
    if (this.supplierDetails.pocDetails.length > 1) {
      this.supplierDetails.pocDetails.splice(index, 1);
      // If we removed the primary POC, make the first one primary
      if (!this.supplierDetails.pocDetails.some((poc: POCDetails) => poc.isPrimary)) {
        this.supplierDetails.pocDetails[0].isPrimary = true;
      }
    }
  }

  // Update the loadSupplierDetails method to handle POC details
  loadSupplierDetails() {
    this.supplierService.getSupplierDetails(this.supplierId).subscribe({
      next: (response: any) => {
        this.supplierDetails = response.data;
        // Initialize POC details if not present
        if (!this.supplierDetails.pocDetails || !this.supplierDetails.pocDetails.length) {
          this.supplierDetails.pocDetails = [{
            name: this.supplierDetails.poc_name || '',
            phone: this.supplierDetails.poc_phone || '',
            email: this.supplierDetails.poc_email || '',
            role: this.supplierDetails.poc_role || '',
            isPrimary: true
          }] as POCDetails[];
        }
        // ... rest of the existing code ...
      },
      error: (error: any) => {
        console.error('Error loading supplier details:', error);
      }
    });
  }

  onPrimaryPOCChange(index: number) {
    // If this POC is being set as primary
    if (this.supplierDetails.pocDetails[index].isPrimary) {
      // Set all other POCs as non-primary
      this.supplierDetails.pocDetails.forEach((poc: POCDetails, i: number) => {
        if (i !== index) {
          poc.isPrimary = false;
        }
      });
    } else {
      // If this POC is being unchecked, make sure at least one POC is primary
      const hasPrimary = this.supplierDetails.pocDetails.some((poc: POCDetails, i: number) => i !== index && poc.isPrimary);
      if (!hasPrimary) {
        // If no other POC is primary, keep this one as primary
        this.supplierDetails.pocDetails[index].isPrimary = true;
      }
    }
  }
}
