import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-resources-add',
  templateUrl: './resources-add.component.html',
  styleUrls: ['./resources-add.component.scss']
})
export class ResourcesAddComponent implements OnInit {

  // Form controls for the user profile
  userProfileForm: FormGroup;

  // Arrays to store tag-like inputs
  previousEmployers: string[] = [];
  technicalSkills: string[] = [];
  softSkills: string[] = [];
  languagesKnown: string[] = [];

  // Temporary inputs for tag-like fields
  newEmployer: string = '';
  newTechnicalSkill: string = '';
  newSoftSkill: string = '';
  newLanguage: string = '';

  // Arrays to store project tech stacks
  projectTechStacks: string[][] = [[]];
  newTechStack: string = '';

  // Dropdown options
  genderOptions = ['Male', 'Female', 'Other'];
  languageOptions = [
    'Spoken','Written languages'
  ];
  projectComplexityOptions = ['Simple', 'Moderate', 'Complex'];

  showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
    this.userProfileForm = this.createUserProfileForm();
  }

  ngOnInit(): void {}

  createUserProfileForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      highestQualification: ['', Validators.required],
      yearOfGraduation: ['', [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear())]],
      totalExperience: ['', [Validators.required, Validators.min(0)]],
      jobTitle: ['', Validators.required],
      startDate: ['', Validators.required],
      keyResponsibilities: ['', Validators.required],
      availableFrom: ['', Validators.required],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      workingHoursPerWeek: ['', [Validators.required, Validators.min(0), Validators.max(168)]],
      overtimeCharges: ['', [Validators.required, Validators.min(0)]],
      projectsWorkedOn: this.fb.array([this.createProjectForm()])
    });
  }

  createProjectForm(): FormGroup {
    return this.fb.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
      projectDuration: ['', Validators.required],
      industryDomain: ['', Validators.required],
      projectDescription: ['', Validators.required],
      keyResponsibilities: ['', Validators.required],
      teamSize: ['', [Validators.required, Validators.min(1)]],
      contributionPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      projectComplexity: ['', Validators.required],
      outcomeImpact: ['', Validators.required],
      clientFeedback: ['', Validators.required]
    });
  }

  // Getters for form controls
  get projectsWorkedOn(): FormArray {
    return this.userProfileForm.get('projectsWorkedOn') as FormArray;
  }

  // Add/remove functions for projects
  addProject(): void {
    this.projectsWorkedOn.push(this.createProjectForm());
    this.projectTechStacks.push([]);
  }

  removeProject(index: number): void {
    this.projectsWorkedOn.removeAt(index);
    this.projectTechStacks.splice(index, 1);
  }

  // Add/remove functions for tag-like inputs
  addEmployer(): void {
    if (this.newEmployer?.trim() && !this.previousEmployers.includes(this.newEmployer.trim())) {
      this.previousEmployers.push(this.newEmployer.trim());
      this.newEmployer = '';
    }
  }

  removeEmployer(index: number): void {
    this.previousEmployers.splice(index, 1);
  }

  addTechnicalSkill(): void {
    if (this.newTechnicalSkill?.trim() && !this.technicalSkills.includes(this.newTechnicalSkill.trim())) {
      this.technicalSkills.push(this.newTechnicalSkill.trim());
      this.newTechnicalSkill = '';
    }
  }

  removeTechnicalSkill(index: number): void {
    this.technicalSkills.splice(index, 1);
  }

  addSoftSkill(): void {
    if (this.newSoftSkill?.trim() && !this.softSkills.includes(this.newSoftSkill.trim())) {
      this.softSkills.push(this.newSoftSkill.trim());
      this.newSoftSkill = '';
    }
  }

  removeSoftSkill(index: number): void {
    this.softSkills.splice(index, 1);
  }

  addLanguage(): void {
    if (this.newLanguage && !this.languagesKnown.includes(this.newLanguage)) {
      this.languagesKnown.push(this.newLanguage);
      this.newLanguage = '';
    }
  }

  removeLanguage(index: number): void {
    this.languagesKnown.splice(index, 1);
  }

  addTechStack(projectIndex: number): void {
    if (this.newTechStack?.trim() && !this.projectTechStacks[projectIndex].includes(this.newTechStack.trim())) {
      this.projectTechStacks[projectIndex].push(this.newTechStack.trim());
      this.newTechStack = '';
    }
  }

  removeTechStack(projectIndex: number, techIndex: number): void {
    this.projectTechStacks[projectIndex].splice(techIndex, 1);
  }

  // Form submission
  submitForm(): void {
    if (this.userProfileForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.userProfileForm);
      return;
    }

    // Prepare the data in the required format
    const formData = this.userProfileForm.value;

    // Add the array fields that are managed separately
    const userData = {
      ...formData,
      previousEmployers: this.previousEmployers,
      technicalSkills: this.technicalSkills,
      softSkills: this.softSkills,
      languagesKnown: this.languagesKnown
    };

    // Add tech stack to each project
    userData.projectsWorkedOn = userData.projectsWorkedOn.map((project: any, index: number) => {
      return {
        ...project,
        techStackUsed: this.projectTechStacks[index]
      };
    });

    // Format the data as requested
    const finalData = {
      data: [userData]
    };

    // Log the data to console
    console.log('User Profile Data:', finalData);

    // Show loader
    this.showLoader = true;

    // Call service to save data
    this.superService.addCandidate(finalData).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (response.status) {
          this.notificationService.showSuccess('Candidate profile added successfully');
          this.router.navigate(['/super-admin/resources-list']);
        } else {
          this.notificationService.showError(response.message || 'Failed to add candidate profile');
        }
      },
      (error: any) => {
        this.showLoader = false;
        this.notificationService.showError(error.message || 'An error occurred while adding candidate profile');
      }
    );
  }

  // Helper function to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          }
        }
      }
    });
  }

  // Number validation for input fields
  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
