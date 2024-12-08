import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';

@Component({
  selector: 'app-supplier-user-profile-edit',
  templateUrl: './supplier-user-profile-edit.component.html',
  styleUrls: ['./supplier-user-profile-edit.component.scss']
})
export class SupplierUserProfileEditComponent {
  addEditProjectForm = {
    companyName: new FormControl("", Validators.required),
    website: new FormControl("", Validators.required),
    yearOfEstablishment: new FormControl("", Validators.required),
    registrationNumber: new FormControl("", Validators.required),
    TypeOfCompany: new FormControl(""),
    industry_Sector: new FormControl(""),
    companyAddress: new FormControl("", Validators.required),
    developerOrEngineerTeams: new FormControl("", Validators.required),
    dataPrivacyPolicies: new FormControl("", Validators.required),
    securityCertifications: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    customerSupportContact: new FormControl("", Validators.required),
    companyContactNumber: new FormControl("", Validators.required),
    VATOrGSTNumber: new FormControl("", Validators.required),
    companyDirectors_Owners: new FormControl("", Validators.required),
    complianceCertifications: new FormControl("", Validators.required),
    products_ServicesOffered: new FormControl("", Validators.required),
    technologyStack: new FormControl("", Validators.required),
    licensingDetails: new FormControl("", Validators.required),
    IP_Patents: new FormControl("", Validators.required),
    employeeCount: new FormControl("", Validators.required),
    cybersecurityPractices: new FormControl("", Validators.required),
  }

  supplierDetails: FormGroup = new FormGroup(this.addEditProjectForm);
  showLoader: boolean = false;
  data:any;
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private supplierService: SupplierAdminService

  ) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras.state;
  }

  ngOnInit(): void {
    if(this.data) {
      this.supplierDetails.patchValue(this.data);
    }
  }
  
  submitForm()
  {
    if (this.supplierDetails.invalid) {
      this.supplierDetails.markAllAsTouched();
      return;
    }
   
      const payload:any = {
        ...this.data, 
        ...this.supplierDetails.value,
      }
      
      this.showLoader = true;
      this.supplierService.updateSuppilerDetails(payload,this.data._id).subscribe(
        (response) => {
          if (response?.status === true) {
            this.showLoader = false;
            this.notificationService.showSuccess('', 'Supplier Details  Edit successfully.');
            this.router.navigate(['/super-admin/supplier-user-profile']);
          } else {
            this.notificationService.showError(response?.message);
            this.showLoader = false;
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
        }
      );
      return
  }
  
}
