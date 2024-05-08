import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UkWriterService } from 'src/app/services/uk-writer/uk-writer.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

@Component({
  selector: 'app-uk-writer-supplier-list',
  templateUrl: './uk-writer-supplier-list.component.html',
  styleUrls: ['./uk-writer-supplier-list.component.scss']
})
export class UkWriterSupplierListComponent {

  showLoader: boolean = false;
  supplierList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: FormControl = new FormControl('');
  loginUser: any;
  projectID : string = '';

  constructor(
    private ukwriterService: UkWriterService,
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.searchText.valueChanges.pipe(debounceTime(500)).subscribe((result) => {
      console.log('result', result);
      this.getSupplierList();
    });
    this.getSupplierList();
  }

  getSupplierList() {
    this.projectID = localStorage.getItem('UKprojectID') || '';
    this.showLoader = true;
    this.ukwriterService.getSupplierList(this.projectID).subscribe((response:any) => {
      this.supplierList = []; // Initialize supplierList as an array
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        // Assuming response.data[0] is an array of suppliers
        this.supplierList = response?.data[0]?.supplierId;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }
  

  paginate(page: number) {
    this.page = page;
    this.getSupplierList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  supplierDetails(item:any) {

  } 

}
