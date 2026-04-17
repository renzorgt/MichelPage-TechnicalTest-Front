import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

import { UserService, UserResultDto } from '../../core/services/user.service';

@Component({
  selector: 'app-user-list-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './user-list-modal.html',
  styleUrl: './user-list-modal.scss'
})
export class UserListModalComponent implements OnInit {
  dataSource = new MatTableDataSource<UserResultDto>();
  displayedColumns: string[] = ['id', 'nombre', 'email'];
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialogRef: MatDialogRef<UserListModalComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserList().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el listado de usuarios.',
          confirmButtonColor: '#1a237e'
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
