import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) { }

   canActivate(): boolean {
      const usuario = localStorage.getItem('user');
      if (!usuario) {
        return true;
      } else {
        this.router.navigate(['dashboard']);
        return false;
      }
    }

}
