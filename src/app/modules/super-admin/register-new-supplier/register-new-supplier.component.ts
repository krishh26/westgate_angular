import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-register-new-supplier',
  templateUrl: './register-new-supplier.component.html',
  styleUrls: ['./register-new-supplier.component.css']
})
export class RegisterNewSupplierComponent implements OnInit {
  companyForm: any = {};
  showLoader: boolean = false;

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
      expertise: []
    };
  }

  addTag(value: string, event: any) {
    event.preventDefault(); // Prevent form submission
    const tag = value.trim();
    if (tag && !this.companyForm.expertise.includes(tag)) {
      this.companyForm.expertise.push(tag);
    }
  }

  // Remove tag
  removeTag(index: number) {
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
