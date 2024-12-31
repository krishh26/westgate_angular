import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-project-manger-header-two',
  templateUrl: './project-manger-header-two.component.html',
  styleUrls: ['./project-manger-header-two.component.scss']
})
export class ProjectMangerHeaderTwoComponent {
  loginUser: any;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public router: Router,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  navUrlArr = [
    { route: '/project-manager/project/all', title: 'Live Projects' },
    { route: '/project-manager/project/todo-task', title: 'To Do Task' },
    // { route: '/project-manager/project/todo-task', title: 'My Projects' },
  ];


  logout(): void {
    this.authService.logout();
  }
}
