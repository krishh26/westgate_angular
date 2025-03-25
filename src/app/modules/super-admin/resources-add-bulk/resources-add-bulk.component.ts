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

    if (target.files.length !== 1) {
      this.notificationService.showError('Please select only one file');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        let data = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

        // Remove header row and empty rows
        const headers = data[0];
        data = data.slice(1).filter(row => row.length > 0);

        // Convert Excel data to resource objects with all fields matching resources-add
        const jsonData = data.map(row => ({
          roleId: this.roleId,
          supplierId: this.supplierID,
          fullName: this.getValueOrEmpty(row[0]),
          email: this.getValueOrEmpty(row[1]),
          phoneNumber: this.getValueOrEmpty(row[2]),
          jobTitle: this.getValueOrEmpty(row[3]),
          totalExperience: this.getValueOrEmpty(row[4]),
          highestQualification: this.getValueOrEmpty(row[5]),
          yearOfGraduation: this.getValueOrEmpty(row[6]),
          gender: this.getValueOrEmpty(row[7]),
          nationality: this.getValueOrEmpty(row[8]),
          currentLocation: this.getValueOrEmpty(row[9]),
          preferredLocation: this.getValueOrEmpty(row[10]),
          technicalSkills: this.convertToArray(row[11]),
          domainExpertise: this.convertToArray(row[12]),
          certifications: this.convertToArray(row[13]),
          languagesKnown: this.convertToArray(row[14]),
          hourlyRate: this.getValueOrEmpty(row[15]),
          workingHoursPerWeek: this.getValueOrEmpty(row[16]),
          availableFrom: this.convertExcelDate(row[17]),
          noticePeriod: this.getValueOrEmpty(row[18]),
          totalCost: this.getValueOrEmpty(row[19]),
          resourceType: this.getValueOrEmpty(row[20]),
          employmentType: this.getValueOrEmpty(row[21]),
          currentCTC: this.getValueOrEmpty(row[22]),
          expectedCTC: this.getValueOrEmpty(row[23]),
          willingToRelocate: this.getValueOrEmpty(row[24]) === 'true',
          resumeUrl: this.getValueOrEmpty(row[25])
        }));

        this.uploadResources(jsonData);
      } catch (error) {
        this.spinner.hide();
        this.notificationService.showError('Error processing file. Please check the file format.');
      }
    };

    reader.readAsBinaryString(target.files[0]);
  }

  private getValueOrEmpty(value: any): any {
    return value == null ? "" : value;
  }

  private convertToArray(value: string): string[] {
    if (!value) return [];
    return value.split(',').map(item => item.trim());
  }

  private convertExcelDate(serial: number): string {
    if (!serial) return '';
    const excelEpoch = new Date(Date.UTC(1900, 0, 1));
    const days = Math.floor(serial - 2);
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + days);
    return excelEpoch.toISOString().split('T')[0];
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
