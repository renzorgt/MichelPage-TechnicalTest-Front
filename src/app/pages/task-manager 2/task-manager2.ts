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
import { TaskFiltersDto } from '../../core/interfaces/taskfilters.interface';
import { CreateTaskModalComponent } from './create-task-modal/create-task-modal';
import { CreateUserModalComponent } from '../../auth/create-user-modal/create-user-modal';
import { UserService, UserResultDto } from '../../core/services/user.service';

import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './task-manager2.html',
  styleUrl: './task-manager2.scss',
})
export class TaskManager2 implements OnInit {
  loading = true;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'titulo', 'userName', 'status', 'prioridad', 'fechaEstimada', 'descripcion', 'fechaCreacion', 'fechaModificacion', 'acciones'];

  statusFilter = 'Todos';
  userIdFilter: number = 0;
  prioridadFilter = 'Todas';
  fechaEstimadaFilter: Date | null = null;
  users: UserResultDto[] = [];
  currentUser: any = null;

  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const raw = sessionStorage.getItem('currentUser');
      if (raw) this.currentUser = JSON.parse(raw);
    }
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers(): void {
    this.userService.getUserList().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        console.error('Error al cargar la lista de usuarios');
      }
    });
  }

  loadTasks(): void {
    this.loading = true;

    const filters: TaskFiltersDto = {};
    if (this.statusFilter && this.statusFilter !== 'Todos') {
      filters.status = this.statusFilter;
    }
    if (this.userIdFilter && this.userIdFilter !== 0) {
      filters.userId = this.userIdFilter;
    }
    if (this.prioridadFilter && this.prioridadFilter !== 'Todas') {
      filters.prioridad = this.prioridadFilter;
    }
    if (this.fechaEstimadaFilter) {
      filters.fechaEstimada = this.fechaEstimadaFilter;
    }

    this.taskService.getTasksByFilters(filters).subscribe({
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

