import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskResultDto } from '../interfaces/task.interface';
import { TaskFiltersDto } from '../interfaces/taskfilters.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly apiBase = environment.apiBase;

  constructor(private http: HttpClient) { }

  getTasks(): Observable<TaskResultDto[]> {
    const url = `${this.apiBase}Tasks/TaskList`;
    return this.http.get<TaskResultDto[]>(url);
  }

  createTask(taskData: any): Observable<any> {
    const url = `${this.apiBase}Tasks/CreateTask`;
    return this.http.post(url, taskData, { responseType: 'text' },);
  }

  updateTaskStatus(data: { id: number, status: string, userIdMod?: number }): Observable<any> {
    const url = `${this.apiBase}Tasks/UpdateStatus`;
    return this.http.put(url, data, { responseType: 'text' });
  }

  getTasksByFilters(filters: TaskFiltersDto): Observable<TaskResultDto[]> {
    const url = `${this.apiBase}Tasks/GetTasksByFilter`;
    return this.http.post<TaskResultDto[]>(url, filters);
  }

  deleteTask(id: number, currentUserId: number): Observable<any> {
    const url = `${this.apiBase}Tasks/DeleteTask/${id}?usuarioMod=${currentUserId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}

