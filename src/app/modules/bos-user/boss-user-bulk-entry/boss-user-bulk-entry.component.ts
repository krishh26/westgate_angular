import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private superService: SuperadminService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
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

      // Function to convert Excel date serial to human-readable date
      const convertExcelDate = (serial: number) => {
        const excelEpoch = new Date(Date.UTC(1900, 0, 1)); // Excel epoch starts on 1900-01-01
        const days = Math.floor(serial - 2); // Subtract 2 to adjust for Excel leap year bug
        excelEpoch.setUTCDate(excelEpoch.getUTCDate() + days);
        return excelEpoch.toISOString().split('T')[0]; // Convert to ISO string and remove time
      };

      const jsonData = data.map(row => {
        const replaceNullWithEmptyString = (value: any) => value == null ? "" : value;

        // Convert a comma-separated string to an array, or return an empty array if the string is empty
        const parseCommaSeparatedField = (value: string) => {
          const cleanedValue = replaceNullWithEmptyString(value);
          return cleanedValue ? cleanedValue.split(',').map((item: any) => item.trim()) : [];
        };

        return {
          BOSID: replaceNullWithEmptyString(row[0]),
          projectName: replaceNullWithEmptyString(row[1]),
          description: replaceNullWithEmptyString(row[2]),
          noticeReference: replaceNullWithEmptyString(row[3]),
          dueDate: typeof row[4] === 'number' ? convertExcelDate(row[4]) : replaceNullWithEmptyString(row[4]),
          bidsubmissiontime: replaceNullWithEmptyString(row[5]),
          minValue: replaceNullWithEmptyString(row[6]) || '0',
          maxValue: replaceNullWithEmptyString(row[7]) || '0',
          publishDate: typeof row[8] === 'number' ? convertExcelDate(row[8]) : replaceNullWithEmptyString(row[8]),
          periodOfContractStart: typeof row[9] === 'number' ? convertExcelDate(row[9]) : replaceNullWithEmptyString(row[9]),
          periodOfContractEnd: typeof row[10] === 'number' ? convertExcelDate(row[10]) : replaceNullWithEmptyString(row[10]),
          CPVCodes: replaceNullWithEmptyString(row[11]),
          link: replaceNullWithEmptyString(row[12]),
          website: replaceNullWithEmptyString(row[13]),
          clientType: replaceNullWithEmptyString(row[14]),
          clientName: replaceNullWithEmptyString(row[15]),
          projectType: replaceNullWithEmptyString(row[16]),
          industry: parseCommaSeparatedField(row[17]), // Convert industry string to an array
          category: parseCommaSeparatedField(row[18]), // Convert category string to an array
          mailID: replaceNullWithEmptyString(row[19]),
          categorisation: replaceNullWithEmptyString(row[20]),
          documentsLink: replaceNullWithEmptyString(row[21]),
          linkToPortal: replaceNullWithEmptyString(row[22]),
          loginID: replaceNullWithEmptyString(row[23]),
          password: replaceNullWithEmptyString(row[24]),
          chatGptLink: replaceNullWithEmptyString(row[25]),
        };
      });



      console.log(jsonData);
      const payload = {
        data: jsonData
      };
      this.spinner.show();
      this.projectService.addProject(payload).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.status == true) {
            this.showLoader = false;
            console.log('1', res?.status);
            console.log(res);

            this.notificationService.showSuccess(res?.message);
            window.location.reload();
            this.router.navigate(['/boss-user/project-list']);
          } else {
            this.spinner.hide();
            console.log('1', res?.status);
            this.notificationService.showError(res?.message);
            this.showLoader = false;
          }
        },
        (error) => {
          this.spinner.hide();
          this.notificationService.showError(error?.error?.message);
          this.showLoader = false;
        }
      );
    };

    reader.readAsBinaryString(target.files[0]);
  }

  close() {
    this.activeModal.close();
  }

}

