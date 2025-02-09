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
    companyName: new FormControl(""),
    website: new FormControl(""),
    yearOfEstablishment: new FormControl(""),
    registrationNumber: new FormControl(""),
    TypeOfCompany: new FormControl(""),
    industry_Sector: new FormControl(""),
    companyAddress: new FormControl(""),
    developerOrEngineerTeams: new FormControl(""),
    dataPrivacyPolicies: new FormControl(""),
    securityCertifications: new FormControl(""),
    email: new FormControl(""),
    customerSupportContact: new FormControl(""),
    companyContactNumber: new FormControl(""),
    VATOrGSTNumber: new FormControl(""),
    companyDirectors_Owners: new FormControl(""),
    complianceCertifications: new FormControl(""),
    products_ServicesOffered: new FormControl(""),
    technologyStack: new FormControl(""),
    licensingDetails: new FormControl(""),
    IP_Patents: new FormControl(""),
    employeeCount: new FormControl(""),
    cybersecurityPractices: new FormControl(""),
    otheremployeeCount: new FormControl("")
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

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
