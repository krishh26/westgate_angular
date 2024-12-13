import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
@Component({
  selector: 'app-projectMailSend',
  templateUrl: './projectMailSend.component.html',
  styleUrls: ['./projectMailSend.component.css']
})
export class ProjectMailSendComponent implements OnInit {
  @Input() projectName: string = ''; // Passed from the parent
  @Input() bosId: string = ''; // Passed from the parent
  @Input() supplierName: string = ''; // Passed from the parent
  message: string = '';
  preFilledMessage: string = '';
  showLoader: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
  ) { }

  ngOnInit(): void {
    // Construct the email message
    this.preFilledMessage = `Subject: New Projects Available on OSS System

Dear Supplier,

This is an automated message from WestGate IT Hub. New projects have been posted on the OSS System. Please log in to the portal to review and shortlist opportunities of interest.

For any questions or assistance with bidding, contact us at [ subham@westgateithub.com / 7781978685 ].

We appreciate your partnership and look forward to your participation!

Best regards,
WestGate IT Hub`;
  }

  submit() {
    this.showLoader = true;
  
    this.superService.projectMailSend().subscribe(
      (response) => {
        if (response?.status === true) {
          this.showLoader = false;
          this.notificationService.showSuccess('', 'Mail sent successfully.');
          this.activeModal.close(); // Close modal on success
        } else {
          this.notificationService.showError(response?.message || 'Failed to send mail.');
          this.showLoader = false;
        }
      },
      (error) => {
        this.notificationService.showError(error?.message || 'An error occurred.');
        this.showLoader = false;
      }
    );
  }
  
}
