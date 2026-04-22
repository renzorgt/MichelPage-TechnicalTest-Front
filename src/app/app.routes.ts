import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { TaskManager } from './pages/task-manager/task-manager';
import { authGuard } from './core/guards/auth.guard';
import { TaskManager2 } from './pages/task-manager 2/task-manager2';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'task-manager2', component: TaskManager2, canActivate: [authGuard] },
  { path: 'task-manager1', component: TaskManager, canActivate: [authGuard] },
];
