import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-admin-project-listing',
  templateUrl: './supplier-admin-project-listing.component.html',
  styleUrls: ['./supplier-admin-project-listing.component.scss']
})
export class SupplierAdminProjectListingComponent implements OnInit {
  activeComponent: number = 2;  // 1 : Matched Project , 2 : All Project, 3: Shortlisted, 4: Applied Projects

  ngOnInit(): void {

  }

  changeComponent(componentNumber: number) {
    this.activeComponent = componentNumber;
  }
}
