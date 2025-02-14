
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project';
import { Task } from '../../../core/models/task';
import { AuthService } from '../../../core/services/auth.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css' 
})


export class ProjectDetailComponent implements OnInit {
  exportPDF() {
  throw new Error('Method not implemented.');
}

  updateTask(taskId: number | null): void {
    if (this.taskForm.invalid || !this.project || taskId === null) return;
  
    const updatedTask = {
      jiraId: this.taskForm.get('jiraId')?.value,
      description: this.taskForm.get('description')?.value,
    };
  
    this.projectService.updateTask(this.project.id, taskId, updatedTask).subscribe((updatedTask) => {
      const taskIndex = this.project?.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1 && this.project) {
        this.project.tasks[taskId] = updatedTask;
      }
      this.resetTaskForm();
    });
  }

  resetTaskForm(): void {
    this.taskForm.reset();
    this.editingTaskId = null;
    this.isEditingTask = false;
  }

  project: Project | null = null;
  statusForm: FormGroup;
  taskForm: FormGroup;
  isEditMode = false;
  editingTaskId: number | null = null;
  isEditingTask: any;


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.statusForm = this.formBuilder.group({
      currentWeekStatus: ['', Validators.required],
      nextWeekFocus: ['', Validators.required]
    });

    this.taskForm = this.formBuilder.group({
      jiraId: ['', [Validators.required, Validators.pattern(/^[A-Z]+-\d+$/)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getProjectById(projectId).subscribe(project => {
      if (project) {
        this.project = project;
        this.statusForm.patchValue({
          currentWeekStatus: project.currentWeekStatus,
          nextWeekFocus: project.nextWeekFocus
        });
      }
    });
  }

  isDeveloper(): boolean {
    return this.authService.getCurrentUser()?.role === 'dev';
  }

  isProjectManager(): boolean {
    return this.authService.getCurrentUser()?.role === 'project-manager';
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (this.project) {
      this.statusForm.patchValue({
        currentWeekStatus: this.project.currentWeekStatus,
        nextWeekFocus: this.project.nextWeekFocus
      });
    }
  }

  updateStatus(): void {
    if (this.statusForm.invalid || !this.project) return;

    this.projectService.updateProject(this.project.id, {
      currentWeekStatus: this.statusForm.get('currentWeekStatus')?.value,
      nextWeekFocus: this.statusForm.get('nextWeekFocus')?.value
    }).subscribe(updatedProject => {
      this.project = updatedProject;
      this.isEditMode = false;
    });
  }

  addTask(): void {
    if (this.taskForm.valid || !this.project) {
      console.log("Form is invalid or project is missing");

      return;
}

    console.log("Adding Task");
    const newTask: Omit<Task, "id" | "createdAt" | "updatedAt" | "projectId"> = {
      jiraId: this.taskForm.get('jiraId')?.value,
      description: this.taskForm.get('description')?.value,
      status: 'in-progress' as 'done' 
    };
  
    this.projectService.addTask(this.project.id, newTask).subscribe((addedTask) => {
      console.log("Task added:", addedTask);
      
      if (this.project) {
        this.project.tasks.push(addedTask);
        this.resetTaskForm();
      }
    }, error => {
        console.error("Error adding task:", error);
    });
  }

  onSubmit(): void {
  console.log("Form submitted");
  this.isEditingTask ? this.updateTask(this.editingTaskId) : this.addTask();
}


  editTask(task: Task): void {
    this.isEditMode = true;
    this.editingTaskId = task.id;
  
    this.taskForm.patchValue({
      jiraId: task.jiraId,
      description: task.description
    });

  }


  toggleTaskStatus(task: Task): void {
    if (!this.project) return;

    const newStatus = task.status === 'in-progress' ? 'done' : 'in-progress';
    this.projectService.updateTask(this.project.id, task.id, {
      status: newStatus
    }).subscribe(updatedTask => {
      const taskIndex = this.project?.tasks.findIndex((t: { id: any; }) => t.id === task.id) ?? -1;
      if (taskIndex !== -1 && this.project) {
        this.project.tasks[taskIndex] = updatedTask;
      }
    });
  }

}