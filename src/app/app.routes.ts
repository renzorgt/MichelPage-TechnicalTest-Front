import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { TaskManager } from './pages/task-manager/task-manager';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'task-manager', component: TaskManager, canActivate: [authGuard] },
];
