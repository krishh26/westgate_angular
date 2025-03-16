import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';


@Component({
  selector: 'app-supplier-user-profile-data',
  templateUrl: './supplier-user-profile-data.component.html',
  styleUrls: ['./supplier-user-profile-data.component.css']
})
export class SupplierUserProfileDataComponent {

  supplierData: any = [];
  supplierID: string = '';
  showLoader: boolean = false;
  supplierDetails: any = [];

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);

      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getSupplierdata();
  }

  getSupplierdata() {
    this.showLoader = true;
    this.supplierService.getSupplierDetails(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.supplierDetails = response.data;
          this.showLoader = false;
        } else {
          console.error('Failed to fetch supplier data:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
        this.showLoader = false;
      }
    );
  }

}
