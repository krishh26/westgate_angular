import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss']
})
export class CaseStudiesComponent {

  
  showLoader: boolean = false;
  caseStudyList: any = [];

  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCaseStudiesList();
  }

  getCaseStudiesList() {
    this.showLoader = true;
    this.supplierService.getCaseStudyList().subscribe((response) => {
      this.caseStudyList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.caseStudyList = response?.data?.data;
        console.log(this.caseStudyList);
        
        this.totalRecords = response?.totalCount;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

}
