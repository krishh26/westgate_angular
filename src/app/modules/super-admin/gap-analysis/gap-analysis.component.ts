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
  gapAnalysisDataDropped: any = [];
  gapAnalysisDataNoSupplier: any = [];
  pageFailed: number = 1;
  pageDropped: number = 1;
  pageNoSupplier: number = 1;


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
    let param: any = {
      page: this.pageFailed, // Use the correct page variable
      pagesize: this.pagesize,
    };

    if (searchText) {
      param['keyword'] = searchText;
    }

    const startDate = this.trackerStartDate.value
      ? this.formatDate(this.trackerStartDate.value)
      : '';
    const endDate = this.trackerEndDate.value
      ? this.formatDate(this.trackerEndDate.value)
      : '';

    if (startDate && endDate) {
      param['startDate'] = startDate;
      param['endDate'] = endDate;
    }

    this.showLoader = true;
    this.gapAnalysisData = [];

    this.superService.getGapAnalysis(param).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          this.gapAnalysisData = response?.data;
          this.totalRecords = response?.totalRecords; // Update total records for pagination
        } else {
          this.notificationService.showError(response?.message);
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
    const modalElement = document.getElementById('taskDetailsModal');
    if (modalElement) {
      modalElement.classList.remove('show'); // Hide modal
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open'); // Remove Bootstrap modal class
      document.body.style.overflow = ''; // Reset overflow
      document.body.style.paddingRight = ''; // Reset padding

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Remove modal backdrop
      }
    }
    setTimeout(() => {
      this.router.navigate(['/super-admin/tracker-wise-project-details'], { queryParams: { id: projectId } });
    }, 100);

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
