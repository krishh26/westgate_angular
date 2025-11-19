import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
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
  totalRecordsNoSupplier: number = 0;

  // Helper method to check if comment exceeds a certain length
  isCommentLong(comment: string | undefined | null, length: number = 100): boolean {
    if (!comment) return false;

    if (typeof comment !== 'string') {
      return false;
    }
    // debugger;
    // Remove HTML tags for length calculation
    const plainText = comment?.replace(/<[^>]*>/g, '');
    return plainText.length > length;
  }

  // Toggle comment visibility
  toggleComment(item: any): void {
    item.showFullComment = !item.showFullComment;
  }

  // Get sliced comment while preserving HTML
  getSlicedComment(comment: string | undefined | null): string {
    if (!comment) return '';
    if (!this.isCommentLong(comment)) return comment;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = comment;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    // If the text is not long enough, return original comment
    if (plainText.length <= 100) return comment;

    let truncated = '';
    let currentLength = 0;
    let tempElement = document.createElement('div');

    // Process the HTML content
    const nodes = Array.from(tempDiv.childNodes);
    for (const node of nodes) {
      if (currentLength >= 100) break;

      if (node.nodeType === Node.TEXT_NODE) {
        const remainingLength = 100 - currentLength;
        const text = node.textContent || '';
        truncated += text.slice(0, remainingLength);
        currentLength += text.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        tempElement.appendChild(node.cloneNode(true));
        const text = tempElement.textContent || '';
        currentLength += text.length;
        truncated += tempElement.innerHTML;
        tempElement.innerHTML = '';
      }
    }

    return truncated + '...';
  }
  categorywiseList: string[] = ['DPS', 'Framework', 'DTD'];
  projectwiseList: string[] = ['Product', 'Development/Service', 'StaffAugmentation'];
  selectedCategory: string | undefined;
  selectedProduct: string | undefined;
  selectedCategorisation: string = '';
  selectedProjectType: string = '';

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
    this.getGapAnalysisDataNoSupplier();
    this.getGapAnalysisDataDropped();
  }

  submitFilters() {
    if (!this.trackerStartDate.value || !this.trackerEndDate.value) {
      this.notificationService.showError('Please select both Start and End dates');
      return;
    }

    this.pageNoSupplier = 1; // Reset to first page when filters change
    this.getGapAnalysisData();
    this.getGapAnalysisDataNoSupplier();
    this.getGapAnalysisDataDropped();
  }

  onSubmitDaterange() {
    const startDate = this.trackerStartDate.value;
    const endDate = this.trackerEndDate.value;

    if (!startDate || !endDate) {
      this.notificationService.showError('Please select both start and end dates.');
      return;
    }

    this.pageNoSupplier = 1; // Reset to first page when date range changes
    this.getGapAnalysisData();
    this.getGapAnalysisDataNoSupplier();
    this.getGapAnalysisDataDropped();
  }


  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.trackerStartDate.setValue(input.value); // Store in YYYY-MM-DD for date picker
      console.log('Selected Start Date:', input.value);
    }
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.trackerEndDate.setValue(input.value); // Store in YYYY-MM-DD for date picker
      console.log('Selected End Date:', input.value);
    }
  }

  formatDate(date: string | null): string | null {
    if (!date) return null;
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Extracts YYYY-MM-DD
    return formattedDate;
  }

  //   onCategoryChange(categorisation: string) {
  //     this.getGapAnalysisData('', categorisation);
  //     this.getGapAnalysisDataDropped('', categorisation);
  //     this.getGapAnalysisDataNoSupplier('', categorisation);
  //   }

  //   onProductChange(projectType: string) {
  //     this.getGapAnalysisData('', '', projectType);
  //     this.getGapAnalysisDataDropped('', '', projectType);
  //     this.getGapAnalysisDataNoSupplier('', '', projectType);
  // }

  onCategoryChange(categorisation: string) {
    this.selectedCategorisation = categorisation;
    this.filterGapAnalysisData();
  }

  onProductChange(projectType: string) {
    this.selectedProjectType = projectType;
    this.filterGapAnalysisData();
  }

  filterGapAnalysisData() {
    this.pageNoSupplier = 1; // Reset to first page when filters change
    this.getGapAnalysisData('', this.selectedCategorisation, this.selectedProjectType);
    this.getGapAnalysisDataDropped('', this.selectedCategorisation, this.selectedProjectType);
    this.getGapAnalysisDataNoSupplier('', this.selectedCategorisation, this.selectedProjectType);
  }

  getGapAnalysisData(searchText?: string, categorisation?: string, projectType?: string) {
    let param: any = {};

    if (searchText) {
      param['keyword'] = searchText;
    }

    const startDate = this.trackerStartDate.value ? this.formatDate(this.trackerStartDate.value) : '';
    const endDate = this.trackerEndDate.value ? this.formatDate(this.trackerEndDate.value) : '';

    if (startDate && endDate) {
      param['startDate'] = startDate;
      param['endDate'] = endDate;
    }

    if (categorisation) {
      param['categorisation'] = categorisation;
    }

    if (projectType) {
      param['projectType'] = projectType;
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
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  getSearchGapAnalysisData(searchText?: string, categorisation?: string, projectType?: string) {
    let params = new HttpParams();

    if (searchText) {
      params = params.set('keyword', searchText);
    }

    const startDate = this.trackerStartDate.value
      ? this.formatDate(this.trackerStartDate.value)
      : '';
    const endDate = this.trackerEndDate.value
      ? this.formatDate(this.trackerEndDate.value)
      : '';

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    if (categorisation) {
      params = params.set('categorisation', categorisation);
    }
    if (projectType) {
      params = params.set('projectType', projectType);
    }

    this.showLoader = true;
    this.gapAnalysisData = [];

    this.superService.getGapAnalysis(params).subscribe(
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
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  getGapAnalysisDataDropped(searchText?: string, categorisation?: string, projectType?: string) {
    let param: any = {};

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

    if (categorisation) {
      param['categorisation'] = categorisation;
    }

    if (projectType) {
      param['projectType'] = projectType;
    }

    this.showLoader = true;
    this.gapAnalysisDataDropped = [];

    this.superService.getGapAnalysisDroppedafterFeasibility(param).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          this.gapAnalysisDataDropped = response?.data;
          this.totalRecords = response?.totalRecords;
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  getGapAnalysisDataNoSupplier(searchText?: string, categorisation?: string, projectType?: string) {
    let param: any = {
      page: this.pageNoSupplier,
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

    if (categorisation) {
      param['categorisation'] = categorisation;
    }

    if (projectType) {
      param['projectType'] = projectType;
    }

    this.showLoader = true;
    this.gapAnalysisDataNoSupplier = [];

    this.superService.getGapAnalysisNosupplierMatched(param).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          this.gapAnalysisDataNoSupplier = (response?.data || []).map((item: any) => ({
            ...item,
            showFullComment: false
          }));
          // Use meta_data.items for total records if available, otherwise fallback to totalRecords
          this.totalRecordsNoSupplier = response?.meta_data?.items || response?.totalRecords || 0;
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
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
    const modalElement = document.getElementById('viewAllProjects');

    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide(); // Close the modal properly
      }
    }

    // Wait a bit to ensure Bootstrap removes modal styles before restoring scrolling
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = ''; // Reset to default behavior
      document.body.style.paddingRight = '';

      // Remove any leftover modal backdrop
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

      // Force scroll to be enabled
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';

      // Now navigate to the details page
      this.router.navigate(['/super-admin/tracker-wise-project-details'], { queryParams: { id: projectId } });
    }, 300); // Delay slightly to ensure Bootstrap cleanup is complete
  }



  paginate(page: number) {
    this.page = page;
    this.getGapAnalysisData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  paginateNoSupplier(page: number) {
    this.pageNoSupplier = page;
    this.getGapAnalysisDataNoSupplier();
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
