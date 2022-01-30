import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Token } from '../model/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static tokenKey: any = 'businext-token';
  private subject: BehaviorSubject<Token>;
  private observable: Observable<Token>;

  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
  ) {
    const jwtHash = localStorage.getItem(AuthService.tokenKey);
    let token = new Token();
    if(jwtHash !== null && jwtHash !== '') {
      token = this.util.jwtDecode(jwtHash);
      //const isExpired = jwt.isTokenExpired(token);
    }
    this.subject = new BehaviorSubject<Token>(token);
    this.observable = this.subject.asObservable();
  }

  public get isAuthenticated(): boolean {
    const jwtHash = localStorage.getItem(AuthService.tokenKey);
    if(jwtHash == null || jwtHash === '') {
      return false;
    }

    return true;
  }

  public get userToken(): Token {
    if(this.isAuthenticated) {
      const jwtHash = localStorage.getItem(AuthService.tokenKey);
      if(jwtHash != null && jwtHash !== '') {
        const token = this.util.jwtDecode(jwtHash);
        this.subject.next(token);
        return this.subject.value;
      }
    } //TODO: Verify if okay to not return anything when nulled.

    return null;
  }

  public set setToken(jwtHash: string) {
    localStorage.setItem(AuthService.tokenKey, jwtHash);
    const token = this.util.jwtDecode(jwtHash);
    this.subject.next(token);
  }

  login(username: string, password: string, callback) {
    this.api.posts('users/signin', {
      email: username,
      pword: password
    }).then((res: any) => {
      if(res && res.success === true && res.data) {
        localStorage.setItem(AuthService.tokenKey, res.data);
        const decoded: Token = this.util.jwtDecode(res.data);
        this.subject.next(decoded);
        callback({ success: res.success, data: decoded });
      } else {
        callback({ success: res.success, message: res.message });
      }

    }).catch(error => {
      console.log('error', error);
      callback({ success: false, message: 'Something went wrong!' });
    });
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem(AuthService.tokenKey);
      this.subject.next(null);
      this.router.navigate(['/login']);
  }
}
