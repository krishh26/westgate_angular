import { Component } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-add-new-supplier',
  templateUrl: './add-new-supplier.component.html',
  styleUrls: ['./add-new-supplier.component.scss']
})
export class BossUserAddNewSupplierComponent {
  companyForm: any = {};
  showLoader: boolean = false;
  currentExpertise: string = '';
  currentSubExpertise: string = '';
  randomString: string = '';
  today: string = new Date().toISOString().split('T')[0];

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
      keyClients: []
    };
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
    if (this.companyForm.yearOfEstablishment) {
      const date = new Date(this.companyForm.yearOfEstablishment);
      this.companyForm.yearOfEstablishment = date.toISOString().split('T')[0];
    }
    this.superadminService.supplierregister(this.companyForm).subscribe((response) => {
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
      this.notificationService.showError(error?.message);
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
}
