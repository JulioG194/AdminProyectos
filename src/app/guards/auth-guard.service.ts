import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor() { }

   canActivate(): boolean {
      const usuario = localStorage.getItem('user');
      if (usuario) {
        return true;
      } else {
        return false;
      }
    }

}
