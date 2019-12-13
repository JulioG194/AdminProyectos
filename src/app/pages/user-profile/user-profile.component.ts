import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';

export interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userApp: User;

  foods: Food[] = [
    {value: 'femenino-0', viewValue: 'Femenino'},
    {value: 'masculino-1', viewValue: 'Masculino'},
    {value: 'otro-2', viewValue: 'Otros'}
  ];
  constructor( public auth: AuthService ) { }

  ngOnInit() {
    this.userApp = this.auth.userAuth;
  }

}
