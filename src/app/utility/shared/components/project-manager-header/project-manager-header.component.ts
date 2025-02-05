import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-project-manager-header',
  templateUrl: './project-manager-header.component.html',
  styleUrls: ['./project-manager-header.component.scss']
})
export class ProjectManagerHeaderComponent {
  loginUser: any;
 
   constructor(
     private authService: AuthService,
     private localStorageService: LocalStorageService,
     public router: Router,
   ) {
     this.loginUser = this.localStorageService.getLogger();
   }
 
   navUrlArr = [
     // { route: '/project-manager/project/all', title: 'Live Projects' },
     { route: '/project-manager/project/todo-task', title: 'To Do Task' },
     { route: '/project-manager/project/bid-manager-to-action', title: 'My Projects' },
   ];
 
 
   logout(): void {
     this.authService.logout();
   }
}
