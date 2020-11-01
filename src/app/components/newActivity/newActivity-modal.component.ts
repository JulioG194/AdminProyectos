import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-activity-modal',
    templateUrl: './newActivity-modal.component.html',
    styleUrls: ['./newActivity-modal.component.scss']
  })

  export class NewActivityModalComponent implements OnInit {

    form: FormGroup;
    name: string;
    startDate: Date;
    endDate: Date;
    startD: Date;
    endD: Date;
    minDate: Date;
    maxDate: Date;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<NewActivityModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService) { }

    ngOnInit() {

      this.form = this.fb.group({
        name: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        description: ['', []],
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
        if (this.form.invalid) {
            return;
        }
        if (this.endD <= this.startD) {

          Swal.fire({
            icon: 'error',
            title: 'Fechas fuera de rango'
          });
          return;
        }
        this.dialogRef.close(this.form.value);
    }
}
