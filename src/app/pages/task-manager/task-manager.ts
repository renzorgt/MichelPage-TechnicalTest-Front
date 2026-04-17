import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { TaskService } from '../../core/services/task.service';
import { TaskResultDto } from '../../core/interfaces/task.interface';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.scss',
})
export class TaskManager implements OnInit {
  loading = true;
  dataSource = new MatTableDataSource<TaskResultDto>();
  displayedColumns: string[] = ['id', 'titulo', 'userName', 'status', 'fechaCreacion', 'fechaModificacion', 'acciones'];

  statusFilter = 'Todos';
  textFilter = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setupCustomFilter();
    this.loadTasks();
  }

  setupCustomFilter(): void {
    this.dataSource.filterPredicate = (data: TaskResultDto, filterStr: string) => {
      let searchParams: { status: string, text: string };
      try {
        searchParams = JSON.parse(filterStr);
      } catch (e) {
        return true;
      }

      // 1. Filtrado por Estado
      const matchStatus = searchParams.status === 'Todos' || data.status === searchParams.status;

      // 2. Filtrado por Texto (búsqueda general)
      const dataStr = Object.keys(data).reduce((acc: string, key: string) => {
        return acc + (data as any)[key] + ' ';
      }, '').toLowerCase();

      const matchText = searchParams.text === '' || dataStr.includes(searchParams.text);

      return matchStatus && matchText;
    };
  }

  loadTasks(): void {
    this.loading = true;

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.dataSource.data = tasks;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible cargar las tareas. Intenta nuevamente.',
          confirmButtonColor: '#1a237e'
        });
      }
    });
  }

  onFilterChange(type: 'status' | 'text', eventValue: any): void {
    if (type === 'status') {
      this.statusFilter = eventValue;
    } else if (type === 'text') {
      const input = eventValue.target as HTMLInputElement;
      this.textFilter = input.value?.trim().toLowerCase() || '';
    }

    // Actualizamos el filtro del dataSource usando un JSON string
    this.dataSource.filter = JSON.stringify({
      status: this.statusFilter,
      text: this.textFilter
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editar(id: number): void {
    // Implementar editar
  }
}

