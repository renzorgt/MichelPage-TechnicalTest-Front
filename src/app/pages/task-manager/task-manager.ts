import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, NgClass, formatDate } from '@angular/common';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatLabel, MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-manager',
  imports: [MatCard, MatCardModule, MatToolbarModule, MatPaginatorModule, MatTableModule, MatLabel, MatFormField, MatIcon, MatProgressBarModule, MatIconModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSortModule, RouterModule],
  templateUrl: './task-manager.html',
  styleUrl: './task-manager.scss',
})
export class TaskManager {
  applyFilter($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }
  loading = true;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'clienteId', 'nombreCompleto', 'telefono', 'fechaEvento', 'numPersonas', 'total', 'fechaInserta', 'acciones'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
}
