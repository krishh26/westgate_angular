import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FoiService } from 'src/app/services/foi-service/foi.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-fio-document-list',
  templateUrl: './fio-document-list.component.html',
  styleUrls: ['./fio-document-list.component.scss']
})
export class FioDocumentListComponent {

  showLoader: boolean = false;
  FOIList: any = [];

  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private foiService: FoiService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getFOIList();
  }

  getFOIList() {
    this.showLoader = true;
    this.foiService.getFOIList().subscribe((response) => {
      this.FOIList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.FOIList = response?.data;
        // this.projectList.forEach((project: any) => {
        //   const dueDate = new Date(project.dueDate);
        //   const currentDate = new Date();
        //   const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());
        //   console.log(`Date difference for project ${dateDifference}`);
        //   const formattedDateDifference: string = this.formatMilliseconds(dateDifference);
        //   this.dateDifference = formattedDateDifference;
        // });
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error: { message: string; }) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  foiDetails(item: any) {
    localStorage.setItem("foiID", item?._id);
    this.router.navigate(['/boss-user/foi-document-details'], { queryParams: { id: item?._id } });
  }


}
