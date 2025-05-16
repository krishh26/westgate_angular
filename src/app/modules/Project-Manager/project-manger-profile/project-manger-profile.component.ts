import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-project-manger-profile',
  templateUrl: './project-manger-profile.component.html',
  styleUrls: ['./project-manger-profile.component.scss']
})
export class ProjectMangerProfileComponent implements OnInit {
  userData!: any;
  skills: any[] = [
    {
      id: 1,
      name: "Organization"
    },
    {
      id: 2,
      name: "Creativity"
    },
    {
      id: 3,
      name: "Leadership"
    },
    {
      id: 4,
      name: "Team Building"
    },
    {
      id: 5,
      name: "SEO"
    },
    {
      id: 6,
      name: "Social Media"
    },
    {
      id: 7,
      name: "Content Management"
    },
    {
      id: 8,
      name: "Data Analysis"
    }
  ]
  managesData: any[] = [
    {
      id: 1,
      name: "Graphic designers"
    },
    {
      id: 2,
      name: "Copy Writers"
    },
    {
      id: 3,
      name: "social media marketing manager"
    },
  ]
  reportToData: any[] = [
    {
      id: 1,
      name: "User 1"
    },
    {
      id: 2,
      name: "User 2"
    },
    {
      id: 3,
      name: "User 3"
    },
  ]

  userDataForm = {
    name: new FormControl("", [Validators.required,]),
    role: new FormControl({ value: "", disabled: true }),
    email: new FormControl({ value: "", disabled: true }),
    createdAt: new FormControl({ value: "", disabled: true }),
  };

  userForm = new FormGroup(this.userDataForm, []);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.authService.getUserData().subscribe((response: any) => {
      if (response?.status) {
        this.userData = response.data;
        console.log('response.data', response.data);
        this.userForm.controls['email'].setValue(response?.data?.email || "");
        this.userForm.controls['name'].setValue(response?.data?.name || "");
        this.userForm.controls['role'].setValue(response?.data?.role || "");

        // Format the created date if available
        if (response?.data?.createdAt) {
          const createdDate = new Date(response.data.createdAt);
          // Format date as dd/MM/yyyy
          const day = String(createdDate.getDate()).padStart(2, '0');
          const month = String(createdDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = createdDate.getFullYear();
          this.userForm.controls['createdAt'].setValue(`${day}/${month}/${year}`);
        }
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Error');
    });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return
    }
    this.authService.updateUser(this.userData._id, this.userForm.value).subscribe((response: any) => {
      if (response?.status) {
        this.notificationService.showSuccess(response?.message);
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Error');
    });
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
