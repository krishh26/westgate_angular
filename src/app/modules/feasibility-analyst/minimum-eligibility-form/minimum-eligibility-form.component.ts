import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-minimum-eligibility-form',
  templateUrl: './minimum-eligibility-form.component.html',
  styleUrls: ['./minimum-eligibility-form.component.scss']
})
export class MinimumEligibilityFormComponent implements OnInit {
  eligibility = {
    caseStudyRequired: new FormControl("", Validators.required),
    certifications: new FormControl("", Validators.required),
    policy: new FormControl("", Validators.required),
  }

  eligibilityForm: FormGroup;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private feasibilityService: FeasibilityService
  ) {
    this.eligibilityForm = new FormGroup(this.eligibility);
  }

  ngOnInit(): void {

  }

  submit() {
    console.log('project status', this.eligibilityForm.value);
    if(!this.eligibilityForm.valid) {
      return this.notificationService.showError('Please Fill Form.');
    }

    // this.feasibilityService
  }
}
