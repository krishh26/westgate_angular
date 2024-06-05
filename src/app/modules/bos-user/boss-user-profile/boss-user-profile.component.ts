import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-boss-user-profile',
  templateUrl: './boss-user-profile.component.html',
  styleUrls: ['./boss-user-profile.component.scss']
})
export class BossUserProfileComponent {

  userData!: any;
  userForm: FormGroup;


  constructor(
    private authservice: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      category: [''],
      _id: [''],
      userName: [''],
      email: [''],
      designation: [''],
      doj: ['']
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.authservice.getUserdata().subscribe((response: any) => {
      if (response?.status) {
        this.userData = response?.data;
        console.log(this.userData?.email);
        
        this.userForm.patchValue({
          category: this.userData?.category,
          _id: this.userData?._id,
          userName: this.userData?.userName,
          email: this.userData?.email,
          designation: this.userData?.designation,
          doj: this.userData?.doj
        });
      }
    });
  }

  onSubmit(): void {
    // if (this.userForm.valid) {
    //   this.authService.updateUserdata(this.userForm.value).subscribe(response => {
    //     console.log('Data updated successfully:', response);
    //     alert('Profile updated successfully!');
    //   }, error => {
    //     console.error('Error updating data:', error);
    //   });
    // }
  }
}
