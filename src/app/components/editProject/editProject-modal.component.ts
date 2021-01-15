import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Project } from 'src/app/models/project.interface';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-project-modal',
    templateUrl: './editProject-modal.component.html',
    styleUrls: ['./editProject-modal.component.scss']
  })

  export class EditProjectModalComponent implements OnInit {

    form: FormGroup;
    name: string;
    client: string;
    description: string;
    startDate: Date;
    endDate: Date;
    typeProj: string;
    project: Project;

    types: any = ['Proyecto de Investigación',
                  'Proyecto de Inversión',
                  'Proyecto de Infraestructura',
                  'Proyecto de Desarrollo de Software',
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
      private dialogRef: MatDialogRef<EditProjectModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService) {
      }

    ngOnInit() {
      this.project = this.data.project;
      this.form = this.fb.group({
        name: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        client: ['', Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        description: ['', []],
        startDate: [{value: this.project.startDate, disabled: true}, [Validators.required]],
        endDate: ['', [Validators.required]],
        typeProj: ['', [Validators.required]]
      });
      this.form.patchValue({
        name: this.project.name,
        client: this.project.client,
        description: this.project.description,
        endDate: this.project.endDate,
        typeProj: this.project.type,
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
        if (!this.form.get('name').valid ||
            !this.form.get('client').valid ||
            !this.form.get('typeProj').valid ||
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
        Swal.fire({
              title: '¿Estás seguro?',
              text: 'No podrás revertir esta acción!',
              icon: 'warning',
              showCancelButton: true,
              showCloseButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Sí, editar el proyecto!'
          }).then((result) => {
              if (result.value) {
              this.dialogRef.close(this.form.value);
            }
          });
      }
  }
