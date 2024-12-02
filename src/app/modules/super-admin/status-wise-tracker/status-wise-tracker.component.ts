import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

@Component({
  selector: 'app-status-wise-tracker',
  templateUrl: './status-wise-tracker.component.html',
  styleUrls: ['./status-wise-tracker.component.css']
})
export class StatusWiseTrackerComponent implements OnInit {

  showLoader: boolean = false;
  statusWiseData: any = [];

  trackerStartDate: FormControl = new FormControl('');
  trackerEndDate: FormControl = new FormControl('');

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.getDataByStatus();
    this.trackerEndDate.valueChanges.subscribe((res: any) => {
      if (!this.trackerStartDate.value) {
        this.notificationService.showError('Please select a Publish start date');
        return
      } else {
        this.getDataByStatus();
      }
    });
  }

  getDataByStatus() {
    this.showLoader = true;

    // Extract and format date values from the datepickers
    const startDate = this.trackerStartDate.value
      ? this.formatDate(this.trackerStartDate.value)
      : '';
    const endDate = this.trackerEndDate.value
      ? this.formatDate(this.trackerEndDate.value)
      : '';

    // Call the service with the extracted date range
    this.supplierService.getDataBYStatus({ startDate, endDate }).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          this.statusWiseData = response.data;
        } else {
          console.error('Failed to fetch data:', response?.message);
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error fetching data:', error);
      }
    );
  }

  private formatDate(date: { year: number; month: number; day: number }): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

}
