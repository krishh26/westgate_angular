import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  file: any;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  imageToUpload: any;
  imageSrc: any;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  casestudyForm = {
    name: new FormControl(""),
    category: new FormControl(""),
    subCategory: new FormControl(""),
    file: new FormControl(""),
  };

  caseForm = new FormGroup(this.casestudyForm, []);

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

  addCaseStudy() {
    const data = new FormData();
    data.append('name', this.caseForm.controls.name.value || '');
    data.append('category', this.caseForm.controls.category.value || '');
    data.append('subCategory', this.caseForm.controls.subCategory.value || '');
    data.append('file', this.imageToUpload || '');
    this.showLoader = true;
    this.supplierService.addCaseStudy(data).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.notificationService.showSuccess('Reply add successfully.');
        window.location.reload();
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  // Handle the file change event
  addFiles(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.imageToUpload = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result
      };
      reader.readAsDataURL(file);
    }
  }


}
