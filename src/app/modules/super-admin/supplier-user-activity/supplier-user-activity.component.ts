import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
@Component({
  selector: 'app-supplier-user-activity',
  templateUrl: './supplier-user-activity.component.html',
  styleUrls: ['./supplier-user-activity.component.css']
})
export class SupplierUserActivityComponent {

  supplierActivityList: any = [];
  supplierID: string = '';
  supplierData: any = [];
  showLoader: boolean = false;
  supplierDetails: any = [];
  dates: string[] = []; // Will hold the keys (dates) dynamically
  rows: string[][] = []; // Will hold the rows of login times

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
      console.log(this.supplierData?._id);
      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    // this.getSupplierdata();
    this.getSupplierActivity();
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

  getSupplierActivity() {
    this.showLoader = true;
    this.supplierService.getSupplierActivity(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.supplierDetails = response.data;
  
          // Extract dates (keys)
          this.dates = Object.keys(this.supplierDetails);
  
          // Find the maximum number of login times
          const maxEntries = Math.max(
            ...Object.values(this.supplierDetails).map((times) => (times as any[]).length)
          );
  
          // Prepare rows
          this.rows = Array.from({ length: maxEntries }, (_, rowIndex) =>
            this.dates.map((date) => this.supplierDetails[date][rowIndex]?.loginTime || "")
          );
  
          this.showLoader = false;
        } else {
          console.error('Failed to fetch supplier activity:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching supplier activity:', error);
        this.showLoader = false;
      }
    );
  }
  
}
