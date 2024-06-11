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
  
      // Remove the first row (A1 row) which contains headers
      const headers = data[0];
      data = data.slice(1);
  
      // Filter out empty arrays
      data = data.filter(row => row.length > 0);
  
      // Function to replace null or undefined values with empty strings
      const replaceNullWithEmptyString = (value: any) => value == null ? "" : value;
  
      // Map the data to desired JSON format with null values replaced
      const jsonData = data.map(row => {
        return {
          projectName: replaceNullWithEmptyString(row[0]),
          category: replaceNullWithEmptyString(row[1]),
          industry: replaceNullWithEmptyString(row[2]),
          description: replaceNullWithEmptyString(row[3]),
          BOSID: replaceNullWithEmptyString(row[4]),
          publishDate: replaceNullWithEmptyString(row[5]),
          submission: replaceNullWithEmptyString(row[6]),
          link: replaceNullWithEmptyString(row[7]),
          periodOfContractStart: replaceNullWithEmptyString(row[8]),
          periodOfContractEnd: replaceNullWithEmptyString(row[9]),
          dueDate: replaceNullWithEmptyString(row[10]),
          value: replaceNullWithEmptyString(row[11]),
          projectType: replaceNullWithEmptyString(row[12]),
          website: replaceNullWithEmptyString(row[13]),
          mailID: replaceNullWithEmptyString(row[14]),
          clientType: replaceNullWithEmptyString(row[15]),
          clientName: replaceNullWithEmptyString(row[16]),
          noticeReference: replaceNullWithEmptyString(row[17]),
          CPVCodes: replaceNullWithEmptyString(row[18])
        };
      });
  
      console.log(jsonData);
  
      // Now you can make your API call with the processed data
      this.projectService.addProject(jsonData).subscribe(
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

