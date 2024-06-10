import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-boss-user-bulk-entry',
  templateUrl: './boss-user-bulk-entry.component.html',
  styleUrls: ['./boss-user-bulk-entry.component.scss']
})
export class BossUserBulkEntryComponent {

  showLoader: boolean = false;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService
  ) { }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
  
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  
    const reader: FileReader = new FileReader();
  
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
      /* save data */
      let data = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
  
      // Remove the first row (A1 row)
      data = data.slice(1);
  
      // Filter out empty arrays
      data = data.filter(row => row.length > 0);
  
      console.log(data);
  
      // Now you can make your API call with the processed data
      this.projectService.addProject(data).subscribe(
        (response) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.router.navigate(['/boss-user/project-list']);
          } else {
            this.notificationService.showError(response?.message);
            this.showLoader = false;
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
        }
      );
    };
  
    reader.readAsBinaryString(target.files[0]);
  }

}

