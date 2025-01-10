import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-gap-analysis',
  templateUrl: './gap-analysis.component.html',
  styleUrls: ['./gap-analysis.component.scss']
})
export class GapAnalysisComponent {

  showLoader: boolean = false;
  gapAnalysisData: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  selectedProjects: any[] = [];

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.getGapAnalysisData();
  }

  getGapAnalysisData() {
    let param = {};
    this.showLoader = true;
    this.superService.getGapAnalysis(param).subscribe(
      (response) => {
        if (response?.status) {
          this.showLoader = false;
          this.gapAnalysisData = response?.data;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }

  projectDetails() {

  }

  paginate(page: number) {
    this.page = page;
    this.getGapAnalysisData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showProjects(projects: any[]) {
    this.selectedProjects = projects;
}


}
