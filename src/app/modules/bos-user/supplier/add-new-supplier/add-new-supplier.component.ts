import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

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

interface SubExpertise {
  _id: string;
  name: string;
}

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
}

@Component({
  selector: 'app-add-new-supplier',
  templateUrl: './add-new-supplier.component.html',
  styleUrls: ['./add-new-supplier.component.scss']
})
export class BossUserAddNewSupplierComponent implements OnInit {
  companyForm: any = {};
  showLoader: boolean = false;
  showSupplierTypeError: boolean = false;
  currentExpertise: string = '';
  currentSubExpertise: string = '';
  selectedExpertise: ExpertiseItem | null = null;
  selectedSubExpertise: string[] = [];
  selectedExpertiseName: string = '';
  currentExpertiseIndex: number = -1;
  subExpertiseOptions: string[] = [];
  subExpertiseInput$ = new Subject<string>();
  randomString: string = '';
  today: string = new Date().toISOString().split('T')[0];
  expertiseDropdownOptions: ExpertiseItem[] = [];
  inHoldComment: string = '';
  categoryDomains: any[] = [];
  selectedCategories: string[] = [];
  technologiesList: any[] = [];
  selectedTechnologies: string[] = [];
  industryList: any[] = [];
  selectedIndustries: string[] = [];

  constructor(
    private superadminService: SuperadminService,
    private notificationService: NotificationService,
    private http: HttpClient
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
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getExpertiseDropdownData();
    this.getSubExpertiseDropdownData();
    this.getCategoryDomains();
    this.getTechnologiesList();
    this.getIndustryList();

    // Add some fallback sub-expertise options in case the API fails
    if (this.subExpertiseOptions.length === 0) {
      this.addFallbackSubExpertiseOptions();
    }
  }

  initializeForm() {
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

    // Check if all expertise items have at least one sub-expertise
    if (this.companyForm.expertise.length > 0) {
      const missingSubExpertise = this.companyForm.expertise.some((expertise: any) =>
        !expertise.subExpertise || expertise.subExpertise.length === 0
      );

      if (missingSubExpertise) {
        this.notificationService.showError('Each expertise must have at least one sub-expertise');
        return;
      }
    }

    // Ensure selected categories, industries, and technologies are in the form data
    this.onCategoryChange();
    this.onIndustryChange();
    this.onTechnologiesChange();

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
    if (this.inHoldComment?.trim()) {
      formData.inHoldComment = [
        {
          comment: this.inHoldComment.trim()
        }
      ];
    } else {
      formData.inHoldComment = [];
    }

    console.log('Submitting Data (with selected values):', formData);
    this.showLoader = true;
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
      this.notificationService.showError(error?.error?.message || error?.message);
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

  hasInvalidExpertise(): boolean {
    if (!this.companyForm.expertise || this.companyForm.expertise.length === 0) {
      return false; // No expertise selected yet, so not invalid
    }

    return this.companyForm.expertise.some((exp: any) =>
      !exp.subExpertise || exp.subExpertise.length === 0
    );
  }

  addMultipleSubExpertise(expertiseIndex: number) {
    console.log('Adding multiple sub-expertise:', this.selectedSubExpertise, 'to expertise index:', expertiseIndex);

    if (this.selectedSubExpertise && this.selectedSubExpertise.length > 0) {
      // Get existing sub-expertise as a Set for faster lookup
      const existingSubExpertise = new Set(this.companyForm.expertise[expertiseIndex].subExpertise);

      // Add each selected sub-expertise that doesn't already exist
      for (const subExp of this.selectedSubExpertise) {
        if (!existingSubExpertise.has(subExp)) {
          this.companyForm.expertise[expertiseIndex].subExpertise.push(subExp);
        }
      }

      console.log('Updated sub-expertise list:', this.companyForm.expertise[expertiseIndex].subExpertise);

      // Clear the selection
      this.selectedSubExpertise = [];
    } else {
      console.log('No sub-expertise selected');
    }
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
          this.notificationService.showWarning('This expertise is already added');
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
      this.companyForm.category = [...this.selectedCategories];
    } else {
      this.companyForm.category = [];
    }
    console.log('Updated categories in form:', this.companyForm.category);
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
      this.companyForm.technologies = [...this.selectedTechnologies];
    } else {
      this.companyForm.technologies = [];
    }
    console.log('Updated technologies in form:', this.companyForm.technologies);
  }

  // Renamed method for adding custom technology items
  onItemAddTechnology(event: any) {
    if (event) {
      console.log('Adding custom technology:', event);
      // If it's a string from addTag
      if (typeof event === 'string') {
        // Check if the object with this value already exists
        const exists = this.technologiesList.some(item => item.value === event);
        if (!exists) {
          this.technologiesList.push({ name: event, value: event });
        }
      } else if (event && event.value) {
        // It's an object from the selection
        const exists = this.technologiesList.some(item => item.value === event.value);
        if (!exists) {
          this.technologiesList.push(event);
        }
      }
    }
  }

  getIndustryList() {
    this.showLoader = true;
    const url = `${environment.baseUrl}/web-user/sub-expertise/list`;
    console.log('Fetching industry data from URL:', url);

    this.http.get<any>(url).subscribe(
      (response) => {
        console.log('Raw industry API response:', response);
        if (response?.status) {
          // Process the data
          if (response.data && Array.isArray(response.data)) {
            if (response.data.length > 0) {
              if (typeof response.data[0] === 'object') {
                // If response.data contains objects, format them for ng-select
                this.industryList = response.data.map((item: any) => {
                  return {
                    name: item.name || item.value || item.subExpertise || item.expertise || JSON.stringify(item),
                    value: item.name || item.value || item.subExpertise || item.expertise || JSON.stringify(item)
                  };
                });
              } else {
                // If data is already an array of strings
                this.industryList = response.data.map((item: string) => {
                  return {
                    name: item,
                    value: item
                  };
                });
              }
            }
          } else {
            this.industryList = [];
          }
          console.log('Processed industry list for ng-select:', this.industryList);
        } else {
          console.error('Failed to fetch industry data:', response?.message);
          this.notificationService.showError('Failed to fetch industry data');
          this.industryList = [];
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching industry data:', error);
        this.notificationService.showError('Error fetching industry data');
        this.showLoader = false;
        this.industryList = [];
      }
    );
  }

  // Updated method to handle changes in the industry ng-select component
  onIndustryChange() {
    if (this.selectedIndustries && this.selectedIndustries.length > 0) {
      // Extract just the values/names directly to the form array
      this.companyForm.industryFocus = [...this.selectedIndustries];
    } else {
      this.companyForm.industryFocus = [];
    }
    console.log('Updated industry focus in form:', this.companyForm.industryFocus);
  }

  // Add method for adding custom industry items
  onItemAddIndustry(event: any) {
    if (event) {
      console.log('Adding custom industry:', event);
      // If it's a string from addTag
      if (typeof event === 'string') {
        // Check if the object with this value already exists
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
}
