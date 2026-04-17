import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailError(): string {
    const emailCtrl = this.loginForm.get('email');
    if (!emailCtrl || !emailCtrl.touched) return '';
    if (emailCtrl.errors?.['required']) return 'Debes ingresar un correo';
    if (emailCtrl.errors?.['email']) return 'El correo no tiene un formato válido';
    return '';
  }

  get passwordError(): string {
    const passwordCtrl = this.loginForm.get('password');
    if (!passwordCtrl || !passwordCtrl.touched) return '';
    if (passwordCtrl.errors?.['required']) return 'Debes ingresar la contraseña';
    if (passwordCtrl.errors?.['minlength']) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      contraseña: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/task-manager']);
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso denegado',
            text: 'El correo o la contraseña son incorrectos.',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#1a237e',
          });
        } else if (err.status === 405) {
          Swal.fire({
            icon: 'error',
            title: 'Método no permitido',
            text: 'Solicitud no aceptada por el servidor',
            confirmButtonColor: '#1a237e',
          });
        } else if (err.status === 500) {
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Ocurrió un problema interno en el servidor. Intenta más tarde.',
            confirmButtonColor: '#1a237e',
          });
        } else if (err.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Sin conexión',
            text: 'No se pudo conectar con el servidor',
            confirmButtonColor: '#1a237e',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: `Error ${err.status}`,
            text: err.error?.message ?? 'Ocurrió un error inesperado. Intentar mas tarde',
            confirmButtonColor: '#1a237e',
          });
        }
      }
    });
  }
}


