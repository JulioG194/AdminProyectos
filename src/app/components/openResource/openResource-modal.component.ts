import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.interface';


@Component({
    selector: 'app-open-resource-modal',
    templateUrl: './openResource-modal.component.html',
    styleUrls: ['./openResource-modal.component.scss']
  })

  export class OpenResourceModalComponent implements OnInit {

    form: FormGroup;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    deleg: User;
    delegates: User[] = [];
    startD: Date;
    endD: Date;
    minDate: Date;
    maxDate: Date;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<OpenResourceModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService) {
      }

    ngOnInit() {

      this.form = this.fb.group({
        name: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        description: ['', []],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        delegateTask: ['', [Validators.required]]
      });

      this.minDate = this.data.startDate;
      this.maxDate = this.data.endDate;
      this.delegates = this.data.delegates;
    }

    get taskFormControl() {
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
        console.log(this.form.value);
        this.dialogRef.close(this.form.value);
      }
  }
