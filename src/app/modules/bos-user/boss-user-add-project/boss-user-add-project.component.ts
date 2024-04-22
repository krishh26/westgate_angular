import { formatDate } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-boss-user-add-project',
  templateUrl: './boss-user-add-project.component.html',
  styleUrls: ['./boss-user-add-project.component.scss']
})
export class BossUserAddProjectComponent {

  systemCalendarFormat!: string;

  ngOnInit(): void {
    // Detect system calendar format
    const date = new Date();
    const format = new Intl.DateTimeFormat([], { calendar: 'auto' }).resolvedOptions().calendar;
    this.systemCalendarFormat = format;

    // You can set the initial value of the input field here
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en', format);
    // Set formattedDate to your input field
  }

}
