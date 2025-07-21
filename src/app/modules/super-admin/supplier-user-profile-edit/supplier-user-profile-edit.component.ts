import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

declare var bootstrap: any;

interface Technology {
  _id: string;
  name: string;
  isSystem: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  type: string;
  tags: string[];
  isSystem: boolean;
  createdAt: string;
  subExpertise: any[];
  isMandatory: boolean;
}

interface SupplierResponse {
  status: boolean;
  data: {
    _id: string;
    companyName: string;
    website: string;
    companyAddress: string;
    country: string;
    email: string;
    companyContactNumber: number;
    yearOfEstablishment: string;
    executiveSummary: string;
    typeOfCompany: string[];
    employeeCount: number;
    turnover: number;
    totalProjectsExecuted: number;
    certifications: string[];
    resourceSharingSupplier: boolean;
    subcontractingSupplier: boolean;
    services: string[];
    technologyStack: string[];
    product: string[];
    cloudPlatforms: string[];
    devOpsAutomation: string[];
    containerizationOrchestration: string[];
    networkingInfrastructure: string[];
    securityIAM: string[];
    monitoringObservability: string[];
    integrationAPIManagement: string[];
    eventStreamingMessaging: string[];
    databasePlatforms: string[];
    dataAnalyticsBI: string[];
    aiMLPlatforms: string[];
    erpEnterpriseSystems: string[];
    crmCustomerPlatforms: string[];
    itsmITOperations: string[];
    businessAppsProductivity: string[];
    eCommerceCMS: string[];
    learningHRSystems: string[];
    lowCodeNoCodePlatforms: string[];
    testingQA: string[];
    web3DecentralizedTech: string[];
    pocDetails: {
      name: string;
      phone: string;
      email: string;
      role: string;
      _id: string;
    }[];
  };
}


@Component({
  selector: 'app-supplier-user-profile-edit',
  templateUrl: './supplier-user-profile-edit.component.html',
  styleUrls: ['./supplier-user-profile-edit.component.scss']
})
export class SupplierUserProfileEditComponent implements OnInit, AfterViewInit {
  currentStep: number = 1;
  totalSteps: number = 8;
  profileForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentDate: string = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  certificationTags: string[] = [];
  supplierId: string = '';
  isEditMode: boolean = false;

  // Add properties to track visibility of "Other" input fields
  showServicesOther = false;
  showTechnologyStackOther = false;
  showCloudPlatformsOther = false;
  showDevOpsAutomationOther = false;
  showContainerizationOrchestrationOther = false;
  showNetworkingInfrastructureOther = false;
  showSecurityIAMOther = false;
  showMonitoringObservabilityOther = false;
  showIntegrationAPIManagementOther = false;
  showEventStreamingMessagingOther = false;
  showDatabasePlatformsOther = false;
  showDataAnalyticsBIOther = false;
  showAiMLPlatformsOther = false;
  showErpEnterpriseSystemsOther = false;
  showCrmCustomerPlatformsOther = false;
  showItsmITOperationsOther = false;
  showBusinessAppsProductivityOther = false;
  showECommerceCMSOther = false;
  showLearningHRSystemsOther = false;
  showLowCodeNoCodePlatformsOther = false;
  showTestingQAOther = false;
  showWeb3DecentralizedTechOther = false;

  // Add business types list
  businessTypesList = [
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

  // Add new properties for API data
  technologies: Technology[] = [];
  services: any[] = [];
  products: Product[] = [];
  isLoadingTechnologies = false;
  isLoadingServices = false;
  isLoadingProducts = false;
  showProductDropdown = false;

  // Add properties for each dropdown's data
  cloudPlatformsList: any[] = [];
  devOpsList: any[] = [];
  containerizationList: any[] = [];
  isLoadingDropdownData = false;

  // Add properties for step 4 dropdowns
  networkingList: any[] = [];
  securityList: any[] = [];
  monitoringList: any[] = [];
  apiManagementList: any[] = [];
  eventStreamingList: any[] = [];
  isLoadingStep4Data = false;

  // Add new properties for Other options
  readonly OTHER_OPTION = {
    _id: 'other',
    name: 'Other',
    isSystem: true,
    createdAt: new Date().toISOString(),
    value: 'other'  // Added for compatibility with both dropdowns
  };

  // Add property to store cloud platforms data
  isLoadingCloudPlatforms = false;

  // Add properties for step 5 dropdowns
  databasePlatformsList: any[] = [];
  dataAnalyticsList: any[] = [];
  aiMlPlatformsList: any[] = [];
  erpSystemsList: any[] = [];
  crmPlatformsList: any[] = [];
  itsmList: any[] = [];
  businessAppsList: any[] = [];
  eCommerceCmsList: any[] = [];
  learningHrSystemsList: any[] = [];
  lowCodeNoCodeList: any[] = [];
  testingQaList: any[] = [];
  web3DecentralizedList: any[] = [];

  // Add loading flags
  isLoadingStep5Data = false;
  isLoadingStep6Data = false;
  isLoadingStep7Data = false;

  steps = [
    { number: 1, title: 'Profile Setup', completed: false, active: true },
    { number: 2, title: 'Technology Stack & Services', completed: false, active: false },
    { number: 3, title: 'Core Services & Capabilities', completed: false, active: false },
    { number: 4, title: 'Infrastructure, Integration & Security', completed: false, active: false },
    { number: 5, title: 'Data, Intelligence & Automation', completed: false, active: false },
    { number: 6, title: 'Enterprise Systems & Business Apps', completed: false, active: false },
    { number: 7, title: 'Front-End, Composable & Emerging Tech', completed: false, active: false },
    { number: 8, title: 'Success', completed: false, active: false }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private supplierAdminService: SupplierAdminService,
    private superAdminService: SuperadminService,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  // Add method to load step 4 dropdowns
  async loadStep4Dropdowns() {
    try {
      this.isLoadingStep4Data = true;

      // Load all step 4 data in parallel
      const [
        networkingResponse,
        securityResponse,
        monitoringResponse,
        apiManagementResponse,
        eventStreamingResponse
      ] = await Promise.all([
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Networking & Infrastructure' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Security & IAM' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Monitoring & Observability' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Integration & API Management' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Event Streaming & Messaging' }
        }).toPromise()
      ]);

      // Update the lists with the response data
      if (networkingResponse.status && networkingResponse.data) {
        this.networkingList = [...networkingResponse.data, this.OTHER_OPTION];
      }
      if (securityResponse.status && securityResponse.data) {
        this.securityList = [...securityResponse.data, this.OTHER_OPTION];
      }
      if (monitoringResponse.status && monitoringResponse.data) {
        this.monitoringList = [...monitoringResponse.data, this.OTHER_OPTION];
      }
      if (apiManagementResponse.status && apiManagementResponse.data) {
        this.apiManagementList = [...apiManagementResponse.data, this.OTHER_OPTION];
      }
      if (eventStreamingResponse.status && eventStreamingResponse.data) {
        this.eventStreamingList = [...eventStreamingResponse.data, this.OTHER_OPTION];
      }

      this.isLoadingStep4Data = false;
    } catch (error) {
      console.error('Error loading step 4 dropdowns:', error);
      this.isLoadingStep4Data = false;
    }
  }

