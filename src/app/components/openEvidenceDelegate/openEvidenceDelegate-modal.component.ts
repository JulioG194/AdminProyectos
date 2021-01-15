import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Evidence } from 'src/app/models/evidence.interface';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.interface';
import { EvidenceService } from '../../services/evidence.service';
import { ProjectService } from '../../services/project.service';


@Component({
    selector: 'app-open-evidence-modal-delegate',
    templateUrl: './openEvidenceDelegate-modal.component.html',
    styleUrls: ['./openEvidenceDelegate-modal.component.scss']
  })

  export class OpenEvidenceDelegateModalComponent implements OnInit {

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
    projectId: string;
    activityId: string;
    taskId: string;
    filesToUploadFirebase: Evidence [] = [];
    evidences: any[] = [];
    userGugo: User;
    progress: number;
    tskProgress: number;
    observations: any[] = [];
    taskName: string;
    manager: User;
    disableButton: boolean;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<OpenEvidenceDelegateModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService,
      private evidenceService: EvidenceService,
      private projectService: ProjectService) {
      }

    ngOnInit() {
       this.form = this.fb.group({
        comment: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        progress: ['',  Validators.compose([Validators.required])],
        file: ['']
      });
       this.disableButton = false;
       this.projectId = this.data.projectId;
       this.activityId = this.data.activityId;
       this.taskId = this.data.taskId;
       this.userGugo = this.data.userGugo;
       this.taskName = this.data.taskName;
       this.manager = this.data.manager;
       console.log(this.manager);
       console.log(this.projectId);
       console.log(this.activityId);
       console.log(this.taskId);
       console.log(this.disableButton);
       this.getEvidences();
       this.getTask();
       this.getObservations();
    }

    get taskFormControl() {
    return this.form.controls;
  }

      getEvidences() {
        this.evidenceService.getEvidences(this.taskId).subscribe((evds) => {
          evds.map((evd: any) => {
                 if (evd.createdAt) {
                   evd.createdAt = new Date(evd.createdAt.seconds * 1000);
                 }
          });
          this.evidences = evds;
          console.log(this.evidences);
        });
      }
       handleFileInput(files: FileList) {
        for (let index = 0; index < files.length; index++) {
          const evidence: Evidence = {
              file: files.item(index),
              fileName: files.item(index).name,
              size: files.item(index).size,
              type: files.item(index).type,
              tid: this.taskId
          };
          this.filesToUploadFirebase.push(evidence);
        }
        console.log(this.filesToUploadFirebase.length);
        console.log(this.disableButton)
  }

  onUpdateFiles() {
    try {
      const newUser: User = {
            uid: this.userGugo.uid,
            displayName: this.userGugo.displayName,
            email: this.userGugo.email,
            photoURL: this.userGugo.photoURL
         };
      this.evidenceService.uploadEvidencesFirebase(this.filesToUploadFirebase, newUser, this.taskId);
      this.disableButton = true;
      Swal.fire({
        icon: 'success',
        title: 'Subir Evidencia',
        text: 'Archivo subido con exito',
        confirmButtonText: 'Listo!',
        showCloseButton: true
      });
      this.onClearFiles();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Subir Evidencia',
        text: `Ha ocurrido un error ${error}`,
        confirmButtonText: 'Listo!',
        showCloseButton: true,
      });
    }
  }

  onClearFiles() {
    this.filesToUploadFirebase = [];
    this.form.get('file').reset();
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }

   updateTskProg(projectId: string, activityId: string, taskId: string, progress: number) {
      Swal.fire({
              allowOutsideClick: false,
              text: 'Por favor, espere...',
              timer: 2500,
              icon: 'info',
            });
      Swal.showLoading();
      this.projectService.updateTaskProgress(projectId, activityId, taskId, progress).subscribe(data => {
      Swal.fire({
              allowOutsideClick: false,
              text: 'Progreso de tarea actualizado',
              timer: 2000,
              icon: 'success',
            });
      Swal.showLoading();
    });
      this.projectService.sendNotificationSetProgTask(this.manager, this.userGugo, this.taskName, this.projectId).subscribe(data => console.log(data));
  }


  getTask() {
    this.projectService.getTask(this.projectId, this.activityId, this.taskId).subscribe( tsk => {
      this.tskProgress = tsk.progress;
    });
  }

  getObservations() {
    this.projectService.getObservations(this.projectId, this.activityId, this.taskId).subscribe(obs => {
       obs.map((ob: any) => {
                 if (ob.createdAt) {
                   ob.createdAt = new Date(ob.createdAt.seconds * 1000);
                 }
          });
       this.observations = obs;
    });
  }

  getValueProgress() {
    const { progress } = this.form.value;
    if (progress === '') {
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha ingresado ningún valor',
            showCloseButton: true,
            confirmButtonText: 'Listo!'
          });
    }
    if (progress !== '' && !this.disableButton) {
         Swal.fire({
            icon: 'info',
            title: 'Info',
            text: 'Recuerda, adjuntar tu evidencia, para actualizar el progreso',
            showCloseButton: true,
            confirmButtonText: 'Listo!'
          });
    }
    if (progress !== '' && this.disableButton) {
      if (progress > 100) {
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se admite un progreso mayor al 100%',
            showCloseButton: true,
            confirmButtonText: 'Listo!'
          });
         return;
    }
      if (progress < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se admite progreso negativos',
            showCloseButton: true,
            confirmButtonText: 'Listo!'
          });
        return;
    }
      if (progress >= 0 && progress <= 100) {
        this.updateTskProg(this.projectId, this.activityId, this.taskId, progress);
        this.form.reset();
    }
    }
  }
}
