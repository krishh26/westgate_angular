import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
@Component({
  selector: 'app-supplier-project-submitted',
  templateUrl: './supplier-project-submitted.component.html',
  styleUrls: ['./supplier-project-submitted.component.scss']
})
export class SupplierProjectSubmittedComponent {
  showLoader: boolean = false;
  projectList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: FormControl = new FormControl('');

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchText.valueChanges.pipe(debounceTime(500)).subscribe((result) => {
      console.log('result', result);
      this.getProjectList();
    });

    this.getProjectList();
  }

  getProjectList() {
    this.showLoader = true;
    Payload.projectList.keyword = String(this.searchText?.value) || "";
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    Payload.projectList.applied = false;
    Payload.projectList.status = String('Submitted');
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
      this.projectList = [];
      this.totalRecords = response?.data?.meta_data?.items;
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data?.data;
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

  projectDetails(projectId: any) {
    this.router.navigate(['/supplier-admin/projects-details-for-applied'], { queryParams: { id: projectId, type: 5 } });
  }

  paginate(page: number) {
    this.page = page;
    this.getProjectList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
