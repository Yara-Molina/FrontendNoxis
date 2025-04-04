import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/user'; // Ajuste en la URL base
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      this.checkTokenExpiration();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Registro de usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Inicio de sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logIn`, { email, password }).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
      }),
      catchError((error) => {
        console.error('Error durante el inicio de sesión:', error);
        return throwError(error);
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem('tokenExpiration');
      this.http.post(`${this.apiUrl}/logout`, {}, { headers: this.getAuthHeaders() }).subscribe(
        () => this.router.navigate(['/']),
        (error) => console.error('Error al cerrar sesión:', error)
      );
    }
  }

  private saveToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem(this.tokenKey, token);
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
      const expiration = payload.exp * 1000;
      sessionStorage.setItem('tokenExpiration', expiration.toString());
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? sessionStorage.getItem(this.tokenKey) : null;
  }

  private checkTokenExpiration(): void {
    setInterval(() => {
      if (this.isBrowser()) {
        const expiration = sessionStorage.getItem('tokenExpiration');
        if (expiration && new Date().getTime() > parseInt(expiration, 10)) {
          this.logout();
        }
      }
    }, 180000);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
