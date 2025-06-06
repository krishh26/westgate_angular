import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-superadmin-comment-modal',
  templateUrl: './superadmin-comment-modal.component.html',
  styleUrls: ['./superadmin-comment-modal.component.css']
})
export class SuperadminCommentModalComponent implements OnInit {

  @Input() supplier: any;
  @Input() itemType: string = 'supplier'; // 'supplier' or 'candidate'
  @Input() sourceComponent: string = '';
  userData!: any;

  userDataForm = {
    activeStatus: new FormControl("", [Validators.required]),
    active: new FormControl(false),
  };

  userForm = new FormGroup(this.userDataForm);

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private superadminService: SuperadminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    let commentString = '';
    if (this.supplier && this.supplier.activeStatus) {
      // If it's an object or array, extract the string
      if (typeof this.supplier.activeStatus === 'string') {
        commentString = this.supplier.activeStatus;
      } else if (Array.isArray(this.supplier.activeStatus) && this.supplier.activeStatus.length > 0) {
        // If it's an array, get the first string or extract from object
        const first = this.supplier.activeStatus[0];
        commentString = typeof first === 'string'
          ? first
          : (first.comment || first.text || first.message || '');
      } else if (typeof this.supplier.activeStatus === 'object') {
        // If it's an object, extract a likely string property
        commentString = this.supplier.activeStatus.comment || this.supplier.activeStatus.text || this.supplier.activeStatus.message || '';
      }
    }
    this.userForm.patchValue({
      activeStatus: commentString,
      active: false,
    });
    console.log('Modal initialized with:', {
      itemType: this.itemType,
      sourceComponent: this.sourceComponent,
      supplierId: this.supplier?._id
    });
  }

  close() {
    this.activeModal.dismiss();
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    console.log('Source component:', this.sourceComponent);
    console.log('Item type:', this.itemType);

    // Determine which API to call based on the source component
    if (this.sourceComponent === 'super-admin-supplier') {
      console.log('Calling supplier update API...');
      this.updateSupplier();
    } else {
      console.log('Calling candidate update API...');
      this.updateCandidate();
    }
  }

  updateSupplier() {
    const payload = {
      active: false,
      activeStatus: this.userForm.get('activeStatus')?.value
    };

    console.log('Updating supplier with payload:', payload);

    this.authService.updateUser(this.supplier._id, payload).subscribe(
      (response: any) => {
        console.log('Update supplier response:', response);
        if (response?.status) {
          this.notificationService.showSuccess(response?.message || 'Supplier updated successfully');
          this.activeModal.close(true);
        } else {
          this.notificationService.showError(response?.message || 'Failed to update supplier');
        }
      },
      (error: any) => {
        console.error('Error updating supplier:', error);
        this.notificationService.showError(error?.error?.message || 'Error updating supplier');
        this.activeModal.dismiss('Error');
      }
    );
  }

  updateCandidate() {
    const payload = {
      data: {
        active: false,
        inactiveComment: this.userForm.get('activeStatus')?.value
      }
    };

    console.log('Updating candidate with payload:', payload);

    this.superadminService.updateCandidate(this.supplier._id, payload).subscribe(
      (response: any) => {
        console.log('Update candidate response:', response);
        if (response?.status) {
          this.notificationService.showSuccess(response?.message || 'Candidate updated successfully');
          this.activeModal.close(true);
        } else {
          this.notificationService.showError(response?.message || 'Failed to update candidate');
        }
      },
      (error: any) => {
        console.error('Error updating candidate:', error);
        this.notificationService.showError(error?.error?.message || 'Error updating candidate');
        this.activeModal.dismiss('Error');
      }
    );
  }
}
