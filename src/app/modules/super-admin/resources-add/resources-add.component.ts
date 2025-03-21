import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resources-add',
  templateUrl: './resources-add.component.html',
  styleUrls: ['./resources-add.component.scss']
})
export class ResourcesAddComponent {

  addEditProjectForm = {
    name: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    industry: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required),
    resourcesUsed: new FormControl("", Validators.required),
    clientName: new FormControl("", Validators.required),
    contractValue: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    technologies: new FormControl("", Validators.required),
    maintenance: new FormControl("", Validators.required),
    contractDuration: new FormControl("", Validators.required),
  }

  resourcesForm: FormGroup = new FormGroup(this.addEditProjectForm);
  data: any;
  showLoader: boolean = false;

  ngOnInit(): void { }

  submitForm() { }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
