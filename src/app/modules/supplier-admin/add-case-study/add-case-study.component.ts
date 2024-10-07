import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-add-case-study',
  templateUrl: './add-case-study.component.html',
  styleUrls: ['./add-case-study.component.scss']
})
export class AddCaseStudyComponent {

  addEditProjectForm = {
    projectApplicationName: new FormControl("", Validators.required),
    domainCategory: new FormControl("", Validators.required),
    industry: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required),
    resourcesUsed: new FormControl("", Validators.required),
    clientName: new FormControl("", Validators.required),
    contractValue: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    technologies: new FormControl("", Validators.required),
    maintenance: new FormControl("", Validators.required),
    contractDuration: new FormControl("", Validators.required),
  }

  productForm: FormGroup = new FormGroup(this.addEditProjectForm);
  showLoader: boolean = false;
  projectId: string = '';
  categoryList: any = [];
  industryList: any = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService
  ) {
  }

  ngOnInit(): void {
    this.getcategoryList();
    this.getIndustryList();
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    if (this.projectId && this.projectId.length) {
      this.patchProjectValue()
    }
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  patchProjectValue() {
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      this.productForm.patchValue(response?.data)
    },
      error => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      })
  }

  getcategoryList() {
    this.showLoader = true;
    this.superService.getCategoryList().subscribe((response) => {
      if (response?.message == "category fetched successfully") {
        this.showLoader = false;
        this.categoryList = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getIndustryList() {
    this.showLoader = true;
    this.superService.getIndustryList().subscribe((response) => {
      if (response?.message == "Industry fetched successfully") {
        this.showLoader = false;
        this.industryList = response?.data;
        console.log(this.industryList);
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  submitForm() {
    this.showLoader = true;
    let payload = {
      data: this.productForm.value
    }
    if (this.projectId) {
      this.projectService.editProject(this.projectId, this.productForm.value).subscribe((response) => {
        if (response.status) {
          this.notificationService.showSuccess('', 'Project updated successfully.');
          this.router.navigate(['/supplier-admin/case-studies-list']);
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
        error => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
        })
    } else {
      this.projectService.addProject(payload).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.notificationService.showSuccess('', 'Project added successfully.');
          this.router.navigate(['/supplier-admin/case-studies-list']);
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
}
