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

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailError(): string {
    const emailCtrl = this.loginForm.get('email');

    if (!emailCtrl || !emailCtrl.touched) return '';

    if (emailCtrl.errors?.['required']) {
      return 'Debes ingresar un correo';
    }

    if (emailCtrl.errors?.['email']) {
      return 'El correo no tiene un formato válido';
    }

    return '';
  }

  get passwordError(): string {
    const passwordCtrl = this.loginForm.get('password');

    if (!passwordCtrl || !passwordCtrl.touched) return '';

    if (passwordCtrl.errors?.['required']) {
      return 'Debes ingresar la contraseña';
    }

    if (passwordCtrl.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      const formData = this.loginForm.value;
      console.log('Datos del login:', formData);
      this.isLoading = false;
      this.router.navigate(['/task-manager']);
    }, 1500);
  }
}
