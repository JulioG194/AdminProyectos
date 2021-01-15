import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-contact-form-modal',
    templateUrl: './contactForm-modal.component.html',
    styleUrls: ['./contactForm-modal.component.scss']
  })

  export class ContactFormModalComponent implements OnInit {

    form: FormGroup;
    name: string;
    client: string;
    description: string;
    startDate: Date;
    endDate: Date;
    typeProj: string;

    types: any = ['Proyecto de Investigación',
                  'Proyecto de Inversión',
                  'Proyecto de Infraestructura',
                  'Proyecto de Informática',
                  'Proyecto de Construcción',
                  'Proyecto de Desarrollo de Productos y Servicios',
                  'Proyecto de Desarrollo Sostenible',
                  'Otro Tipo de Proyecto'];
    type: any;
    startD: Date;
    endD: Date;
    minDate = new Date();

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<ContactFormModalComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private validators: ValidatorService) {
      }

    ngOnInit() {

      this.form = this.fb.group({
        name: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        client: ['', Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        description: ['', []],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        typeProj: ['', [Validators.required]]
      });

    }

    get projectFormControl() {
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
