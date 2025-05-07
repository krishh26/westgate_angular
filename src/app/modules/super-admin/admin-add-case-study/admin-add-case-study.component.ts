import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';


@Component({
  selector: 'app-admin-add-case-study',
  templateUrl: './admin-add-case-study.component.html',
  styleUrls: ['./admin-add-case-study.component.css']
})
export class AdminAddCaseStudyComponent {

  addEditProjectForm = {
    name: new FormControl("", Validators.required),
    clientName: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    industry: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    problem: new FormControl("", Validators.required),
    solutionProvided: new FormControl("", Validators.required),
    technologies: new FormControl("", Validators.required),
    resourcesUsed: new FormControl("", Validators.required),
   // contractValue: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required),
    contractDuration: new FormControl("", Validators.required),
    resultAchieved: new FormControl("", Validators.required),
    cost: new FormControl("", Validators.required),
   // lessonsLearned: new FormControl("", Validators.required),
  }

  productForm: FormGroup = new FormGroup(this.addEditProjectForm);
  showLoader: boolean = false;
  projectId: string = '';
  categoryList: any = [];
  industryList: any = [];
  supplierData: any = [];
  technologiesList: any[] = [];
  supplierID: string = '';
  industryDomainList: any[] = [];

  data:any;
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
    private supplierService: SupplierAdminService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras.state;
  }

  ngOnInit(): void {
    if(this.data) {
      this.productForm.patchValue(this.data);
    }
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);

      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getcategoryList();
    this.getIndustryList();
    this.getTechnologies();
    this.getIndustryDomains();
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    if (this.projectId && this.projectId.length) {
      this.patchProjectValue()
    }
  }

    // Add new method to fetch industry domains
    getIndustryDomains(): void {
      this.superService.getSubExpertiseDropdownList().subscribe({
        next: (response: any) => {
          if (response.status) {
            // Handle array of strings format
            if (Array.isArray(response.data)) {
              this.industryDomainList = response.data.map((item: string) => ({ name: item }));
            } else {
              this.industryDomainList = response.data || [];
            }
          } else {
            console.error('Error fetching industry domains:', response.message);
          }
        },
        error: (error: any) => {
          console.error('API error fetching industry domains:', error);
        }
      });
    }


  getTechnologies() {
    this.superService.getTechnologies().subscribe({
      next: (data) => {
        this.technologiesList = data.data || [];
      },
      error: (error) => {
        console.error('Error fetching technologies:', error);
        this.notificationService.showError('Failed to fetch technologies');
      }
    });
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
    if (this.data) {
      const payload = {
        ...this.data,
        ...this.productForm.value,
      };
      this.showLoader = true;
      this.supplierService.updateCaseStudy(payload,this.data._id).subscribe(
        (response) => {
          if (response?.status === true) {
            this.showLoader = false;
            this.notificationService.showSuccess('', 'Case Study Edit successfully.');
            this.router.navigate(['/super-admin/admin-case-study-list']);
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
      return
    }
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.showLoader = true;

    // Create JSON payload instead of FormData
    const payload = {
      ...this.productForm.value,
      userId: this.supplierID
    };

    this.supplierService.addCaseStudy(payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.showLoader = false;
          this.notificationService.showSuccess('', 'Case Study added successfully.');
          this.router.navigate(['/super-admin/admin-case-study-list']);
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
