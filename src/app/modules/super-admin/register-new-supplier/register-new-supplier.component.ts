import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

interface Expertise {
  name: string;
  subExpertise: null;
}

@Component({
  selector: 'app-register-new-supplier',
  templateUrl: './register-new-supplier.component.html',
  styleUrls: ['./register-new-supplier.component.css']
})
export class RegisterNewSupplierComponent implements OnInit {
  companyForm: any = {};
  showLoader: boolean = false;
  currentExpertise: string = '';

  constructor(
    private superadminService: SuperadminService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.companyForm = {
      name: '',
      website: '',
      yearOfEstablishment: '',
      registerNumber: '',
      typeOfCompany: '',
      industry_Sector: '',
      companyAddress: '',
      developerOrEngineerTeams: '',
      dataPrivacyPolicies: '',
      securityCertifications: '',
      email: '',
      number: '',
      customerSupportContact: '',
      VATOrGSTNumber: '',
      companyDirectors_Owners: '',
      complianceCertifications: '',
      products_ServicesOffered: '',
      technologyStack: '',
      licensingDetails: '',
      IP_Patents: '',
      password: '',
      employeeCount: '',
      cybersecurityPractices: '',
      otheremployeeCount: '',
      expertise: [],
      certifications: '',
      poc_details: ''
    };
  }

  addExpertise() {
    if (this.currentExpertise) {
      this.companyForm.expertise.push({
        name: this.currentExpertise.trim(),
        subExpertise: null
      });
      this.currentExpertise = '';
    }
  }

  removeExpertise(index: number) {
    this.companyForm.expertise.splice(index, 1);
  }

  submitForm() {
    console.log('Submitting Data:', this.companyForm);
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
}
