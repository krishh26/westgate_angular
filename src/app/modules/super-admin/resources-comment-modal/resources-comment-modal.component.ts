import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
@Component({
  selector: 'app-resources-comment-modal',
  templateUrl: './resources-comment-modal.component.html',
  styleUrls: ['./resources-comment-modal.component.scss']
})
export class ResourcesCommentModalComponent implements OnInit {

  @Input() supplier: any;
  userData!: any;

  userDataForm = {
    inactiveComment: new FormControl("", [Validators.required]),
    active: new FormControl(true),
  };

  userForm = new FormGroup(this.userDataForm);

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private notificationService: NotificationService,
    private superadminService: SuperadminService
  ) { }

  ngOnInit() {
    if (this.supplier) {
      this.userForm.patchValue({
        inactiveComment: this.supplier.activeStatus || '',
        active: this.supplier.active || false,
      });
    }
  }

  close() {
    this.activeModal.dismiss();
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.superadminService.updateCandidate(this.supplier._id, this.userForm.value).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess(response?.message);
          this.activeModal.close();
        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || 'Error');
      }
    );
  }
}
