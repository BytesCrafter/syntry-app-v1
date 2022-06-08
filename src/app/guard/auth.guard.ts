import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService
  ) {
    const uid = localStorage.getItem(AuthService.tokenKey);
    if (uid && uid != null && uid !== 'null') {
      this.api.posts('users/refresh', {}).then((res: any) => { console.log();
        if(res.status === 401) {
          localStorage.clear();
          this.router.navigate([`/login`], { replaceUrl: true });
        }
        if(res.success) {
          this.auth.setToken = res.data;
          this.auth.getInfo(); //Get user data.
        }
      }).catch(error => {
        console.log('error', error);
      });
      // setInterval(() => {
      //   console.log('TODO: Get notification or server update.');
      // }, 10000);
    }

  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      const uid = localStorage.getItem(AuthService.tokenKey);
      if (uid && uid != null && uid !== 'null') {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
  }
}
