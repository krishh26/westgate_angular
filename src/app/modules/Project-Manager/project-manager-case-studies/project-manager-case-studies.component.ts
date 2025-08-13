import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

interface UserInfo {
  _id: string;
  name: string;
  role: string;
  companyName: string;
}

interface CaseStudy {
  _id: string;
  name: string;
  industry: string;
  type: string;
  description: string;
  technologies: string[];
  clientName: string;
  problem: string;
  solutionProvided: string;
  resultAchieved: string;
  cost: string;
  createdAt: string;
  updatedAt: string;
  userId: UserInfo;
  showFullDescription?: boolean;
}

@Component({
  selector: 'app-project-manager-case-studies',
  templateUrl: './project-manager-case-studies.component.html',
  styleUrls: ['./project-manager-case-studies.component.scss']
})
export class ProjectManagerCaseStudiesComponent implements OnInit {
  showLoader: boolean = false;
  caseStudiesList: CaseStudy[] = [];

  // Infinite scrolling pagination properties
  initialLimit: number = 20;
  subsequentLimit: number = 10;
  page: number = 1;
  pagesize: number = 20; // Start with initial limit
  totalRecords: number = 0;
  totalPages: number = 0;
  loadingMore: boolean = false;
  hasMore: boolean = true;
  allCaseStudies: CaseStudy[] = [];

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCaseStudiesList();
  }

  getCaseStudiesList() {
    this.showLoader = true;
    this.superService.getAllCaseStudies(this.page, this.pagesize).subscribe({
      next: (response) => {
        if (response?.status === true) {
          const newCaseStudies = response?.data?.data || [];

          if (this.page === 1) {
            // First load - replace all data
            this.allCaseStudies = newCaseStudies;
          } else {
            // Subsequent loads - append data
            this.allCaseStudies = [...this.allCaseStudies, ...newCaseStudies];
          }

          this.caseStudiesList = [...this.allCaseStudies];
          this.totalRecords = response?.data?.meta_data?.items || 0;
          this.pagesize = response?.data?.meta_data?.page_size || this.initialLimit;
          this.page = response?.data?.meta_data?.page || 1;
          this.totalPages = response?.data?.meta_data?.pages || 0;

          // Check if there are more items to load
          this.hasMore = this.allCaseStudies.length < this.totalRecords;
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch case studies');
        }
        this.showLoader = false;
        this.loadingMore = false;
      },
      error: (error) => {
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
        this.showLoader = false;
        this.loadingMore = false;
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore || !this.hasMore) {
      return;
    }

    this.loadingMore = true;
    this.page++;
    this.pagesize = this.subsequentLimit; // Use smaller limit for subsequent loads
    this.getCaseStudiesList();
  }

  onTableScroll(event: any): void {
    const element = event.target;
    // Trigger when user scrolls past 80% of the scrollable area
    const scrollPosition = element.scrollTop + element.clientHeight;
    const triggerPoint = element.scrollHeight * 0.8;

    if (scrollPosition >= triggerPoint && this.hasMore && !this.loadingMore) {
      this.loadMore();
    }
  }

  goBack() {
    this.router.navigate(['/project-manager/dashboard']);
  }

  isDescriptionLong(description: string | undefined): boolean {
    return (description || '').length > 150;
  }
}
