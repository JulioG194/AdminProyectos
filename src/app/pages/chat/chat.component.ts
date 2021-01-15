import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { Team } from 'src/app/models/team.interface';
import { Chat } from 'src/app/models/chat.interface';
import * as firebase from 'firebase/app';
import { ChatService } from '../../services/chat.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  usersApp: User[] ;
  usersAppFilter: User[] = [];
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
  selectedUsersPlus: User[] = [];
  teams: Team[] = [];
  delegates: User[] = [];
  userGugo: User = {
    displayName: '',
    email: '',
    password: '',
    uid: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photoURL: '',
    manager: false,
    phoneNumber: ''
  };
  teamsObservable: any;
  teamGugo: Team = {
  manager: ''
  };
  teamUserGugo: Team = {
    delegates: this.delegates
  };
  post = true;
  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  delegatesAux: User[] = [];
  delegatesAux1: User[] = [];
  managers: string[] = [];
  managerAux: User = {
    displayName: '',
    email: '',
    uid: ''
  };
  delegateAux: User = {
    displayName: '',
    email: '',
    uid: ''
  };
  delegateAux1: User = {
    displayName: '',
    email: '',
    uid: ''
  };
  chatUser: Chat = {
    senderEmail: '',
    coworkerName: '',
    coworkerEmail: '',
    senderName: '',
    coworkerId: '',
    message: '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  coworker: User = {
    displayName: '',
    email: '',
    uid: ''
  };
  chatsSend: Chat[] = [];
  chatsRecieve: Chat[] = [];
  allChats: Chat[] = [];
  elemento: any;

  constructor(  private teamService: TeamService,
                private authService: AuthService,
                private chatService: ChatService  ) { }

  ngOnInit() {
    this.getTeam();
    this.elemento = document.getElementById('app-mensajes');
  }

  getTeam() {
    this.authService.getUser(this.authService.userAuth)
   .subscribe(user => {(this.userGugo = user);
                       if ( this.userGugo.manager === true) {
                       this.teamService.getTeamByUser(this.userGugo)
                       .subscribe(team => {
                                this.teamsObservable = team;
                                this.teamsObservable.map(a =>
                                this.teamGugo = a);
                                if ( this.teamGugo.manager ) {
                                  this.teamGugo.delegates = [];
                                  this.teamService.getDelegates(this.teamGugo).subscribe(delegates => {
                                  this.teamGugo.delegates = delegates;
                                  this.delegatesAux1 = this.teamGugo.delegates;
                                  });
                               }
                       });
                      } else {
                        this.teamGugo.delegates = [];
                        this.teamService.getTeams().subscribe(teams => {
                            this.teamsAux = teams;
                            this.teamsAux.forEach(team => {
                                this.teamService.getDelegates(team).subscribe(delegates => {
                                       team.delegates = delegates;
                                       team.delegates.forEach(delegate => {
                                           if ( delegate.email === this.userGugo.email ) {
                                               this.teamsAux1.push(team);
                                               this.teamsAux1.forEach(teamA => {
                                                this.authService.getUserById(teamA.manager).subscribe(manager => {
                                                  if (!this.delegatesAux1.some(obj => obj.email === manager.email && obj.uid === manager.uid)) {
                                                    this.delegatesAux1.push(manager);
                                                  }
                                               });
                                    });
                                               team.delegates.forEach(delegated => {
                                                  if (!this.delegatesAux1.some(obj => obj.email === delegated.email && obj.uid === delegated.uid)) {
                                                  this.delegatesAux1.push(delegated);
                                                }
                                               });
                                           }
                                           this.removeDelegate(this.userGugo);
                                           this.delegatesAux1 = this.delegatesAux1.sort();
                                       });
                          });
                        });
                        });
                      }
                     });
  }

  removeDelegate(delegate) {
    this.delegatesAux1.forEach( (item, index) => {
      if ( item.email === delegate.email ) { this.delegatesAux1.splice(index, 1); }
    });
  }

  selectUser( id: string, name: string, email: string, photo: string ) {
    this.coworker.uid = id;
    this.coworker.displayName = name;
    this.coworker.email = email;
    this.coworker.photoURL = photo;

    this.chatService.getChats(this.userGugo.uid).subscribe(chats => {
      this.allChats = [];
      this.allChats = chats;
      console.log(this.allChats);
      try {
        this.allChats.sort((a, b) => a.createdAt['seconds'] - b.createdAt['seconds']);
      } catch {}
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
  });
  }

  onSendMessage( form: NgForm ) {
    if ( form.invalid ) { return; }
    this.chatUser.coworkerEmail = this.coworker.email;
    this.chatUser.coworkerName = this.coworker.displayName;
    this.chatUser.senderEmail = this.userGugo.email;
    this.chatUser.senderName = this.userGugo.displayName;
    this.chatUser.coworkerPhoto = this.coworker.photoURL;
    this.chatUser.userId = this.userGugo.uid;
    this.chatUser.coworkerId = this.coworker.uid;
    if ( this.chatUser.message !== null ) {
      this.chatService.addNewChat(this.chatUser);
    }
    this.chatUser.message = '';
  }
}
