import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resources-add-bulk',
  templateUrl: './resources-add-bulk.component.html',
  styleUrls: ['./resources-add-bulk.component.scss']
})
export class ResourcesAddBulkComponent implements OnInit {
  showLoader: boolean = false;
  supplierData: any = [];
  supplierID: string = '';
  roleId: string[] = [];
  exchangeRate: number = 114.32;
  workingDaysPerYear: number = 240;
  hoursPerDay: number = 8;
  ukMultiplier: number = 3;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem("supplierData");
    const storedRoleIds = localStorage.getItem("selectedRoleId");

    // Parse roleIds from localStorage
    if (storedRoleIds) {
      try {
        // First try to parse as JSON array
        this.roleId = JSON.parse(storedRoleIds);
      } catch (e) {
        // If not a valid JSON, treat as a single value and convert to array
        this.roleId = [storedRoleIds];
      }
    }

    console.log('Role IDs:', this.roleId); // Log roleIds for debugging

    if (storedData) {
      this.supplierData = JSON.parse(storedData);
      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }

    this.fetchExchangeRate();
  }

  fetchExchangeRate() {
    const apiUrl = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_n1aAXw7HKXT0Epyvzptrkg4cO2Q23FmFwgiewENj';
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response && response.rates && response.rates.INR) {
          this.exchangeRate = parseFloat(response.rates.INR.toFixed(2));
        }
      },
      (error) => {
        // fallback to default
      }
    );
  }

  parseNumericValue(value: string | number): number {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    }
    return value || 0;
  }

  formatIndianCurrency(amount: number): string {
    if (!amount) return '';
    const [integerPart, decimalPart] = amount.toFixed(2).toString().split('.');
    let formattedInteger = '';
    let i = integerPart.length;
    while (i > 0) {
      if (i > 3) {
        const chunkSize = (i - 3) > 0 && (i - 3) % 2 === 0 ? 2 : 1;
        formattedInteger = ',' + integerPart.substring(i - chunkSize, i) + formattedInteger;
        i -= chunkSize;
      } else {
        formattedInteger = integerPart.substring(0, i) + formattedInteger;
        break;
      }
    }
    return formattedInteger + (decimalPart ? '.' + decimalPart : '');
  }

  formatUKCurrency(amount: number): string {
    if (!amount) return '';
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  calculateRatesFromCTC(ctc: number) {
    const poundsEquivalent = ctc / this.exchangeRate;
    const poundsPerDay = poundsEquivalent / this.workingDaysPerYear;
    const ukDayRate = poundsPerDay * this.ukMultiplier;
    const ukHourlyRate = ukDayRate / this.hoursPerDay;
    const indianDayRate = ctc / this.workingDaysPerYear;
    return {
      ukHourlyRate: this.formatUKCurrency(ukHourlyRate),
      ukDayRate: this.formatUKCurrency(ukDayRate),
      indianDayRate: this.formatIndianCurrency(indianDayRate),
      formattedCTC: this.formatIndianCurrency(ctc)
    };
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

        let ctcValue = this.getValueOrEmpty(row[12]);
        let ctcNumericValue = this.parseNumericValue(ctcValue);
        let ratesCalculated = { ukHourlyRate: '', ukDayRate: '', indianDayRate: '', formattedCTC: '' };
        let ukHourlyRateNum = 0, ukDayRateNum = 0, indianDayRateNum = 0;
        if (ctcNumericValue > 0) {
          // Calculate rates as numbers
          const poundsEquivalent = ctcNumericValue / this.exchangeRate;
          const poundsPerDay = poundsEquivalent / this.workingDaysPerYear;
          const ukDayRate = poundsPerDay * this.ukMultiplier;
          const ukHourlyRate = ukDayRate / this.hoursPerDay;
          const indianDayRate = ctcNumericValue / this.workingDaysPerYear;
          ukHourlyRateNum = +ukHourlyRate.toFixed(2);
          ukDayRateNum = +ukDayRate.toFixed(2);
          indianDayRateNum = +indianDayRate.toFixed(2);
          // For display, you can still use the formatted strings if needed
          ratesCalculated = this.calculateRatesFromCTC(ctcNumericValue);
        }
        return {
          supplierId: this.supplierID,
          fullName: this.getValueOrEmpty(row[0]),
          gender: this.getValueOrEmpty(row[1]),
          nationality: this.getValueOrEmpty(row[2]),
          highestQualification: this.getValueOrEmpty(row[3]),
          yearOfGraduation: this.getValueOrEmpty(row[4]),
          totalExperience: this.getValueOrEmpty(row[5]),
          startDate: typeof row[6] === 'number' ? convertExcelDate(row[6]) : replaceNullWithEmptyString(row[6]),
          keyResponsibilities: this.getValueOrEmpty(row[7]),
          previousEmployers: this.convertToArray(row[8]),
          technicalSkills: this.convertToArray(row[9]),
          softSkills: this.convertToArray(row[10]),
          languagesKnown: this.convertToArray(row[11]),
          ctc: ctcNumericValue,
          ...(ctcNumericValue > 0 ? {
            ukHourlyRate: ukHourlyRateNum,
            ukDayRate: ukDayRateNum,
            indianDayRate: indianDayRateNum
          } : {}),
          currentRole: this.getValueOrEmpty(row[13]),
          roleId: this.convertToArray(row[14]),
          certifications: this.convertToArray(row[15]),
          projectsExecuted: this.getValueOrEmpty(row[16])
        };
      });

      console.log(jsonData);

      const payload = {
        data: jsonData
      };
      console.log(payload);
      // return
      this.spinner.show();
      this.superService.addCandidate(payload).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.status == true) {

            console.log('1', res?.status);
            console.log(res);

            this.notificationService.showSuccess(res?.message);
            window.location.reload();
            this.router.navigate(['/super-admin/resources-list']);
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

    // Ensure each resource has the roleId array
    resources.forEach(resource => {
      resource.roleId = this.roleId;
    });

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
