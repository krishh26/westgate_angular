import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

@Component({
  selector: 'app-add-new-supplier',
  templateUrl: './add-new-supplier.component.html',
  styleUrls: ['./add-new-supplier.component.scss']
})
export class BossUserAddNewSupplierComponent implements OnInit, AfterViewInit {
  currentStep: number = 1;
  totalSteps: number = 8;
  profileForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentDate: string = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  certificationTags: string[] = [];

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

  // Add properties for step 6 dropdowns
  erpSystemsList: any[] = [];
  crmPlatformsList: any[] = [];
  itsmList: any[] = [];
  businessAppsList: any[] = [];

  // Add properties for step 7 dropdowns
  eCommerceCmsList: any[] = [];
  learningHrSystemsList: any[] = [];
  lowCodeNoCodeList: any[] = [];
  testingQaList: any[] = [];
  web3DecentralizedList: any[] = [];

  // Add loading states for each step
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

  // Tag arrays for 'Other' fields in steps 2-7
  servicesOtherTags: string[] = [];
  technologyStackOtherTags: string[] = [];
  cloudPlatformsOtherTags: string[] = [];
  devOpsAutomationOtherTags: string[] = [];
  containerizationOrchestrationOtherTags: string[] = [];
  networkingInfrastructureOtherTags: string[] = [];
  securityIAMOtherTags: string[] = [];
  monitoringObservabilityOtherTags: string[] = [];
  integrationAPIManagementOtherTags: string[] = [];
  eventStreamingMessagingOtherTags: string[] = [];
  databasePlatformsOtherTags: string[] = [];
  dataAnalyticsBIOtherTags: string[] = [];
  aiMLPlatformsOtherTags: string[] = [];
  erpEnterpriseSystemsOtherTags: string[] = [];
  crmCustomerPlatformsOtherTags: string[] = [];
  itsmITOperationsOtherTags: string[] = [];
  businessAppsProductivityOtherTags: string[] = [];
  eCommerceCMSOtherTags: string[] = [];
  learningHRSystemsOtherTags: string[] = [];
  lowCodeNoCodePlatformsOtherTags: string[] = [];
  testingQAOtherTags: string[] = [];
  web3DecentralizedTechOtherTags: string[] = [];

