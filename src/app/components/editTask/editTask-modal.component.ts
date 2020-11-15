import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from 'src/app/models/task.interface';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.interface';

@Component({
    selector: 'app-edit-task-modal',
    templateUrl: './editTask-modal.component.html',
    styleUrls: ['./editTask-modal.component.scss']
  })

  export class EditTaskModalComponent implements OnInit {

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
    task: Task;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<EditTaskModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService) {
      }

    ngOnInit() {
      this.task = this.data.task;
      this.form = this.fb.group({
        name: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        description: ['', []],
        startDate: [{value: this.task.startDate, disabled: true}, [Validators.required]],
        endDate: ['', [Validators.required]],
        delegateTask: ['', [Validators.required]]
      });
      this.form.patchValue({
        name: this.task.name,
        description: this.task.description,
        endDate: this.task.endDate,
        delegateTask: this.task.delegate
      });

      this.minDate = this.data.startDate;
      this.maxDate = this.data.endDate;
      this.delegates = this.data.delegates;
      this.deleg = this.task.delegate;

      const toSelect = this.delegates.find(c => c.uid === this.deleg.uid);
      this.form.get('delegateTask').setValue(toSelect);
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
        if (!this.form.get('name').valid ||
            !this.form.get('delegateTask').valid ||
            !this.form.get('description').valid) {
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
