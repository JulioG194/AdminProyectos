import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';



@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls  : ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  constructor(  ) { }

  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('foo');
    }
  }
  }