  private initForm() {
    this.profileForm = this.formBuilder.group({
      // Step 1 fields - Only Company Name and POC Details are mandatory
      companyName: ['', Validators.required],
      website: [''],
      companyAddress: [''],
      country: [''],
      email: [''],
      companyContactNumber: [''],
      yearOfEstablishment: [''],
      executiveSummary: [''],
      pocDetails: this.formBuilder.array([this.createPocDetailFormGroup()]),
      typeOfCompany: [[]],
      employeeCount: [''],
      turnover: [''],
      totalProjectsExecuted: [''],
      certifications: [[]],
      resourceSharingSupplier: [false],
      subcontractingSupplier: [false],
      certificationInput: [''],

      // Step 2 fields - All non-mandatory
      services: [[]],
      servicesOther: [''],
      technologyStack: [[]],
      technologyStackOther: [''],
      product: [[]],

      // Step 3 fields - All non-mandatory
      cloudPlatforms: [['OVHcloud', 'NTT-Netmagic']],
      cloudPlatformsOther: [''],
      devOpsAutomation: [[]],
      devOpsAutomationOther: [''],
      containerizationOrchestration: [[]],
      containerizationOrchestrationOther: [''],

      // Step 4 fields - All non-mandatory
      networkingInfrastructure: [[]],
      networkingInfrastructureOther: [''],
      securityIAM: [[]],
      securityIAMOther: [''],
      monitoringObservability: [[]],
      monitoringObservabilityOther: [''],
      integrationAPIManagement: [[]],
      integrationAPIManagementOther: [''],
      eventStreamingMessaging: [[]],
      eventStreamingMessagingOther: [''],

      // Step 5 fields - All non-mandatory
      databasePlatforms: [[]],
      databasePlatformsOther: [''],
      dataAnalyticsBI: [[]],
      dataAnalyticsBIOther: [''],
      aiMLPlatforms: [[]],
      aiMLPlatformsOther: [''],

      // Step 6 fields - All non-mandatory
      erpEnterpriseSystems: [[]],
      erpEnterpriseSystemsOther: [''],
      crmCustomerPlatforms: [[]],
      crmCustomerPlatformsOther: [''],
      itsmITOperations: [[]],
      itsmITOperationsOther: [''],
      businessAppsProductivity: [[]],
      businessAppsProductivityOther: [''],

      // Step 7 fields - All non-mandatory
      eCommerceCMS: [[]],
      eCommerceCMSOther: [''],
      learningHRSystems: [[]],
      learningHRSystemsOther: [''],
      lowCodeNoCodePlatforms: [[]],
      lowCodeNoCodePlatformsOther: [''],
      testingQA: [[]],
      testingQAOther: [''],
      web3DecentralizedTech: [[]],
      web3DecentralizedTechOther: ['']
    });
  }

  private createPocDetailFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  private saveFormData() {
    localStorage.setItem('profileSetupFormData', JSON.stringify(this.profileForm.value));
    localStorage.setItem('profileSetupCurrentStep', this.currentStep.toString());
  }

