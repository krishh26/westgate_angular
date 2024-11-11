import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { CaseStudyBulkAddComponent } from '../case-study-bulk-add/case-study-bulk-add.component';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

@Component({
  selector: 'app-admin-case-studies-list',
  templateUrl: './admin-case-studies-list.component.html',
  styleUrls: ['./admin-case-studies-list.component.css']
})
export class AdminCaseStudiesListComponent {


  showLoader: boolean = false;
  caseStudyList: any = [];
  file: any;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  imageToUpload: any;
  imageSrc: any;
  selectedDocument: any;
  selectedCasestudy: any;
  categoryList: any = [];
  supplierData: any = [];
  supplierID: string = '';
  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
  ) { }

  casestudyForm = {
    name: new FormControl(""),
    category: new FormControl(""),
    subCategory: new FormControl(""),
    file: new FormControl(""),
  };

  caseForm = new FormGroup(this.casestudyForm, []);

  ngOnInit(): void {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);
      console.log(this.supplierData?._id);
      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getCaseStudiesList();
    this.getCategoryList();
    this.selectedCasestudy = 'https://f005.backblazeb2.com/file/west-get-it-hub-1/caseStudy/1727203790532_Historical Data.xlsx';
    console.log(this.selectedCasestudy);

  }

  openAddTeamModal() {
    this.modalService.open(CaseStudyBulkAddComponent, { size: 'xl' });
  }

  getCategoryList() {
    this.showLoader = true;
    this.superService.getCategoryList().subscribe(
      (response) => {
        if (response?.status && response?.message === "category fetched successfully") {
          this.categoryList = response.data;
          this.showLoader = false;
        } else {
          console.error('Failed to fetch categories:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.showLoader = false;
      }
    );
  }

  getCaseStudiesList() {
    this.showLoader = true;
    Payload.casestudyList.page = String(this.page);
    Payload.casestudyList.limit = String(this.pagesize);
    Payload.casestudyList.userId = this.supplierID;
  
    this.supplierService.getadminCaseStudyList(Payload.casestudyList).subscribe((response) => {
      console.log('API response:', response);
      if (response?.status === true) {
        this.caseStudyList = response?.data?.data || [];
        this.totalRecords = response?.data?.meta_data?.items || 0;
        console.log('Case Study List:', this.caseStudyList);
        console.log('Total Records:', this.totalRecords);
      } else {
        this.notificationService.showError(response?.message);
      }
      this.showLoader = false;
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
        this.notificationService.showSuccess('Case-Study add successfully.');
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

  // Add this method to handle file changes
  onFileChange(event: any, caseStudy: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.uploadDocument(file, caseStudy);
    }
  }

  // Method to upload the case study document
  uploadDocument(file: File, caseStudy: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseStudyId', caseStudy._id); // Assuming each case study has an ID

    this.showLoader = true;
    this.supplierService.addCaseStudy(formData).subscribe((response) => {
      if (response.status === true) {
        this.notificationService.showSuccess('Document uploaded successfully.');
        this.getCaseStudiesList(); // Reload the case studies to show updates
      } else {
        this.notificationService.showError(response.message);
      }
      this.showLoader = false;
    }, (error) => {
      this.notificationService.showError(error.message);
      this.showLoader = false;
    });
  }

  paginate(page: number) {
    this.page = page;
    this.getCaseStudiesList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  openDocument(data: any) {
    this.selectedDocument = data;
  }

  download(imageUrl: string, fileName: string): void {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // You can customize the filename here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }


  triggerDownload() {
    var file: string = './../../../../assets/img/case-study.png';
    const downloadLink = document.createElement('a');

    if (typeof file === 'string') {
      downloadLink.href = file;
    } else {
      downloadLink.href = URL.createObjectURL(file);
    }

    downloadLink.download = 'template.png';
    downloadLink.click();

    // For some browsers, remove the object URL after download:
    if (typeof file === 'object') {
      URL.revokeObjectURL(downloadLink.href);
    }
  }


  isPdf(url: string): boolean {
    return url?.endsWith('.pdf') || false;
  }

  isWordOrExcel(url: string): boolean {
    return url?.endsWith('.doc') || url?.endsWith('.docx') || url?.endsWith('.xls') || url?.endsWith('.xlsx') || false;
  }

  isImage(url: string): boolean {
    return url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.png') || false;
  }

  getDocumentViewerUrl(url: string): SafeResourceUrl {
    if (this.isWordOrExcel(url)) {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(officeUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


}
