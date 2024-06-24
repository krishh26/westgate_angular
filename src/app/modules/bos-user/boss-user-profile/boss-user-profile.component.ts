import { NotificationService } from './../../../services/notification/notification.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-boss-user-profile',
  templateUrl: './boss-user-profile.component.html',
  styleUrls: ['./boss-user-profile.component.scss']
})
export class BossUserProfileComponent {
  userData!: any;
  skills :any[] = [
    {
      id : 1,
      name : "Organization"
    },
    {
      id : 2,
      name : "Creativity"
    },
    {
      id : 3,
      name : "Leadership"
    },
    {
      id : 4,
      name : "Team Building"
    },
    {
      id : 5,
      name : "SEO"
    },
    {
      id : 6,
      name : "Social Media"
    },
    {
      id : 7,
      name : "Content Management"
    },
    {
      id : 8,
      name : "Data Analysis"
    }
  ]

  userDataForm = {
    name: new FormControl("", [Validators.required,]),
    location: new FormControl("", [Validators.required]),
    email : new FormControl("", [Validators.required]),
    phoneNumber : new FormControl("", [Validators.required]),
    jobTitle : new FormControl("", [Validators.required]),
    professionalSkill : new FormControl("", [Validators.required]),
    reportTo : new FormControl("", [Validators.required]),
    manages : new FormControl("", [Validators.required]),
  };

  userForm = new FormGroup(this.userDataForm, []);

  constructor(
    private authService: AuthService,
    private notificationService : NotificationService
  ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.authService.getUserData().subscribe((response: any) => {
      if (response?.status) {
        console.log('Chnages DOne');
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || 'Error');
    });
  }

  onSubmit() {
    console.log('Submit Data');
  }
}
