import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class KitService {
  private apiUrl = 'http://localhost:8080/kits';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // antes era sessionStorage
  }

  createKit(kitData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/create`, kitData, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllKits(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getActiveKits(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/actives`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getInactiveKits(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/inactives`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
  redeemKit(userId: number, kitCode: string): Observable<any> {
    const body = { clave: kitCode };
    return this.http.post(`${this.apiUrl}/${userId}`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: any): Observable<never> {
    console.error('Error en KitService:', error);
    return throwError(error);
  }
}
