import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-case-study-bulk-add',
  templateUrl: './case-study-bulk-add.component.html',
  styleUrls: ['./case-study-bulk-add.component.css']
})
export class CaseStudyBulkAddComponent {

  showLoader: boolean = false;
  supplierData: any = [];
  supplierID: string = '';

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) {
    this.supplierData = localStorage.getItem("supplierData");
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);

      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
  }


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

      // Improved filter to remove empty or nearly empty rows
      data = data.filter(row => {
        // Check if row has actual content (not just empty cells)
        return row.length > 0 && row.some(cell =>
          cell !== null &&
          cell !== undefined &&
          String(cell).trim() !== ''
        );
      });

      console.log('Filtered rows count:', data.length);

      // Function to replace null or undefined values with empty strings
      const replaceNullWithEmptyString = (value: any) => value == null ? "" : value;

      // Function to convert Excel date serial to human-readable date
      const convertExcelDate = (serial: number) => {
        const excelEpoch = new Date(Date.UTC(1900, 0, 1)); // Excel epoch starts on 1900-01-01
        const days = Math.floor(serial - 2); // Subtract 2 to adjust for Excel leap year bug
        excelEpoch.setUTCDate(excelEpoch.getUTCDate() + days);
        return excelEpoch.toISOString().split('T')[0]; // Convert to ISO string and remove time
      };

      // Map the data to desired JSON format with null values replaced
      const jsonData = data.map(row => {
        return {
          userId: this.supplierID,
          name: replaceNullWithEmptyString(row[0]),              // row[0]
          clientName: replaceNullWithEmptyString(row[1]),        // row[1]
          description: replaceNullWithEmptyString(row[2]),       // row[2]
          problem: replaceNullWithEmptyString(row[3]),           // row[3]
          solutionProvided: replaceNullWithEmptyString(row[4]),  // row[4]
          resultAchieved: replaceNullWithEmptyString(row[5]),    // row[5]
          technologies: replaceNullWithEmptyString(row[6]),      // row[6]
          cost: replaceNullWithEmptyString(row[7]),              // row[7]
          resourcesUsed: replaceNullWithEmptyString(row[8]),     // row[8]
          industry: replaceNullWithEmptyString(row[9]),          // row[9]
          type: replaceNullWithEmptyString(row[10]),             // row[10]
          date: replaceNullWithEmptyString(row[11]),              // row[11]
          contractDuration: typeof row[12] === 'number'
            ? convertExcelDate(row[12])
            : replaceNullWithEmptyString(row[12]),               // row[12]

        };
      });

      console.log('Processed data entries:', jsonData.length);
      console.log('Data to be sent:', jsonData);

      const payload = {
        data: jsonData
      };
      this.spinner.show();
      this.projectService.addBulkCaseStudy(payload).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.status == true) {
            this.showLoader = false;
            console.log('1', res?.status);
            console.log(res);

            this.notificationService.showSuccess(res?.message);
            window.location.reload();
            this.router.navigate(['/super-admin/admin-case-study-list']);
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

