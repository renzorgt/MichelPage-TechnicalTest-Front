import { Component, ViewChild, OnInit, ChangeDetectorRef, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { TaskService } from '../../core/services/task.service';
import { TaskResultDto } from '../../core/interfaces/task.interface';
import { CreateTaskModalComponent } from './create-task-modal/create-task-modal';
import { CreateUserModalComponent } from '../../auth/create-user-modal/create-user-modal';

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
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.scss',
})
export class TaskManager implements OnInit {
  loading = true;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'titulo', 'userName', 'status', 'prioridad', 'fechaEstimada', 'descripcion', 'fechaCreacion', 'fechaModificacion', 'acciones'];

  statusFilter = 'Todos';
  textFilter = '';
  currentUser: any = null;

  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = sessionStorage.getItem('currentUser');
      if (raw) this.currentUser = JSON.parse(raw);
    }
    this.setupCustomFilter();
    this.loadTasks();
  }

  setupCustomFilter(): void {
    this.dataSource.filterPredicate = (data: TaskResultDto | any, filterStr: string) => {
      let searchParams: { status: string, text: string };
      try {
        searchParams = JSON.parse(filterStr);
      } catch (e) {
        return true;
      }

      const matchStatus = searchParams.status === 'Todos' || data.status === searchParams.status;

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
        // Expandimos las propiedades contenidas en el JSON "informacion"
        const mappedTasks = (tasks || []).map(t => {
          let extra: any = {};
          try {
            if (t.informacion) {
              extra = JSON.parse(t.informacion);
            }
          } catch (e) { }

          return {
            ...t,
            prioridad: extra.prioridad || 'N/A',
            fechaEstimada: extra.fechaEstimada || null,
            descripcion: extra.descripcion || 'Sin descripción'
          };
        });

        this.dataSource.data = mappedTasks;

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

    this.dataSource.filter = JSON.stringify({
      status: this.statusFilter,
      text: this.textFilter
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateUserModal(): void {
    this.dialog.open(CreateUserModalComponent, {
      width: '480px',
      disableClose: true,
      autoFocus: false
    }).afterClosed().subscribe((created: boolean) => {
      if (created) {
        Swal.fire({
          icon: 'success',
          title: '¡Usuario registrado!',
          text: 'El usuario fue creado correctamente.',
          confirmButtonColor: '#1a237e',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreateTaskModalComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-dialog-container',
      data: { currentUserId: this.currentUser?.id }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        // Mostrar mensaje de éxito y recargar
        Swal.fire({
          icon: 'success',
          title: '¡Creación Exitosa!',
          text: 'La tarea ha sido registrada correctamente.',
          confirmButtonColor: '#1a237e',
          timer: 2000,
          showConfirmButton: false
        });

        this.loadTasks();
      }
    });
  }

  cambiarEstado(id: number, newStatus: string): void {
    Swal.fire({
      title: '¿Confirmar Cambio de Estado?',
      text: `La tarea pasará a estado "${newStatus}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1a237e',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.taskService.updateTaskStatus({ id, status: newStatus, userIdMod: this.currentUser?.id || 0 }).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Actualizada!',
              text: 'El estado se ha actualizado correctamente.',
              icon: 'success',
              confirmButtonColor: '#1a237e',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadTasks();
          },
          error: () => {
            this.loading = false;
            this.cdr.detectChanges();
            Swal.fire('Error', 'No se pudo actualizar la tarea.', 'error');
          }
        });
      }
    });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción eliminará la tarea de manera permanente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.taskService.deleteTask(id, this.currentUser?.id || 0).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminada!',
              text: 'La tarea ha sido borrada del sistema.',
              icon: 'success',
              confirmButtonColor: '#1a237e',
              timer: 1500,
              showConfirmButton: false
            });
            this.loadTasks();
          },
          error: () => {
            this.loading = false;
            this.cdr.detectChanges();
            Swal.fire('Error', 'Hubo un problema y no se pudo eliminar la tarea.', 'error');
          }
        });
      }
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentUser');
    }
    this.router.navigate(['/login']);
  }
}

