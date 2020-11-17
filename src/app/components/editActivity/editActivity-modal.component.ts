import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Activity } from 'src/app/models/activity.interface';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-activity-modal',
    templateUrl: './editActivity-modal.component.html',
    styleUrls: ['./editActivity-modal.component.scss']
  })

  export class EditActivityModalComponent implements OnInit {

    form: FormGroup;
    name: string;
    startDate: Date;
    endDate: Date;
    startD: Date;
    endD: Date;
    minDate: Date;
    maxDate: Date;
    activity: Activity;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<EditActivityModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService) { }

    ngOnInit() {
      this.activity = this.data.activity;
      this.form = this.fb.group({
        name: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        description: ['', []],
      });
      this.form.patchValue({
        name: this.activity.name,
        description: this.activity.description,
        startDate: this.activity.startDate,
        endDate: this.activity.endDate,
      });

      this.minDate = this.data.startDate;
      this.maxDate = this.data.endDate;
    }

    get activityFormControl() {
        return this.form.controls;
    }

    inputEvent($event: { value: string | number | Date; }) {
        this.startD = new Date($event.value);
    }

    inputEvent2($event: { value: string | number | Date; }) {
        this.endD = new Date($event.value);
    }


    save() {
        if (!this.form.get('name').valid ||
            !this.form.get('description').valid) {
            return;
        }
        const startDate = this.form.get('startDate').value;
        const endDate = this.form.get('endDate').value;
        if (endDate <= startDate) {

          Swal.fire({
            icon: 'error',
            title: 'Fechas fuera de rango'
          });
          return;
        }
        this.dialogRef.close(this.form.value);
    }
}
