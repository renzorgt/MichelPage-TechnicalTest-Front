import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserResultDto {
  id: number;
  nombre: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  getUserList(): Observable<UserResultDto[]> {
    return this.http.get<UserResultDto[]>(`${this.apiBase}Users/UserList`);
  }
}
