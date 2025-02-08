import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  trackerStartDate: FormControl = new FormControl('');
  trackerEndDate: FormControl = new FormControl('');
  showLoader: boolean = false;
  gapAnalysisData: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  selectedProjects: any[] = [];
  searchText: string = "";
  filteredData: any[] = [];

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
    this.trackerEndDate.valueChanges.subscribe((res: any) => {
      if (!this.trackerStartDate.value) {
        this.notificationService.showError(
          'Please select a Publish start date'
        );
        return;
      } else {
        this.getGapAnalysisData();
      }
    });
  }

  private formatDate(date: {
    year: number;
    month: number;
    day: number;
  }): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
      date.day
    ).padStart(2, '0')}`;
  }

  getGapAnalysisData(searchText?: string) {
    let param: any = {};
    if (searchText) {
      param['keyword'] = searchText
    }
    this.showLoader = true;

    const startDate = this.trackerStartDate.value
      ? this.formatDate(this.trackerStartDate.value)
      : '';
    const endDate = this.trackerEndDate.value
      ? this.formatDate(this.trackerEndDate.value)
      : '';

    if(startDate && endDate) {
      param['startDate'] = startDate;
      param['endDate'] = endDate;
    }

    this.gapAnalysisData = [];
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

  searchInputChange() {
    this.filteredData = this.selectedProjects.filter(item => {
      const matchesComment = this.searchText
        ? item.comment.toLowerCase().includes(this.searchText.toLowerCase())
        : true;
      return matchesComment;
    });
  }

  projectDetails(projectId: any) {
    this.router.navigate(['/super-admin/super-admin-project-details'], { queryParams: { id: projectId } });
  }

  paginate(page: number) {
    this.page = page;
    this.getGapAnalysisData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showProjects(projects: any) {
    this.selectedProjects = [];
    // Flatten the nested structure and include the comment
    Object.keys(projects).forEach((key) => {
      projects[key].forEach((project: any) => {
        this.selectedProjects.push({
          ...project,
          comment: project?.failStatusReason?.comment || 'No comment available',
        });
      });
    });

    this.filteredData = [...this.selectedProjects];
  }
}
