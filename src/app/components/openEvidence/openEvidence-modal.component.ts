import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from 'src/app/models/task.interface';
import { EvidenceService } from 'src/app/services/evidence.service';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.interface';
import { ProjectService } from '../../services/project.service';
import * as firebase from 'firebase/app';


@Component({
    selector: 'app-open-evidence-modal',
    templateUrl: './openEvidence-modal.component.html',
    styleUrls: ['./openEvidence-modal.component.scss']
  })

  export class OpenEvidenceModalComponent implements OnInit {

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
    progress: number;
    evidences: any[] = [];
    tskProgress: number;
    task: Task;
    serverTimeStamp: any;
    observations: any[] = [];
    taskName: string;
    userGugo: User;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<OpenEvidenceModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService,
      private projectService: ProjectService,
      private evidenceService: EvidenceService) {
      }

    ngOnInit() {

      this.form = this.fb.group({
        comment: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        progress: ['',  Validators.compose([Validators.required])],
        file: ['']
      });
      console.log(this.data);
      this.projectId = this.data.projectId;
      this.activityId = this.data.activityId;
      this.taskId = this.data.taskId;
      this.deleg = this.data.delegate;
      this.taskName = this.data.taskName;
      this.userGugo = this.data.userGugo;
      console.log(this.taskName);
      this.getEvidences();
      this.getTask();
      this.getObservations();
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

        checkTask() {
          Swal.fire({
              allowOutsideClick: false,
              text: 'Por favor, espere...',
              timer: 2000,
              icon: 'info',
            });
          Swal.showLoading();
          this.projectService.checkTaskProgress(this.projectId, this.activityId, this.taskId, this.tskProgress)
                             .subscribe(data => {
                                        console.log(data);
                                        Swal.fire({
                                        icon: 'success',
                                        title: 'Avance',
                                        text: 'Progreso de tarea aprobado con éxito',
                                        showCloseButton: true,
                                        confirmButtonText: 'Listo!'
          });
        });
          this.evidenceService.sendNotificationCheckTaskProgress(this.userGugo, this.deleg, this.taskName).subscribe(data => console.log(data));
        }

        sendComment() {
         const { comment } = this.form.value;
         if (comment !== '') {
           const { userGugo } = this.data;
           console.log(comment);
           console.log(userGugo);
           const newUser: User = {
            uid: userGugo.uid,
            displayName: userGugo.displayName,
            email: userGugo.email,
            photoURL: userGugo.photoURL
         };
           this.serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
           this.projectService.createObservation(this.projectId, this.activityId, this.taskId, newUser, comment, this.serverTimeStamp);
           this.evidenceService.sendNotificationSendCommentEvid(this.userGugo, this.deleg, this.taskName).subscribe(data => console.log(data));
           this.form.get('comment').reset();
         }
      }

        getTask() {
    this.projectService.getTask(this.projectId, this.activityId, this.taskId).subscribe( tsk => {
      this.tskProgress = tsk.progress;
      this.task = tsk;
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

  updateTskProg(projectId: string, activityId: string, taskId: string, progress: number) {
     Swal.fire({
              allowOutsideClick: false,
              text: 'Por favor, espere...',
              timer: 2500,
              icon: 'info',
            });
     Swal.showLoading();
     this.projectService.updateTaskProgress(projectId, activityId, taskId, progress).subscribe(data => {
      console.log(data);
    });
     this.projectService.checkTaskProgress(projectId, activityId, taskId, progress).subscribe(data => {
       Swal.fire({
              allowOutsideClick: false,
              text: 'Progreso Actualizado',
              timer: 2000,
              icon: 'success',
            });
       Swal.showLoading();
    });
     this.evidenceService.sendNotificationCorrectTaskProgress(this.userGugo, this.deleg, this.taskName).subscribe(data => console.log(data));
  }

   getValueProgress() {
    const { progress } = this.form.value;
    if (progress !== '') {
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