  // Tag add/remove methods for each field
  addServicesOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.servicesOtherTags.includes(value)) {
      this.servicesOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeServicesOtherTag(index: number) { this.servicesOtherTags.splice(index, 1); }

  addTechnologyStackOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.technologyStackOtherTags.includes(value)) {
      this.technologyStackOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeTechnologyStackOtherTag(index: number) { this.technologyStackOtherTags.splice(index, 1); }

  addCloudPlatformsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.cloudPlatformsOtherTags.includes(value)) {
      this.cloudPlatformsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeCloudPlatformsOtherTag(index: number) { this.cloudPlatformsOtherTags.splice(index, 1); }

  addDevOpsAutomationOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.devOpsAutomationOtherTags.includes(value)) {
      this.devOpsAutomationOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeDevOpsAutomationOtherTag(index: number) { this.devOpsAutomationOtherTags.splice(index, 1); }

  addContainerizationOrchestrationOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.containerizationOrchestrationOtherTags.includes(value)) {
      this.containerizationOrchestrationOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeContainerizationOrchestrationOtherTag(index: number) { this.containerizationOrchestrationOtherTags.splice(index, 1); }

  addNetworkingInfrastructureOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.networkingInfrastructureOtherTags.includes(value)) {
      this.networkingInfrastructureOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeNetworkingInfrastructureOtherTag(index: number) { this.networkingInfrastructureOtherTags.splice(index, 1); }

  addSecurityIAMOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.securityIAMOtherTags.includes(value)) {
      this.securityIAMOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeSecurityIAMOtherTag(index: number) { this.securityIAMOtherTags.splice(index, 1); }

  addMonitoringObservabilityOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.monitoringObservabilityOtherTags.includes(value)) {
      this.monitoringObservabilityOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeMonitoringObservabilityOtherTag(index: number) { this.monitoringObservabilityOtherTags.splice(index, 1); }

  addIntegrationAPIManagementOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.integrationAPIManagementOtherTags.includes(value)) {
      this.integrationAPIManagementOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeIntegrationAPIManagementOtherTag(index: number) { this.integrationAPIManagementOtherTags.splice(index, 1); }

  addEventStreamingMessagingOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.eventStreamingMessagingOtherTags.includes(value)) {
      this.eventStreamingMessagingOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeEventStreamingMessagingOtherTag(index: number) { this.eventStreamingMessagingOtherTags.splice(index, 1); }

  addDatabasePlatformsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.databasePlatformsOtherTags.includes(value)) {
      this.databasePlatformsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeDatabasePlatformsOtherTag(index: number) { this.databasePlatformsOtherTags.splice(index, 1); }

  addDataAnalyticsBIOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.dataAnalyticsBIOtherTags.includes(value)) {
      this.dataAnalyticsBIOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeDataAnalyticsBIOtherTag(index: number) { this.dataAnalyticsBIOtherTags.splice(index, 1); }

  addAiMLPlatformsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.aiMLPlatformsOtherTags.includes(value)) {
      this.aiMLPlatformsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeAiMLPlatformsOtherTag(index: number) { this.aiMLPlatformsOtherTags.splice(index, 1); }

  addErpEnterpriseSystemsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.erpEnterpriseSystemsOtherTags.includes(value)) {
      this.erpEnterpriseSystemsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeErpEnterpriseSystemsOtherTag(index: number) { this.erpEnterpriseSystemsOtherTags.splice(index, 1); }

  addCrmCustomerPlatformsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.crmCustomerPlatformsOtherTags.includes(value)) {
      this.crmCustomerPlatformsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeCrmCustomerPlatformsOtherTag(index: number) { this.crmCustomerPlatformsOtherTags.splice(index, 1); }

  addItsmITOperationsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.itsmITOperationsOtherTags.includes(value)) {
      this.itsmITOperationsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeItsmITOperationsOtherTag(index: number) { this.itsmITOperationsOtherTags.splice(index, 1); }

  addBusinessAppsProductivityOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.businessAppsProductivityOtherTags.includes(value)) {
      this.businessAppsProductivityOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeBusinessAppsProductivityOtherTag(index: number) { this.businessAppsProductivityOtherTags.splice(index, 1); }

  addECommerceCMSOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.eCommerceCMSOtherTags.includes(value)) {
      this.eCommerceCMSOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeECommerceCMSOtherTag(index: number) { this.eCommerceCMSOtherTags.splice(index, 1); }

  addLearningHRSystemsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.learningHRSystemsOtherTags.includes(value)) {
      this.learningHRSystemsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeLearningHRSystemsOtherTag(index: number) { this.learningHRSystemsOtherTags.splice(index, 1); }

  addLowCodeNoCodePlatformsOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.lowCodeNoCodePlatformsOtherTags.includes(value)) {
      this.lowCodeNoCodePlatformsOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeLowCodeNoCodePlatformsOtherTag(index: number) { this.lowCodeNoCodePlatformsOtherTags.splice(index, 1); }

  addTestingQAOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.testingQAOtherTags.includes(value)) {
      this.testingQAOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeTestingQAOtherTag(index: number) { this.testingQAOtherTags.splice(index, 1); }

  addWeb3DecentralizedTechOtherTag(event: any) {
    const value = event.target.value.trim();
    if (value && !this.web3DecentralizedTechOtherTags.includes(value)) {
      this.web3DecentralizedTechOtherTags.push(value);
      event.target.value = '';
    }
  }
  removeWeb3DecentralizedTechOtherTag(index: number) { this.web3DecentralizedTechOtherTags.splice(index, 1); }

  constructor(
    private formBuilder: FormBuilder,
    private superadminservice: SuperadminService,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient
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
      cloudPlatforms: [[]],
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
    // This method is no longer needed as localStorage is removed
  }

  private checkEditMode(): void {
    // This method is no longer needed as edit functionality is removed
  }

  private loadExistingProfileData(): void {
    // This method is no longer needed as edit functionality is removed
  }

  private populateFormWithExistingData(data: any): void {
    // This method is no longer needed as edit functionality is removed
  }

  ngOnInit(): void {
    this.initForm();
    this.loadTechnologies();
    this.loadServices();
    this.loadProducts();
    this.loadCloudPlatforms();
    this.loadStep3Dropdowns();
    this.loadStep4Dropdowns();
    this.loadStep5Dropdowns(); // Load step 5 data on init
    this.loadStep6Dropdowns(); // Load step 6 data on init
    this.loadStep7Dropdowns(); // Load step 7 data on init

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
      // Load step 5 data when reaching step 5
      if (this.currentStep === 5) {
        this.loadStep5Dropdowns();
      }
      // Load step 6 data when reaching step 6
      if (this.currentStep === 6) {
        this.loadStep6Dropdowns();
      }
      // Load step 7 data when reaching step 7
      if (this.currentStep === 7) {
        this.loadStep7Dropdowns();
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
      cloudPlatforms: [],
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
    this.superadminservice.getTechnologies().subscribe({
      next: (response:any) => {
        // Add Other option to technologies
        this.technologies = [...response.data, this.OTHER_OPTION];
        this.isLoadingTechnologies = false;
      },
      error: (error:any) => {
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
      this.http.get<any>(`https://api.westgateithub.com/api/v1/web-user/drop-down-list?type=${type}`)
        .subscribe({
          next: (response) => {
            this.isLoadingDropdownData = false;
            if (response.status && response.data) {
              resolve(response.data);
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
      const devOpsResponse = await this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
        params: { type: 'DevOps & Automation' }
      }).toPromise();

      if (devOpsResponse.status && devOpsResponse.data) {
        this.devOpsList = [...devOpsResponse.data, this.OTHER_OPTION];
      }

      // Load Containerization & Orchestration data
      const containerizationResponse = await this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
        params: { type: 'Containerization & Orchestration' }
      }).toPromise();

      if (containerizationResponse.status && containerizationResponse.data) {
        this.containerizationList = [...containerizationResponse.data, this.OTHER_OPTION];
      }

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
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Database Platforms' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Data, Analytics & BI' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'AI/ML Platforms' }
        }).toPromise()
      ]);

      if (databaseResponse.status && databaseResponse.data) {
        this.databasePlatformsList = [...databaseResponse.data, this.OTHER_OPTION];
      }
      if (analyticsResponse.status && analyticsResponse.data) {
        this.dataAnalyticsList = [...analyticsResponse.data, this.OTHER_OPTION];
      }
      if (aimlResponse.status && aimlResponse.data) {
        this.aiMlPlatformsList = [...aimlResponse.data, this.OTHER_OPTION];
      }

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
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'ERP/Enterprise Systems' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'CRM & Customer Platforms' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'ITSM/IT Operations' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Business Apps & Productivity' }
        }).toPromise()
      ]);

      if (erpResponse.status && erpResponse.data) {
        this.erpSystemsList = [...erpResponse.data, this.OTHER_OPTION];
      }
      if (crmResponse.status && crmResponse.data) {
        this.crmPlatformsList = [...crmResponse.data, this.OTHER_OPTION];
      }
      if (itsmResponse.status && itsmResponse.data) {
        this.itsmList = [...itsmResponse.data, this.OTHER_OPTION];
      }
      if (businessAppsResponse.status && businessAppsResponse.data) {
        this.businessAppsList = [...businessAppsResponse.data, this.OTHER_OPTION];
      }

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
        lowCodeResponse,
        testingResponse,
        web3Response
      ] = await Promise.all([
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'E-Commerce & CMS' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Learning & HR Systems' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Low-Code/No-Code Platforms' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Testing & QA' }
        }).toPromise(),
        this.http.get<any>('https://api.westgateithub.com/api/v1/web-user/drop-down-list', {
          params: { type: 'Web3 & Decentralized Tech' }
        }).toPromise()
      ]);

      if (ecommerceResponse.status && ecommerceResponse.data) {
        this.eCommerceCmsList = [...ecommerceResponse.data, this.OTHER_OPTION];
      }
      if (learningResponse.status && learningResponse.data) {
        this.learningHrSystemsList = [...learningResponse.data, this.OTHER_OPTION];
      }
      if (lowCodeResponse.status && lowCodeResponse.data) {
        this.lowCodeNoCodeList = [...lowCodeResponse.data, this.OTHER_OPTION];
      }
      if (testingResponse.status && testingResponse.data) {
        this.testingQaList = [...testingResponse.data, this.OTHER_OPTION];
      }
      if (web3Response.status && web3Response.data) {
        this.web3DecentralizedList = [...web3Response.data, this.OTHER_OPTION];
      }

      this.isLoadingStep7Data = false;
    } catch (error) {
      console.error('Error loading step 7 dropdowns:', error);
      this.isLoadingStep7Data = false;
    }
  }

  // Update existing nextStep method to load cloud platforms data
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

        // Load data based on the step
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
        services: this.combineMainAndOther(formData.services, this.servicesOtherTags),
        product: formData.product || [],
        technologyStack: this.combineMainAndOther(formData.technologyStack, this.technologyStackOtherTags),
        cloudPlatforms: this.combineMainAndOther(formData.cloudPlatforms, this.cloudPlatformsOtherTags),
        devOpsAutomation: this.combineMainAndOther(formData.devOpsAutomation, this.devOpsAutomationOtherTags),
        containerizationOrchestration: this.combineMainAndOther(formData.containerizationOrchestration, this.containerizationOrchestrationOtherTags),
        networkingInfrastructure: this.combineMainAndOther(formData.networkingInfrastructure, this.networkingInfrastructureOtherTags),
        securityIAM: this.combineMainAndOther(formData.securityIAM, this.securityIAMOtherTags),
        monitoringObservability: this.combineMainAndOther(formData.monitoringObservability, this.monitoringObservabilityOtherTags),
        integrationAPIManagement: this.combineMainAndOther(formData.integrationAPIManagement, this.integrationAPIManagementOtherTags),
        eventStreamingMessaging: this.combineMainAndOther(formData.eventStreamingMessaging, this.eventStreamingMessagingOtherTags),
        databasePlatforms: this.combineMainAndOther(formData.databasePlatforms, this.databasePlatformsOtherTags),
        dataAnalyticsBI: this.combineMainAndOther(formData.dataAnalyticsBI, this.dataAnalyticsBIOtherTags),
        aiMLPlatforms: this.combineMainAndOther(formData.aiMLPlatforms, this.aiMLPlatformsOtherTags),
        erpEnterpriseSystems: this.combineMainAndOther(formData.erpEnterpriseSystems, this.erpEnterpriseSystemsOtherTags),
        crmCustomerPlatforms: this.combineMainAndOther(formData.crmCustomerPlatforms, this.crmCustomerPlatformsOtherTags),
        itsmITOperations: this.combineMainAndOther(formData.itsmITOperations, this.itsmITOperationsOtherTags),
        businessAppsProductivity: this.combineMainAndOther(formData.businessAppsProductivity, this.businessAppsProductivityOtherTags),
        eCommerceCMS: this.combineMainAndOther(formData.eCommerceCMS, this.eCommerceCMSOtherTags),
        learningHRSystems: this.combineMainAndOther(formData.learningHRSystems, this.learningHRSystemsOtherTags),
        lowCodeNoCodePlatforms: this.combineMainAndOther(formData.lowCodeNoCodePlatforms, this.lowCodeNoCodePlatformsOtherTags),
        testingQA: this.combineMainAndOther(formData.testingQA, this.testingQAOtherTags),
        web3DecentralizedTech: this.combineMainAndOther(formData.web3DecentralizedTech, this.web3DecentralizedTechOtherTags),
        // Basic fields
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
        // companyName property is already included above, so no need to repeat it
        // technologyStack: this.combineMainAndOther(formData.technologyStack, this.technologyStackOtherTags)
      };

      // --- ADDITION: Call createCustomExpertise for each new custom tag ---
      const customTagCalls: any[] = [];
      // Helper to add calls for a tag array and type
      const addCustomTags = (tags: string[], type: string, existingList: any[] = []) => {
        if (!tags) return;
        tags.forEach(tag => {
          if (tag && tag.trim() && (!existingList || !existingList.some((item: any) => (item.name || item) === tag))) {
            customTagCalls.push(this.superadminservice.createCustomExpertise({ name: tag.trim(), type }));
          }
        });
      };
      // Add for each field
      addCustomTags(this.servicesOtherTags, 'Service', this.services);
      addCustomTags(this.technologyStackOtherTags, 'Technology Stack', this.technologies);
      addCustomTags(this.cloudPlatformsOtherTags, 'Cloud Platforms', this.cloudPlatformsList);
      addCustomTags(this.devOpsAutomationOtherTags, 'DevOps & Automation', this.devOpsList);
      addCustomTags(this.containerizationOrchestrationOtherTags, 'Containerization & Orchestration', this.containerizationList);
      addCustomTags(this.networkingInfrastructureOtherTags, 'Networking & Infrastructure', this.networkingList);
      addCustomTags(this.securityIAMOtherTags, 'Security & IAM', this.securityList);
      addCustomTags(this.monitoringObservabilityOtherTags, 'Monitoring & Observability', this.monitoringList);
      addCustomTags(this.integrationAPIManagementOtherTags, 'Integration & API Management', this.apiManagementList);
      addCustomTags(this.eventStreamingMessagingOtherTags, 'Event Streaming & Messaging', this.eventStreamingList);
      addCustomTags(this.databasePlatformsOtherTags, 'Database Platforms', this.databasePlatformsList);
      addCustomTags(this.dataAnalyticsBIOtherTags, 'Data, Analytics & BI', this.dataAnalyticsList);
      addCustomTags(this.aiMLPlatformsOtherTags, 'AI/ML Platforms', this.aiMlPlatformsList);
      addCustomTags(this.erpEnterpriseSystemsOtherTags, 'ERP/Enterprise Systems', this.erpSystemsList);
      addCustomTags(this.crmCustomerPlatformsOtherTags, 'CRM & Customer Platforms', this.crmPlatformsList);
      addCustomTags(this.itsmITOperationsOtherTags, 'ITSM/IT Operations', this.itsmList);
      addCustomTags(this.businessAppsProductivityOtherTags, 'Business Apps & Productivity', this.businessAppsList);
      addCustomTags(this.eCommerceCMSOtherTags, 'E-Commerce & CMS', this.eCommerceCmsList);
      addCustomTags(this.learningHRSystemsOtherTags, 'Learning & HR Systems', this.learningHrSystemsList);
      addCustomTags(this.lowCodeNoCodePlatformsOtherTags, 'Low-Code/No-Code Platforms', this.lowCodeNoCodeList);
      addCustomTags(this.testingQAOtherTags, 'Testing & QA', this.testingQaList);
      addCustomTags(this.web3DecentralizedTechOtherTags, 'Web3 & Decentralized Tech', this.web3DecentralizedList);

      // Wait for all custom tag API calls to finish, then submit registration
      Promise.all(customTagCalls.map(obs => obs.toPromise ? obs.toPromise() : obs)).then(() => {
        // Call the register API
        this.superadminservice.supplierregister(registrationData).subscribe(
          (response: any) => {
            this.loading = false;
            this.successMessage = 'Registration completed successfully!';
            // Navigate to success step
            this.moveToSuccessStep();
          },
          (error: Error) => {
            this.loading = false;
            this.errorMessage = 'An error occurred while registering. Please try again.';
            console.error('Error during registration:', error);
          }
        );
      }).catch(error => {
        this.loading = false;
        this.errorMessage = 'An error occurred while adding custom expertise. Please try again.';
        console.error('Error during custom expertise creation:', error);
      });
    } else {
      console.log('Form validation failed');
      console.log('Form validation errors:', this.getFormValidationErrors());
      console.log('Step validation result:', this.isCurrentStepValid());
    }
  }

  // Helper method to combine main field values with other field value
  private combineMainAndOther(mainValues: string[], otherValues: string[] | string): string[] {
    if (!mainValues) mainValues = [];
    // Remove 'Other' from the main values
    const filteredMain = mainValues.filter(v => v !== 'Other');
    if (Array.isArray(otherValues) && otherValues.length > 0) {
      return [...filteredMain, ...otherValues.map(v => v.trim()).filter(v => v)];
    } else if (typeof otherValues === 'string' && otherValues.trim()) {
      return [...filteredMain, otherValues.trim()];
    }
    return filteredMain;
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
        control.valueChanges.subscribe((values:any) => {
          if (values?.includes('Other')) {
            (this as any)[config.showProperty] = true;
            // Do NOT set Validators.required, just clear validators and set value to ''
            otherControl.clearValidators();
            otherControl.setValue('');
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

  getPocDetails() {
    return (this.profileForm.get('pocDetails') as FormArray)?.controls || [];
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
