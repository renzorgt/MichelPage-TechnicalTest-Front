import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskResultDto } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskResultDto[]> {
    const url = `${this.apiBase}Tasks/TaskList`;
    return this.http.get<TaskResultDto[]>(url);
  }
}