  private checkEditMode(): void {
    // Try to get supplier ID from route params first
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.supplierId = params['id'];
        this.isEditMode = true;
        this.loadExistingProfileData();
      }
    });

    // Check for router state data
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const supplierData = navigation.extras.state as any;
      this.supplierId = supplierData._id;
      this.isEditMode = true;
      this.populateFormWithExistingData(supplierData);
    }

    // If no route param or state, try to get from localStorage
    if (!this.supplierId) {
      const userData = this.localStorageService.getLogger();
      if (userData && userData._id) {
        this.supplierId = userData._id;
        this.isEditMode = true;
        this.loadExistingProfileData();
      }
    }
  }

  private loadExistingProfileData(): void {
    if (!this.supplierId) return;

    this.superAdminService.getSupplierDetails(this.supplierId).subscribe({
      next: (response: SupplierResponse) => {
        if (response.status && response.data) {
          this.populateFormWithExistingData(response.data);
        }
      },
      error: (error: any) => {
        console.error('Error fetching supplier details:', error);
        this.errorMessage = 'Failed to load supplier details';
      }
    });
  }

  private populateFormWithExistingData(data: any): void {
    console.log('Populating form with data:', data);

    // Clear existing POC details
    const pocFormArray = this.getPocDetails();
    while (pocFormArray.length !== 0) {
      pocFormArray.removeAt(0);
    }

    // Add POC details from the data
    if (data.pocDetails && data.pocDetails.length > 0) {
      data.pocDetails.forEach((poc: any) => {
        this.getPocDetails().push(this.formBuilder.group({
          name: [poc.name || '', Validators.required],
          phone: [poc.phone || '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          email: [poc.email || '', [Validators.required, Validators.email]],
          role: [poc.role || '', Validators.required]
        }));
      });
    } else {
      // Add at least one empty POC detail form
      this.getPocDetails().push(this.createPocDetailFormGroup());
    }

    // Set certifications
    this.certificationTags = data.certifications || [];

    // Update form with all available data
    this.profileForm.patchValue({
      // Company Details
      companyName: data.companyName || '',
      website: data.website || '',
      companyAddress: data.companyAddress || '',
      country: data.country || '',
      email: data.email || '',
      companyContactNumber: data.companyContactNumber?.toString() || '',
      yearOfEstablishment: data.yearOfEstablishment ? new Date(data.yearOfEstablishment).toISOString().split('T')[0] : '',
      executiveSummary: data.executiveSummary || '',
      typeOfCompany: data.typeOfCompany || [],
      employeeCount: data.employeeCount?.toString() || '',
      turnover: data.turnover?.toString() || '',
      totalProjectsExecuted: data.totalProjectsExecuted?.toString() || '',
      resourceSharingSupplier: data.resourceSharingSupplier || false,
      subcontractingSupplier: data.subcontractingSupplier || false,

      // Technology and Services
      services: data.services || [],
      technologyStack: data.technologyStack || [],
      product: data.product || [],

      // Cloud and Infrastructure
      cloudPlatforms: data.cloudPlatforms || [],
      devOpsAutomation: data.devOpsAutomation || [],
      containerizationOrchestration: data.containerizationOrchestration || [],

      // Infrastructure and Security
      networkingInfrastructure: data.networkingInfrastructure || [],
      securityIAM: data.securityIAM || [],
      monitoringObservability: data.monitoringObservability || [],
      integrationAPIManagement: data.integrationAPIManagement || [],
      eventStreamingMessaging: data.eventStreamingMessaging || [],

      // Data and Analytics
      databasePlatforms: data.databasePlatforms || [],
      dataAnalyticsBI: data.dataAnalyticsBI || [],
      aiMLPlatforms: data.aiMLPlatforms || [],

      // Enterprise Systems
      erpEnterpriseSystems: data.erpEnterpriseSystems || [],
      crmCustomerPlatforms: data.crmCustomerPlatforms || [],
      itsmITOperations: data.itsmITOperations || [],
      businessAppsProductivity: data.businessAppsProductivity || [],

      // Front-End and Emerging Tech
      eCommerceCMS: data.eCommerceCMS || [],
      learningHRSystems: data.learningHRSystems || [],
      lowCodeNoCodePlatforms: data.lowCodeNoCodePlatforms || [],
      testingQA: data.testingQA || [],
      web3DecentralizedTech: data.web3DecentralizedTech || []
    });

    // Check for "Other" values and set corresponding flags
    this.checkAndSetOtherFlags();

    // Log the form state after population
    console.log('Form values after population:', this.profileForm.value);
  }

  private checkAndSetOtherFlags(): void {
    const checkForOther = (value: any[], setFlag: (flag: boolean) => void) => {
      if (value && value.includes('Other')) {
        setFlag(true);
      }
    };

    checkForOther(this.profileForm.get('services')?.value, (flag) => this.showServicesOther = flag);
    checkForOther(this.profileForm.get('technologyStack')?.value, (flag) => this.showTechnologyStackOther = flag);
    checkForOther(this.profileForm.get('cloudPlatforms')?.value, (flag) => this.showCloudPlatformsOther = flag);
    checkForOther(this.profileForm.get('devOpsAutomation')?.value, (flag) => this.showDevOpsAutomationOther = flag);
    checkForOther(this.profileForm.get('containerizationOrchestration')?.value, (flag) => this.showContainerizationOrchestrationOther = flag);
    checkForOther(this.profileForm.get('networkingInfrastructure')?.value, (flag) => this.showNetworkingInfrastructureOther = flag);
    checkForOther(this.profileForm.get('securityIAM')?.value, (flag) => this.showSecurityIAMOther = flag);
    checkForOther(this.profileForm.get('monitoringObservability')?.value, (flag) => this.showMonitoringObservabilityOther = flag);
    checkForOther(this.profileForm.get('integrationAPIManagement')?.value, (flag) => this.showIntegrationAPIManagementOther = flag);
    checkForOther(this.profileForm.get('eventStreamingMessaging')?.value, (flag) => this.showEventStreamingMessagingOther = flag);
    checkForOther(this.profileForm.get('databasePlatforms')?.value, (flag) => this.showDatabasePlatformsOther = flag);
    checkForOther(this.profileForm.get('dataAnalyticsBI')?.value, (flag) => this.showDataAnalyticsBIOther = flag);
    checkForOther(this.profileForm.get('aiMLPlatforms')?.value, (flag) => this.showAiMLPlatformsOther = flag);
    checkForOther(this.profileForm.get('erpEnterpriseSystems')?.value, (flag) => this.showErpEnterpriseSystemsOther = flag);
    checkForOther(this.profileForm.get('crmCustomerPlatforms')?.value, (flag) => this.showCrmCustomerPlatformsOther = flag);
    checkForOther(this.profileForm.get('itsmITOperations')?.value, (flag) => this.showItsmITOperationsOther = flag);
    checkForOther(this.profileForm.get('businessAppsProductivity')?.value, (flag) => this.showBusinessAppsProductivityOther = flag);
    checkForOther(this.profileForm.get('eCommerceCMS')?.value, (flag) => this.showECommerceCMSOther = flag);
    checkForOther(this.profileForm.get('learningHRSystems')?.value, (flag) => this.showLearningHRSystemsOther = flag);
    checkForOther(this.profileForm.get('lowCodeNoCodePlatforms')?.value, (flag) => this.showLowCodeNoCodePlatformsOther = flag);
    checkForOther(this.profileForm.get('testingQA')?.value, (flag) => this.showTestingQAOther = flag);
    checkForOther(this.profileForm.get('web3DecentralizedTech')?.value, (flag) => this.showWeb3DecentralizedTechOther = flag);
  }

  ngOnInit(): void {
    this.initForm();

    // Subscribe to route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.supplierId = params['id'];
        this.isEditMode = true;
        this.loadExistingProfileData();
      } else {
        // Check for router state data
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state) {
          const supplierData = navigation.extras.state as any;
          this.supplierId = supplierData._id;
          this.isEditMode = true;
          this.populateFormWithExistingData(supplierData);
        } else {
          // If no route param or state, try to get from localStorage
          const userData = this.localStorageService.getLogger();
          if (userData && userData._id) {
            this.supplierId = userData._id;
            this.isEditMode = true;
            this.loadExistingProfileData();
          }
        }
      }
    });

    this.loadTechnologies();
    this.loadServices();
    this.loadProducts();
    this.loadCloudPlatforms();
    this.loadStep3Dropdowns();
    this.loadStep4Dropdowns();

    // Set initial values for all dropdowns
    this.setInitialDropdownValues();

    // Setup subscriptions for "Other" field management
    this.setupOtherFieldSubscriptions();

    // Subscribe to technology stack changes
    this.profileForm.get('technologyStack')?.valueChanges.subscribe(selectedTech => {
      const hasOther = selectedTech?.includes('Other');
      const otherInput = this.profileForm.get('technologyStackOther');

      if (!hasOther) {
        this.showTechnologyStackOther = false;
        otherInput?.setValue('');
        otherInput?.clearValidators();
        otherInput?.markAsUntouched();
      } else {
        this.showTechnologyStackOther = true;
        otherInput?.setValidators([Validators.required]);
        otherInput?.markAsTouched();
      }
      otherInput?.updateValueAndValidity();
    });

    // Subscribe to services changes
    this.profileForm.get('services')?.valueChanges.subscribe(selectedServices => {
      // Handle Pre-Built Software Solutions
      const hasPreBuiltSolutions = selectedServices?.includes('Pre-Built Software Solutions');

      if (hasPreBuiltSolutions && !this.showProductDropdown) {
        this.showProductDropdown = true;
        this.loadProducts();
        // Make products required when Pre-Built Software Solutions is selected
        this.profileForm.get('product')?.setValidators([Validators.required]);
        this.profileForm.get('product')?.updateValueAndValidity();
      } else if (!hasPreBuiltSolutions && this.showProductDropdown) {
        this.showProductDropdown = false;
        this.profileForm.get('product')?.clearValidators();
        this.profileForm.get('product')?.updateValueAndValidity();
        this.profileForm.get('product')?.setValue([]);
      }

      // Handle "Other" option for services
      const hasOther = selectedServices?.includes('Other');
      const otherInput = this.profileForm.get('servicesOther');
      if (!hasOther) {
        this.showServicesOther = false;
        otherInput?.setValue('');
        otherInput?.clearValidators();
        otherInput?.markAsUntouched();
      } else {
        this.showServicesOther = true;
        otherInput?.setValidators([Validators.required]);
        otherInput?.markAsTouched();
      }
      otherInput?.updateValueAndValidity();
    });

    // Subscribe to step changes
    this.profileForm.valueChanges.subscribe(() => {
      // Load data when reaching step 3
      if (this.currentStep === 3) {
        this.loadStep3Dropdowns();
      }
      // Load step 4 data when reaching step 4
      if (this.currentStep === 4) {
        this.loadStep4Dropdowns();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize tooltips after view is initialized
    this.initializeTooltips();
  }

  private initializeTooltips(): void {
    setTimeout(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      Array.from(tooltipTriggerList).map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }, 100);
  }

  private setInitialDropdownValues() {
    const initialValues = {
      cloudPlatforms: ['OVHcloud', 'NTT-Netmagic'],
      devOpsAutomation: [],
      containerizationOrchestration: [],
      networkingInfrastructure: [],
      securityIAM: [],
      monitoringObservability: [],
      integrationAPIManagement: [],
      eventStreamingMessaging: [],
      databasePlatforms: [],
      dataAnalyticsBI: [],
      aiMLPlatforms: [],
      erpEnterpriseSystems: [],
      crmCustomerPlatforms: [],
      itsmITOperations: [],
      businessAppsProductivity: [],
      eCommerceCMS: [],
      learningHRSystems: [],
      lowCodeNoCodePlatforms: [],
      testingQA: [],
      web3DecentralizedTech: [],
      product: [],
      certifications: []
    };

    // Set each value in the form
    Object.entries(initialValues).forEach(([key, value]) => {
      const control = this.profileForm.get(key);
      if (control) {
        control.setValue(value);
      }
    });
  }

  // Add methods to load data from APIs
  loadTechnologies() {
    this.isLoadingTechnologies = true;
    this.superAdminService.getTechnologies().subscribe({
      next: (response) => {
        // Add Other option to technologies
        this.technologies = [...response.data, this.OTHER_OPTION];
        this.isLoadingTechnologies = false;
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
        this.isLoadingTechnologies = false;
      }
    });
  }

  loadServices() {
    this.isLoadingServices = true;
    this.http.get<any>('https://api.westgateithub.com/api/v1/tags?search=')
      .subscribe({
        next: (response) => {
          if (response.status && response.data?.tags) {
            // Add Other option to services
            this.services = [...response.data.tags, this.OTHER_OPTION];
          }
          this.isLoadingServices = false;
        },
        error: (error) => {
          console.error('Error loading services:', error);
          this.isLoadingServices = false;
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

  loadProducts() {
    this.isLoadingProducts = true;
    this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list?type=Product')
      .subscribe({
        next: (response) => {
          if (response.status && response.data) {
            this.products = response.data;
          }
          this.isLoadingProducts = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoadingProducts = false;
        }
      });
  }

  // Add method to load dropdown data by type
  loadDropdownData(type: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.isLoadingDropdownData = true;
      this.http.get<any>(`https://api.westgateithub.com/api/v1/web-user/drop-down-list`, {
        params: { type }
      }).subscribe({
        next: (response) => {
          this.isLoadingDropdownData = false;
          if (response.status && response.data) {
            resolve([...response.data, this.OTHER_OPTION]);
          } else {
            resolve([]);
          }
        },
        error: (error) => {
          console.error(`Error loading ${type} data:`, error);
          this.isLoadingDropdownData = false;
          reject(error);
        }
      });
    });
  }

  // Method to load all dropdowns for step 3
  async loadStep3Dropdowns() {
    try {
      // Load DevOps & Automation data
      this.isLoadingDropdownData = true;
      const devOpsResponse = await this.loadDropdownData('DevOps & Automation');
      this.devOpsList = devOpsResponse;

      // Load Containerization & Orchestration data
      const containerizationResponse = await this.loadDropdownData('Containerization & Orchestration');
      this.containerizationList = containerizationResponse;

      this.isLoadingDropdownData = false;
    } catch (error) {
      console.error('Error loading step 3 dropdowns:', error);
      this.isLoadingDropdownData = false;
    }
  }

  // Add method to load cloud platforms
  loadCloudPlatforms() {
    this.isLoadingCloudPlatforms = true;
    this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
      params: { type: 'Cloud Platforms' }
    }).subscribe({
      next: (response) => {
        console.log('Cloud Platforms response:', response);
        if (response.status && response.data) {
          this.cloudPlatformsList = [...response.data, this.OTHER_OPTION];
        }
        this.isLoadingCloudPlatforms = false;
      },
      error: (error) => {
        console.error('Error loading cloud platforms:', error);
        this.isLoadingCloudPlatforms = false;
      }
    });
  }

  // Add method to load step 5 dropdowns
  async loadStep5Dropdowns() {
    try {
      this.isLoadingStep5Data = true;
      const [
        databaseResponse,
        analyticsResponse,
        aimlResponse
      ] = await Promise.all([
        this.loadDropdownData('Database Platforms'),
        this.loadDropdownData('Data, Analytics & BI'),
        this.loadDropdownData('AI/ML Platforms')
      ]);

      this.databasePlatformsList = databaseResponse;
      this.dataAnalyticsList = analyticsResponse;
      this.aiMlPlatformsList = aimlResponse;

      this.isLoadingStep5Data = false;
    } catch (error) {
      console.error('Error loading step 5 dropdowns:', error);
      this.isLoadingStep5Data = false;
    }
  }

  // Add method to load step 6 dropdowns
  async loadStep6Dropdowns() {
    try {
      this.isLoadingStep6Data = true;
      const [
        erpResponse,
        crmResponse,
        itsmResponse,
        businessAppsResponse
      ] = await Promise.all([
        this.loadDropdownData('ERP/Enterprise Systems'),
        this.loadDropdownData('CRM & Customer Platforms'),
        this.loadDropdownData('ITSM/IT Operations'),
        this.loadDropdownData('Business Apps & Productivity')
      ]);

      this.erpSystemsList = erpResponse;
      this.crmPlatformsList = crmResponse;
      this.itsmList = itsmResponse;
      this.businessAppsList = businessAppsResponse;

      this.isLoadingStep6Data = false;
    } catch (error) {
      console.error('Error loading step 6 dropdowns:', error);
      this.isLoadingStep6Data = false;
    }
  }

  // Add method to load step 7 dropdowns
  async loadStep7Dropdowns() {
    try {
      this.isLoadingStep7Data = true;
      const [
        ecommerceResponse,
        learningResponse,
        lowcodeResponse,
        testingResponse,
        web3Response
      ] = await Promise.all([
        this.loadDropdownData('E-Commerce & CMS'),
        this.loadDropdownData('Learning & HR Systems'),
        this.loadDropdownData('Low-Code/No-Code Platforms'),
        this.loadDropdownData('Testing & QA'),
        this.loadDropdownData('Web3 & Decentralized Tech')
      ]);

      this.eCommerceCmsList = ecommerceResponse;
      this.learningHrSystemsList = learningResponse;
      this.lowCodeNoCodeList = lowcodeResponse;
      this.testingQaList = testingResponse;
      this.web3DecentralizedList = web3Response;

      this.isLoadingStep7Data = false;
    } catch (error) {
      console.error('Error loading step 7 dropdowns:', error);
      this.isLoadingStep7Data = false;
    }
  }

  // Update nextStep method to load data for steps 5-7
  nextStep() {
    console.log('Next Step clicked - Current step:', this.currentStep);
    this.submitted = true;

    // Check if current step form is valid
    const isValid = this.isCurrentStepValid();
    console.log('Current step validation result:', isValid);

    if (isValid) {
      if (this.currentStep < this.totalSteps - 1) { // Don't navigate to step 8 via nextStep
        this.steps[this.currentStep - 1].completed = true;
        this.steps[this.currentStep - 1].active = false;
        this.currentStep++;
        this.steps[this.currentStep - 1].active = true;
        this.submitted = false;

        // Load data based on step
        if (this.currentStep === 3) {
          this.loadCloudPlatforms();
        }
        if (this.currentStep === 4) {
          this.loadStep4Dropdowns();
        }
        if (this.currentStep === 5) {
          this.loadStep5Dropdowns();
        }
        if (this.currentStep === 6) {
          this.loadStep6Dropdowns();
        }
        if (this.currentStep === 7) {
          this.loadStep7Dropdowns();
        }

        this.saveFormData(); // Save after step change
        this.initializeTooltips(); // Reinitialize tooltips after step change
        console.log('Moving to step:', this.currentStep);
      }
    } else {
      console.log('Form validation failed. Current form values:', this.profileForm.value);
      console.log('Form validation errors:', this.getFormValidationErrors());
    }
  }

  previousStep() {
    if (this.currentStep > 1 && this.currentStep < this.totalSteps) { // Don't allow going back from success step
      this.steps[this.currentStep - 1].active = false;
      this.currentStep--;
      this.steps[this.currentStep - 1].active = true;
      this.submitted = false;
      this.saveFormData(); // Save after step change
      this.initializeTooltips(); // Reinitialize tooltips after step change
    }
  }

  // ... rest of the component code ...

    isCurrentStepValid(): boolean {
    console.log('Checking validation for step:', this.currentStep);
    console.log('Form valid state:', this.profileForm.valid);
    console.log('Loading state:', this.loading);

    // Only validate mandatory fields: Company Name, POC Details, and at least one supplier type
    if (this.currentStep === 1) {
      const companyNameValid = this.profileForm.get('companyName')?.valid ?? false;
      const pocDetailsValid = this.validatePocDetails();
      const supplierTypeValid = this.validateSupplierType();

      console.log('Step 1 validation:', {
        companyNameValid,
        pocDetailsValid,
        supplierTypeValid
      });

      return companyNameValid && pocDetailsValid && supplierTypeValid;
    }

    // For all other steps, no validation required
    return true;
  }

  private validatePocDetails(): boolean {
    const pocDetailsArray = this.profileForm.get('pocDetails') as FormArray;
    if (pocDetailsArray.length === 0) {
      return false;
    }

    // Check if at least one POC detail is valid
    for (let i = 0; i < pocDetailsArray.length; i++) {
      const pocGroup = pocDetailsArray.at(i) as FormGroup;
      if (pocGroup.get('name')?.valid &&
          pocGroup.get('phone')?.valid &&
          pocGroup.get('email')?.valid &&
          pocGroup.get('role')?.valid) {
        return true;
      }
    }
    return false;
  }

    validateSupplierType(): boolean {
    const resourceSharing = this.profileForm.get('resourceSharingSupplier')?.value;
    const subcontracting = this.profileForm.get('subcontractingSupplier')?.value;

    // At least one of the supplier types must be selected
    return resourceSharing || subcontracting;
  }

  getProgressPercentage(): number {
    if (this.currentStep === this.totalSteps) {
      return 100; // Success step shows 100%
    }
    return ((this.currentStep - 1) / (this.totalSteps - 2)) * 100;
  }

  private moveToSuccessStep(): void {
    // Mark current step as completed
    this.steps[this.currentStep - 1].completed = true;
    this.steps[this.currentStep - 1].active = false;

    // Move to success step (step 8)
    this.currentStep = 8;
    this.steps[this.currentStep - 1].active = true;
    this.steps[this.currentStep - 1].completed = true;

    // Initialize tooltips for the new step
    this.initializeTooltips();
  }

  onSubmit() {
    // Log button state first
    this.logButtonState();

    console.log('Submit button clicked');
    console.log('Form valid:', this.profileForm.valid);
    console.log('Current step valid:', this.isCurrentStepValid());
    console.log('Loading state:', this.loading);
    console.log('Current step:', this.currentStep);
    console.log('Total steps:', this.totalSteps);
    console.log('Form values:', this.profileForm.value);
    console.log('Form errors:', this.getFormValidationErrors());

    this.submitted = true;

    // Check both step validation and form validation
    if (this.profileForm.valid && this.isCurrentStepValid()) {
      this.loading = true;

      // Get the form values (including disabled controls)
      const formData = { ...this.profileForm.getRawValue() };

      // Ensure typeOfCompany is always an array before submission
      if (formData.typeOfCompany && !Array.isArray(formData.typeOfCompany)) {
        formData.typeOfCompany = [formData.typeOfCompany];
      }

      // Create the registration data structure
      const registrationData = {
        ...formData,
        services: this.combineMainAndOther(formData.services, formData.servicesOther),
        product: formData.product || [],

        // Core services fields
        cloudPlatforms: this.combineMainAndOther(formData.cloudPlatforms, formData.cloudPlatformsOther),
        devOpsAutomation: this.combineMainAndOther(formData.devOpsAutomation, formData.devOpsAutomationOther),
        containerizationOrchestration: this.combineMainAndOther(formData.containerizationOrchestration, formData.containerizationOrchestrationOther),

        // Infrastructure fields
        networkingInfrastructure: this.combineMainAndOther(formData.networkingInfrastructure, formData.networkingInfrastructureOther),
        securityIAM: this.combineMainAndOther(formData.securityIAM, formData.securityIAMOther),
        monitoringObservability: this.combineMainAndOther(formData.monitoringObservability, formData.monitoringObservabilityOther),
        integrationAPIManagement: this.combineMainAndOther(formData.integrationAPIManagement, formData.integrationAPIManagementOther),
        eventStreamingMessaging: this.combineMainAndOther(formData.eventStreamingMessaging, formData.eventStreamingMessagingOther),

        // Data and intelligence fields
        databasePlatforms: this.combineMainAndOther(formData.databasePlatforms, formData.databasePlatformsOther),
        dataAnalyticsBI: this.combineMainAndOther(formData.dataAnalyticsBI, formData.dataAnalyticsBIOther),
        aiMLPlatforms: this.combineMainAndOther(formData.aiMLPlatforms, formData.aiMLPlatformsOther),

        // Enterprise systems fields
        erpEnterpriseSystems: this.combineMainAndOther(formData.erpEnterpriseSystems, formData.erpEnterpriseSystemsOther),
        crmCustomerPlatforms: this.combineMainAndOther(formData.crmCustomerPlatforms, formData.crmCustomerPlatformsOther),
        itsmITOperations: this.combineMainAndOther(formData.itsmITOperations, formData.itsmITOperationsOther),
        businessAppsProductivity: this.combineMainAndOther(formData.businessAppsProductivity, formData.businessAppsProductivityOther),

        // Front-end and emerging tech fields
        eCommerceCMS: this.combineMainAndOther(formData.eCommerceCMS, formData.eCommerceCMSOther),
        learningHRSystems: this.combineMainAndOther(formData.learningHRSystems, formData.learningHRSystemsOther),
        lowCodeNoCodePlatforms: this.combineMainAndOther(formData.lowCodeNoCodePlatforms, formData.lowCodeNoCodePlatformsOther),
        testingQA: this.combineMainAndOther(formData.testingQA, formData.testingQAOther),
        web3DecentralizedTech: this.combineMainAndOther(formData.web3DecentralizedTech, formData.web3DecentralizedTechOther),

        // Basic fields
        companyName: formData.companyName,
        website: formData.website,
        companyAddress: formData.companyAddress,
        country: formData.country,
        email: formData.email,
        companyContactNumber: formData.companyContactNumber,
        yearOfEstablishment: formData.yearOfEstablishment,
        executiveSummary: formData.executiveSummary,
        pocDetails: formData.pocDetails,
        employeeCount: Number(formData.employeeCount),
        turnover: Number(formData.turnover),
        totalProjectsExecuted: Number(formData.totalProjectsExecuted),
        certifications: this.certificationTags,
        resourceSharingSupplier: formData.resourceSharingSupplier,
        subcontractingSupplier: formData.subcontractingSupplier,
        typeOfCompany: formData.typeOfCompany,
        technologyStack: this.combineMainAndOther(formData.technologyStack, formData.technologyStackOther)
      };

      // Call the appropriate API based on edit mode
      if (this.isEditMode && this.supplierId) {
        // Update existing profile
        this.superAdminService.updateUser({
          ...registrationData,
          _id: this.supplierId
        }).subscribe(
          (response: any) => {
            this.loading = false;
            this.successMessage = 'Profile updated successfully!';
            // Clear form data from localStorage
            this.localStorageService.removeItem('profileSetupFormData');
            this.localStorageService.removeItem('profileSetupCurrentStep');
            // Navigate to success step
            this.moveToSuccessStep();
          },
          (error: Error) => {
            this.loading = false;
            this.errorMessage = 'An error occurred while updating. Please try again.';
            console.error('Error during update:', error);
          }
        );
      } else {
        // Register new profile
        this.superAdminService.supplierregister(registrationData).subscribe(
          (response: any) => {
            this.loading = false;
            this.successMessage = 'Registration completed successfully!';
            // Clear form data from localStorage
            this.localStorageService.removeItem('profileSetupFormData');
            this.localStorageService.removeItem('profileSetupCurrentStep');
            // Navigate to success step
            this.moveToSuccessStep();
          },
          (error: Error) => {
            this.loading = false;
            this.errorMessage = 'An error occurred while registering. Please try again.';
            console.error('Error during registration:', error);
          }
        );
      }
    } else {
      console.log('Form validation failed');
      console.log('Form validation errors:', this.getFormValidationErrors());
      console.log('Step validation result:', this.isCurrentStepValid());
    }
  }

  // Helper method to combine main field values with other field value
  private combineMainAndOther(mainValues: string[], otherValue: string): string[] {
    if (!mainValues) mainValues = [];
    if (otherValue && otherValue.trim()) {
      return [...mainValues, otherValue.trim()];
    }
    return mainValues;
  }

  // Update the setupOtherFieldSubscriptions method to handle all fields
  private setupOtherFieldSubscriptions() {
    const fieldsWithOther = {
      cloudPlatforms: { otherField: 'cloudPlatformsOther', showProperty: 'showCloudPlatformsOther' },
      devOpsAutomation: { otherField: 'devOpsAutomationOther', showProperty: 'showDevOpsAutomationOther' },
      containerizationOrchestration: { otherField: 'containerizationOrchestrationOther', showProperty: 'showContainerizationOrchestrationOther' },
      networkingInfrastructure: { otherField: 'networkingInfrastructureOther', showProperty: 'showNetworkingInfrastructureOther' },
      securityIAM: { otherField: 'securityIAMOther', showProperty: 'showSecurityIAMOther' },
      monitoringObservability: { otherField: 'monitoringObservabilityOther', showProperty: 'showMonitoringObservabilityOther' },
      integrationAPIManagement: { otherField: 'integrationAPIManagementOther', showProperty: 'showIntegrationAPIManagementOther' },
      eventStreamingMessaging: { otherField: 'eventStreamingMessagingOther', showProperty: 'showEventStreamingMessagingOther' },
      databasePlatforms: { otherField: 'databasePlatformsOther', showProperty: 'showDatabasePlatformsOther' },
      dataAnalyticsBI: { otherField: 'dataAnalyticsBIOther', showProperty: 'showDataAnalyticsBIOther' },
      aiMLPlatforms: { otherField: 'aiMLPlatformsOther', showProperty: 'showAiMLPlatformsOther' },
      erpEnterpriseSystems: { otherField: 'erpEnterpriseSystemsOther', showProperty: 'showErpEnterpriseSystemsOther' },
      crmCustomerPlatforms: { otherField: 'crmCustomerPlatformsOther', showProperty: 'showCrmCustomerPlatformsOther' },
      itsmITOperations: { otherField: 'itsmITOperationsOther', showProperty: 'showItsmITOperationsOther' },
      businessAppsProductivity: { otherField: 'businessAppsProductivityOther', showProperty: 'showBusinessAppsProductivityOther' },
      eCommerceCMS: { otherField: 'eCommerceCMSOther', showProperty: 'showECommerceCMSOther' },
      learningHRSystems: { otherField: 'learningHRSystemsOther', showProperty: 'showLearningHRSystemsOther' },
      lowCodeNoCodePlatforms: { otherField: 'lowCodeNoCodePlatformsOther', showProperty: 'showLowCodeNoCodePlatformsOther' },
      testingQA: { otherField: 'testingQAOther', showProperty: 'showTestingQAOther' },
      web3DecentralizedTech: { otherField: 'web3DecentralizedTechOther', showProperty: 'showWeb3DecentralizedTechOther' }
    };

    Object.entries(fieldsWithOther).forEach(([mainField, config]) => {
      const control = this.profileForm.get(mainField);
      const otherControl = this.profileForm.get(config.otherField);

      if (control && otherControl) {
        // Initially hide the "Other" field
        (this as any)[config.showProperty] = false;
        otherControl.setValue('');

        // Subscribe to main field changes
        control.valueChanges.subscribe(values => {
          if (values?.includes('Other')) {
            (this as any)[config.showProperty] = true;
            otherControl.setValidators([Validators.required]);
            otherControl.markAsTouched(); // Mark as touched to show validation immediately
          } else {
            (this as any)[config.showProperty] = false;
            otherControl.setValue('');
            otherControl.clearValidators();
            otherControl.markAsUntouched();
          }
          otherControl.updateValueAndValidity();
        });
      }
    });
  }

  // Helper method to check if a field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }

  // Add POC details methods
  addPocDetail() {
    const pocFormGroup = this.formBuilder.group({
      name: [''],
      phone: [''],
      email: ['', [Validators.email]],
      role: ['']
    });

    const pocDetails = this.profileForm.get('pocDetails') as FormArray;
    pocDetails.push(pocFormGroup);
  }

  removePocDetail(index: number) {
    const pocDetails = this.profileForm.get('pocDetails') as FormArray;
    if (pocDetails.length > 1) { // Keep at least one POC
      pocDetails.removeAt(index);
    }
  }

  getPocDetails(): FormArray {
    return this.profileForm.get('pocDetails') as FormArray;
  }

  // Add this method specifically for template iteration
  getPocDetailsControls() {
    return (this.profileForm.get('pocDetails') as FormArray).controls;
  }

  addTag(event: any) {
    const input = event.target;
    const value = input.value.trim();
    if (value) {
      this.certificationTags.push(value);
      input.value = '';
    }
  }

  removeTag(index: number) {
    this.certificationTags.splice(index, 1);
  }

  // Add helper method to get form validation errors
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  logButtonState() {
    console.log('Button clicked');
    console.log('Disabled state:', this.loading || !this.isCurrentStepValid());
    console.log('Loading:', this.loading);
    console.log('Step valid:', this.isCurrentStepValid());
    console.log('Current step:', this.currentStep);
    console.log('Total steps:', this.totalSteps);
  }
}
