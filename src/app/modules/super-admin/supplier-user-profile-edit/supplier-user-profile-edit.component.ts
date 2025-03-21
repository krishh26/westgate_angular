import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';

@Component({
  selector: 'app-supplier-user-profile-edit',
  templateUrl: './supplier-user-profile-edit.component.html',
  styleUrls: ['./supplier-user-profile-edit.component.scss']
})
export class SupplierUserProfileEditComponent {
  supplierDetails: any = {
    companyName: '',
    website: '',
    yearOfEstablishment: '',
    registrationNumber: '',
    TypeOfCompany: '',
    industry_Sector: '',
    companyAddress: '',
    developerOrEngineerTeams: '',
    dataPrivacyPolicies: '',
    securityCertifications: '',
    email: '',
    customerSupportContact: '',
    companyContactNumber: '',
    VATOrGSTNumber: '',
    companyDirectors_Owners: '',
    complianceCertifications: '',
    products_ServicesOffered: '',
    technologyStack: '',
    licensingDetails: '',
    IP_Patents: '',
    employeeCount: '',
    cybersecurityPractices: '',
    otheremployeeCount: '',
    number: '',
  };

  showLoader: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private supplierService: SupplierAdminService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const data = navigation?.extras.state;
    if (data) {
      this.supplierDetails = { ...this.supplierDetails, ...data };
    }
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  submitForm() {
    if (!this.supplierDetails.companyName || !this.supplierDetails.email) {
      this.notificationService.showError('Company Name and Email are required.');
      return;
    }

    const payload = {
      ...this.supplierDetails,
    };

    this.showLoader = true;
    this.supplierService.updateSuppilerDetails(payload, this.supplierDetails._id).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          this.notificationService.showSuccess('', 'Supplier Details Edited successfully.');
          this.router.navigate(['/super-admin/supplier-user-profile']);
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }
}
