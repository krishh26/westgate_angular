import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Patterns } from 'src/app/utility/shared/constant/validation-patterns.const';

@Component({
  selector: 'app-register-new-supplier',
  templateUrl: './register-new-supplier.component.html',
  styleUrls: ['./register-new-supplier.component.css']
})
export class RegisterNewSupplierComponent implements OnInit {
  companyForm!: FormGroup;
  showLoader: boolean = false;
  constructor(
    private fb: FormBuilder,
    private superadminService: SuperadminService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      name: [''],
      website: [''],
      yearOfEstablishment: [''],
      registerNumber: [''],
      typeOfCompany: [''],
      "⁠industry_Sector": [''],
      companyAddress: [''],
      developerOrEngineerTeams: [''],
      dataPrivacyPolicies: [''],
      securityCertifications: [''],
      email: ['', [Validators.pattern(Patterns.email)]],
      number: [''],
      customerSupportContact: ['', [Validators.pattern(Patterns.mobile)]],
      VATOrGSTNumber: [''],
      companyDirectors_Owners: [''],
      complianceCertifications: [''],
      products_ServicesOffered: [''],
      technologyStack: [''],
      licensingDetails: [''],
      IP_Patents: [''],
      password: [''],
      employeeCount: [''],
      cybersecurityPractices: [''],
      otheremployeeCount: ['']
    });
  }

  submitForm() {
    this.superadminService.supplierregister(this.companyForm.value).subscribe((response) => {
      if (response?.status == true) {
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
