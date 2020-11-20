import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidatorService } from 'src/app/services/validators.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.interface';
import { ProjectService } from '../../services/project.service';
import * as firebase from 'firebase/app';
import { DOCUMENT } from '@angular/common';
import { EvidenceService } from 'src/app/services/evidence.service';
import { Evidence } from 'src/app/models/evidence.interface';
@Component({
    selector: 'app-open-resource-modal',
    templateUrl: './openResource-modal.component.html',
    styleUrls: ['./openResource-modal.component.scss']
  })

  export class OpenResourceModalComponent implements OnInit {

    form: FormGroup;
    comment: string;
    comments: any[] = [];
    resources: any[] = [];
    serverTimeStamp: any;
    elemento: any;
    projectId: string;
    filesToUploadFirebase: Evidence [] = [];
    userApp: User;

    constructor(
      private fb: FormBuilder,
      private projectService: ProjectService,
      private evidenceService: EvidenceService,
      private dialogRef: MatDialogRef<OpenResourceModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private validators: ValidatorService,
      @Inject(DOCUMENT) public document: any) {
      }

    ngOnInit() {

      this.form = this.fb.group({
        comment: ['',  Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
        file: ['']
      });
      console.log(this.data);
      const {projectId, user} = this.data;
      this.projectId = projectId;
      this.userApp = user;
      this.getComments(projectId);
      this.getResources(projectId);
      // console.log(this.elemento);
      // this.elemento.scrollTop = this.elemento.scrollHeight;
      setTimeout(() => {
        this.elemento = document.getElementById('app-mensajes');
        console.log(this.elemento);
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 1500);
    }

    get resourceFormControl() {
    return this.form.controls;
  }


       sendComment() {
         if (this.form.invalid) {
            return;
        }
         const { comment } = this.form.value;
         const {user, projectId} = this.data;
         const newUser: User = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
         };
         this.serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
         this.projectService.createComment(projectId, newUser, comment, this.serverTimeStamp);
        // this.dialogRef.close(this.form.value);
        // this.getComments(projectId);

      }

      getComments(projectId: string) {
        this.projectService.getComments(projectId).subscribe((comms) => {
          comms.map((com: any) => {
                 if (com.createdAt) {
                   com.createdAt = new Date(com.createdAt.seconds * 1000);
                 }
          });
          this.comments = comms;
          this.elemento = document.getElementById('app-mensajes');
          this.elemento.scrollTop = this.elemento.scrollHeight;
        });
      }

      getResources(projectId: string) {
        this.projectService.getResources(projectId).subscribe((ress) => {
          ress.map((res: any) => {
                 if (res.createdAt) {
                   res.createdAt = new Date(res.createdAt.seconds * 1000);
                 }
          });
          this.resources = ress;
        });
      }

    handleFileInput(files: FileList) {
        for (let index = 0; index < files.length; index++) {
          const evidence: Evidence = {
              file: files.item(index),
              fileName: files.item(index).name,
              size: files.item(index).size,
              type: files.item(index).type,
              tid: this.projectId
          };
          this.filesToUploadFirebase.push(evidence);
        }
        console.log(this.filesToUploadFirebase);
  }

  onUpdateFiles() {
    const newUser: User = {
            uid: this.userApp.uid,
            displayName: this.userApp.displayName,
            email: this.userApp.email,
            photoURL: this.userApp.photoURL
         };
    this.evidenceService.uploadResourcesFirebase(this.filesToUploadFirebase, newUser, this.projectId);
  }

  onClearFiles() {
    this.filesToUploadFirebase = [];
    this.form.get('file').reset();
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }

}
