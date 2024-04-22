import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MailscreenshotService } from 'src/app/services/mailscreenshot-service/mailscreenshot.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-mail-screenshot-add-edit',
  templateUrl: './mail-screenshot-add-edit.component.html',
  styleUrls: ['./mail-screenshot-add-edit.component.scss']
})
export class MailScreenshotAddEditComponent {

  showLoader: boolean = false;
  mailList: any = [];

  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private mailService: MailscreenshotService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getmailSSList();
  }

  getmailSSList() {
    this.showLoader = true;
    let params = {
      keyword: ''
    }
    this.mailService.getmailSSList(params).subscribe((response) => {
      this.mailList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.mailList = response?.data;
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
