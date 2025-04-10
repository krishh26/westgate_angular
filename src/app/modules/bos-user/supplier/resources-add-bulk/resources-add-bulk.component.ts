import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-resources-add-bulk',
  templateUrl: './resources-add-bulk.component.html',
  styleUrls: ['./resources-add-bulk.component.scss']
})
export class ResourcesAddBulkComponent implements OnInit {
  showLoader: boolean = false;
  supplierData: any = [];
  supplierID: string = '';
  roleId: string = '';

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem("supplierData");
    this.roleId = localStorage.getItem("selectedRoleId") || '';

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

        // Get hourly rate as a number
        const hourlyRateValue = row[13];
        const hourlyRate = hourlyRateValue ? Number(hourlyRateValue) : 0;

        return {
          roleId: this.roleId,
          supplierId: this.supplierID,
          fullName: this.getValueOrEmpty(row[0]),
          gender: this.getValueOrEmpty(row[1]),
          nationality: this.getValueOrEmpty(row[2]),
          highestQualification: this.getValueOrEmpty(row[3]),
          yearOfGraduation: this.getValueOrEmpty(row[4]),
          totalExperience: this.getValueOrEmpty(row[5]),
          startDate: typeof row[6] === 'number' ? convertExcelDate(row[6]) : replaceNullWithEmptyString(row[6]),
          keyResponsibilities: this.getValueOrEmpty(row[7]),
          previousEmployers: this.getValueOrEmpty(row[8]),
          technicalSkills: this.getValueOrEmpty(row[9]),
          softSkills: this.getValueOrEmpty(row[10]),
          languagesKnown: this.convertToArray(row[11]),
          availableFrom:  typeof row[12] === 'number' ? convertExcelDate(row[12]) : replaceNullWithEmptyString(row[12]),
          hourlyRate: hourlyRate,
          projectName: this.convertToArray(row[14]),
          clientName: this.getValueOrEmpty(row[15]),
          projectDuration: this.getValueOrEmpty(row[16]),
          industryDomain: this.convertExcelDate(row[17]),
          projectDescription: this.getValueOrEmpty(row[18]),
          techStackUsed: this.getValueOrEmpty(row[19]),
          teamSize: this.getValueOrEmpty(row[20]),
          contributionPercentage: this.getValueOrEmpty(row[21]),
          projectComplexity: this.getValueOrEmpty(row[22]),
          outcomeImpact: this.getValueOrEmpty(row[23]),
          clientFeedback: this.getValueOrEmpty(row[24]),
        };
      });

      console.log(jsonData);
      const payload = {
        data: jsonData
      };
      this.spinner.show();
      this.superService.addCandidate(payload).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.status == true) {

            console.log('1', res?.status);
            console.log(res);

            this.notificationService.showSuccess(res?.message);
            window.location.reload();
            this.router.navigate(['/boss-user/resources-list']);
          } else {
            this.spinner.hide();
            console.log('1', res?.status);
            this.notificationService.showError(res?.message);

          }
        },
        (error) => {
          this.spinner.hide();
          this.notificationService.showError(error?.error?.message);

        }
      );
    };

    reader.readAsBinaryString(target.files[0]);
  }

  private getValueOrEmpty(value: any): any {
    return value == null ? "" : value;
  }

  private convertToArray(value: any): string[] {
    if (!value) return [];
    // Convert value to string if it's not already
    const stringValue = String(value);
    return stringValue.split(',').map(item => item.trim());
  }

  private convertExcelDate(value: any): string {
    if (!value) return '';

    try {
      // If it's already a date string, return it
      if (typeof value === 'string') {
        return value;
      }

      // Convert to number if it's not already
      const serial = Number(value);
      if (isNaN(serial)) return '';

      const excelEpoch = new Date(Date.UTC(1900, 0, 1));
      const days = Math.floor(serial - 2);
      excelEpoch.setUTCDate(excelEpoch.getUTCDate() + days);

      // Check if the date is valid before converting to ISO string
      if (isNaN(excelEpoch.getTime())) return '';

      return excelEpoch.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  }

  private convertToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
    }
    return false;
  }

  private uploadResources(resources: any[]) {
    this.spinner.show();
    const payload = { data: resources };

    this.superService.addCandidate(payload).subscribe({
      next: (response) => {
        this.spinner.hide();
        if (response?.status) {
          this.notificationService.showSuccess('Resources uploaded successfully');
          this.activeModal.close('success');
          window.location.reload();
        } else {
          this.notificationService.showError(response?.message || 'Upload failed');
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Error uploading resources');
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
