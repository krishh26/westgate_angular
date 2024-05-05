import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier-dashboard-header',
  templateUrl: './supplier-dashboard-header.component.html',
  styleUrls: ['./supplier-dashboard-header.component.scss']
})
export class SupplierDashboardHeaderComponent {

  activeComponent: number = 2;  // 1 : Matched Project , 2 : All Project, 3: Shortlisted, 4: Applied Projects

  ngOnInit(): void {

  }

  changeComponent(componentNumber: number) {
    this.activeComponent = componentNumber;
  }

}
