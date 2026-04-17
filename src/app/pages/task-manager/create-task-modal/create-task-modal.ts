import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';

import { UserService, UserResultDto } from '../../../core/services/user.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-task-modal.html',
  styleUrl: './create-task-modal.scss'
})
export class CreateTaskModalComponent implements OnInit {
  taskForm: FormGroup;
  users: UserResultDto[] = [];
  isLoading = false;
  isFetchingUsers = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private taskService: TaskService
  ) {
    // Formulario con validaciones fuertes
    this.taskForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      userId: ['', [Validators.required]],
      prioridad: ['', [Validators.required]],
      fechaEstimada: ['', [Validators.required]],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUserList().subscribe({
      next: (res) => {
        this.users = res;
        this.isFetchingUsers = false;
      },
      error: () => {
        this.isFetchingUsers = false;
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudo obtener la lista de usuarios. Por favor, intenta de nuevo.',
          confirmButtonColor: '#1a237e'
        });
      }
    });
  }

  closeModal(): void {
    // Cierre puramente visual por la 'X' superior
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formVals = this.taskForm.value;

    // Transformar los data extra a un JSON que se inyectará en información
    const customInfo = {
      prioridad: formVals.prioridad,
      fechaEstimada: formVals.fechaEstimada,
      descripcion: formVals.descripcion
    };

    const payload = {
      titulo: formVals.titulo,
      userId: formVals.userId,
      informacion: JSON.stringify(customInfo)
    };

    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.isLoading = false;
        // Sólo con respuesta positiva de BD cerramos en modo "true"
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: err.error?.message || 'No fue posible crear la tarea en la base de datos.',
          confirmButtonColor: '#1a237e'
        });
      }
    });
  }
}
