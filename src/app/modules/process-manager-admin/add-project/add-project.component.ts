import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {

  addEditProjectForm = {
    projectName: new FormControl("", Validators.required),
    BOSID: new FormControl("", Validators.required),
    publishDate: new FormControl(moment(new Date()).format('YYYY-MM-DD'), Validators.required),
    website: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    industry: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    link: new FormControl("", Validators.required),
    periodOfContractStart: new FormControl("", Validators.required),
    periodOfContractEnd: new FormControl("", Validators.required),
    value: new FormControl("", Validators.required),
    projectType: new FormControl("", Validators.required),
    mailID: new FormControl("", Validators.required),
    clientType: new FormControl("", Validators.required),
    clientName: new FormControl("", Validators.required),
    bidsubmissionhour: new FormControl("", Validators.required),
    bidsubmissionminute: new FormControl("", Validators.required),
    categorisation: new FormControl("", Validators.required),
    // submission: new FormControl("", Validators.required),
    dueDate: new FormControl("", Validators.required),
    noticeReference: new FormControl("", Validators.required),
    CPVCodes: new FormControl("", Validators.required),
    minValue: new FormControl("", Validators.required),
    maxValue: new FormControl("", Validators.required),
    bidsubmissiontime: new FormControl("12", Validators.required),
    documentsLink: new FormControl("", Validators.required),
    linkToPortal: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    loginID: new FormControl("", Validators.required),
    chatGptLink: new FormControl(""),
  }

  productForm: FormGroup = new FormGroup(this.addEditProjectForm);
  showLoader: boolean = false;
  projectId: string = '';
  categoryList: any = [];
  industryList: any = [];

  projectTypeList = [
    {type:'Development/Service' , value :'Development/Service'},
    {type:'Product' , value :'Product'},
    {type:'Staff Augmentation' , value :'StaffAugmentation'}
  ]

  categorisationList = [
    { categorisationtype: 'DPS', categorisationvalue: 'DPS' },
    { categorisationtype: 'Framework', categorisationvalue: 'Framework' },
    { categorisationtype: 'DTD', categorisationvalue: 'DTD' },
  ]


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

  // Number only validation
  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  removeReadonly(event: Event) {
    (event.target as HTMLInputElement).removeAttribute('readonly');
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
        // this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  onDropdownChange(event: any) {
    // this.selectedProjectId = event.target.value;
    // this.getProjectRemark()
  }

  getIndustryList() {
    this.showLoader = true;
    this.superService.getIndustryList().subscribe((response) => {
      if (response?.message == "Industry fetched successfully") {
        this.showLoader = false;
        this.industryList = response?.data;

      } else {
        //  this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }


  submitForm() {
    this.showLoader = true;
    // Get the current form values
    let formData = this.productForm.value;

    // Check if minValue or maxValue are empty (or null/undefined) and set to 0 if so
    if (formData.minValue === "" || formData.minValue == null) {
      formData.minValue = 0;
    }
    if (formData.maxValue === "" || formData.maxValue == null) {
      formData.maxValue = 0;
    }

    let payload = { data: [formData] };

    if (this.projectId) {
      this.projectService.editProject(this.projectId, formData).subscribe(
        (response) => {
          if (response.status) {
            this.notificationService.showSuccess('', 'Project updated successfully.');
            this.router.navigate(['/process-manager/process-manager-tracker']);
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
    } else {
      this.projectService.addProject(payload).subscribe(
        (response) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.notificationService.showSuccess('', 'Project added successfully.');
            this.router.navigate(['/process-manager/process-manager-tracker']);
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
  }


  onItemAddCategory(item: { category: string }): void {
    // Add type annotation for 'categoryItem'
    const found = this.categoryList.some((categoryItem: { category: string }) => categoryItem.category === item.category);
    if (!found) {
      this.showLoader = true;
      this.projectService.createCategory(item).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.getcategoryList();

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

  onItemAddIndustry(item: { industry: string }): void {
    // Add type annotation for 'categoryItem'
    console.log(this.industryList)
    console.log('this is value', item);

    const found = this.industryList.some((industryItem: { industry: string }) => industryItem.industry === item.industry);
    if (!found) {
      this.showLoader = true;
      this.projectService.createIndustry(item).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.getIndustryList();

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
