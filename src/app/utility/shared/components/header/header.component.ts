import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  loginUser: any;
  isMobileNavOpen = false;
  isDropdownOpen = false;


  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public router: Router,
    private notificationService: NotificationService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  navUrlArr = [
    { title: 'TO DO TASKS', route: '/boss-user/todo-task' },
  ];



  logout(): void {
    this.authService.logout();
    this.closeMobileNav();
  }

  // Toggle Mobile Navigation
  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  // Close Mobile Navigation when clicking a link
  closeMobileNav() {
    this.isMobileNavOpen = false;
    this.isDropdownOpen = false;
  }

  // Toggle Dropdown Menu
  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevents event bubbling
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
