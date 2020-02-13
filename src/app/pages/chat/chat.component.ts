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

  users: any[] = [{name: 'Daniel Villavicencio', cel: '0987654321'},
                {name: 'Vane Perez', cel: '0987654321'},
                {name: 'Julio Gonzalez', cel: '0987654321'},
                {name: 'Alexa Fernandez', cel: '0987654321'},
                {name: 'Yess Chuquimarca', cel: '0987654321'},
                {name: 'Santo Simba', cel: '0987654321'},
                {name: 'Bry Carrion', cel: '0987654321'}
                ];

                usersApp: User[] ;
                usersAppFilter: User[] = [];
                usersGugo: User[] = [];
                selectedUsers: User[] = [];
                selectedUsersPlus: User[] = [];
                teams: Team[] = [];
                delegates: User[] = [];

                userGugo: User = {
                  name: '',
                  email: '',
                  password: '',
                  id: '',
                  birthdate: new Date(),
                  description: '',
                  gender: '',
                  photo: '',
                  manager: false,
                  google: false,
                  phone_number: ''
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
                    name: '',
                    email: ''
                };
                delegateAux: User = {
                  name: '',
                  email: ''
              };
              delegateAux1: User = {
                name: '',
                email: ''
              };
               chatUser: Chat = {
                senderEmail: '',
                coworkerName: '',
                coworkerEmail: '',
                userName: '',
                message: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            coworker: User = {
              name: '',
              email: '',
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
                       console.log(this.userGugo);
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
                                  console.log(this.teamGugo.delegates);
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
                                                  if (!this.delegatesAux1.some(obj => obj.email === manager.email && obj.id === manager.id)) {
                                                    this.delegatesAux1.push(manager);
                                                  }
                                               });
                                    });
                                               team.delegates.forEach(delegate => {
                                                  if (!this.delegatesAux1.some(obj => obj.email === delegate.email && obj.id === delegate.id)) {
                                                  this.delegatesAux1.push(delegate);
                                                  console.log(delegate.photo);
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

  selectUser( id: string, name: string, email: string ) {
    this.coworker.id = id;
    this.coworker.name = name;
    this.coworker.email = email;

    this.chatService.getChats(this.userGugo.email, this.coworker.email).subscribe(chats => {
        this.chatsSend = chats;
        this.chatService.getChats(this.coworker.email, this.userGugo.email).subscribe(chats1 => {
      this.chatsRecieve = chats1;
      this.allChats = this.chatsSend.concat(this.chatsRecieve);
      try {
        this.allChats.sort((a, b) => a.createdAt['seconds'] - b.createdAt['seconds']);
        this.allChats.forEach(chat => {
          console.log(chat.createdAt);
        })
      } catch {}
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
  });
  });


  }

  onSendMessage( form: NgForm ) {
    if ( form.invalid ) { return; }

    this.chatUser.coworkerEmail = this.coworker.email;
    this.chatUser.coworkerName = this.coworker.name;
    this.chatUser.senderEmail = this.userGugo.email;
    this.chatUser.userName = this.userGugo.name;
    this.chatUser.userId = this.userGugo.id;

    console.log(this.chatUser);

    this.chatService.addNewChat(this.chatUser);

    console.log(this.chatUser.createdAt);

    this.chatUser.message = '';


  }

  timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

}
