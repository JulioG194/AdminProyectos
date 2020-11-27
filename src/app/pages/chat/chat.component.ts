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

                // Variables Auxiliares
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
                      // console.log(this.userGugo);
                       // Obtener todos los usuarios de la App
                      // this.authService.getUsers()
                      // .subscribe(users => {
                      //             this.usersApp = users;        // Lista de todos los usuarios
                      //             this.usersGugo = [];          // Lista de los usuarios excepto el usuario autenticado
                                   // Obtener lista de usuarios excepto el usuario autenticado
                      //             this.usersApp.map( item => {
                      //             if ( item.id !== this.userGugo.id ) {
                      //             this.usersGugo.push(item);
                      //             }
                      //             });
                                   // Obtener el equipo segun el usuario autenticado
                       if ( this.userGugo.manager === true) {
                       this.teamService.getTeamByUser(this.userGugo)
                       .subscribe(team => {
                                this.teamsObservable = team;
                                this.teamsObservable.map(a =>
                                this.teamGugo = a);
                                  // Obtener los delegados del equipo
                                if ( this.teamGugo.manager ) {
                                  this.teamGugo.delegates = [];
                                  this.teamService.getDelegates(this.teamGugo).subscribe(delegates => {
                                  this.teamGugo.delegates = delegates;
                                  this.delegatesAux1 = this.teamGugo.delegates;
                                  // console.log(this.teamGugo.delegates);
                                  });
                               }
                       });
                      } else {
                        this.teamGugo.delegates = [];
                        this.teamService.getTeams().subscribe(teams => {
                            this.teamsAux = teams;
                            this.teamsAux.forEach(team => {
                                this.teamService.getDelegates(team).subscribe(delegates => {
                                       // tslint:disable-next-line:prefer-for-of
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
                                               team.delegates.forEach(delegate => {
                                                  if (!this.delegatesAux1.some(obj => obj.email === delegate.email && obj.uid === delegate.uid)) {
                                                  this.delegatesAux1.push(delegate);
                                                  // console.log(delegate.photo);
                                                }
                                               });
                                           }
                                           this.removeDelegate(this.userGugo);
                                           this.delegatesAux1 = this.delegatesAux1.sort();
                                           this.getUniqueDelegates();
                                       });
                          });
                        });
                        });
                      }
                     });

                  // });
  }

  getUniqueDelegates() {
    this.delegatesAux1.filter((elem, pos) => this.delegatesAux1.indexOf(elem) === pos);
    let element = 0;
    let decrement = this.delegatesAux1.length - 1;
    while (element < this.delegatesAux1.length) {
                  while (element < decrement) {
                    if (this.delegatesAux1[element].email === this.delegatesAux1[decrement].email) {
                        this.delegatesAux1.splice(decrement, 1);
                        decrement--;
                    } else {
                        decrement--;
                    }
                  }
                  decrement = this.delegatesAux1.length - 1;
                  element++;
                                                            }

  }

  removeDelegate(delegate) {
    this.delegatesAux1.forEach( (item, index) => {
      if ( item.email === delegate.email ) { this.delegatesAux1.splice(index, 1); }
    });
  }

  sendMessage() {



  }

  selectUser( id: string, name: string, email: string, photo: string ) {
    this.coworker.uid = id;
    // console.log(this.coworker.id);
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

    // console.log(this.chatUser);

    if ( this.chatUser.message !== null ) {
      this.chatService.addNewChat(this.chatUser);
    }


    // console.log(this.chatUser.createdAt);

    this.chatUser.message = '';


  }


}
