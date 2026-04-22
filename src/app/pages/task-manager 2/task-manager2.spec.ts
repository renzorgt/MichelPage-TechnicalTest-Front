import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManager2 } from './task-manager2';

describe('TaskManager', () => {
  let component: TaskManager2;
  let fixture: ComponentFixture<TaskManager2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManager2]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskManager2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
