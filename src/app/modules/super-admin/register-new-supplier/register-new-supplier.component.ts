import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-new-supplier',
  templateUrl: './register-new-supplier.component.html',
  styleUrls: ['./register-new-supplier.component.css']
})
export class RegisterNewSupplierComponent implements OnInit {
  companyForm!: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      companyWebsite: ['', [Validators.required, Validators.pattern('https?://.+')]],
      yearOfEstablishment: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      gstRegistrationNumber: ['', Validators.required],
      typeOfCompany: ['', Validators.required],
      industrySector: ['', Validators.required],
      companyAddress: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      customerSupportContact: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      vatOrGstNumber: ['', Validators.required],
      companyDirectorsOwners: ['', Validators.required],
      complianceCertifications: ['', Validators.required],
      productsServicesOffered: ['', Validators.required],
      technologyStack: ['', Validators.required],
      licensingDetails: ['', Validators.required],
      ipPatents: ['', Validators.required],
      employeeCount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      developerEngineerTeams: ['', Validators.required],
      dataPrivacyPolicies: ['', Validators.required],
      securityCertifications: ['', Validators.required],
      cybersecurityPractices: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.companyForm.valid) {
      console.log(this.companyForm.value);
      // Here you can handle the form submission, e.g., send it to an API
    } else {
      console.log("Form is not valid");
    }
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
