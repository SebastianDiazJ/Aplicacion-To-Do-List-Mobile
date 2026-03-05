import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
})
export class TaskFormPage implements OnInit {
  task: Partial<Task> = {
    title: '',
    description: '',
    completed: false,
    categoryId: undefined,
  };

  categories: Category[] = [];
  isEditing = false;
  pageTitle = 'Nueva Tarea';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$.subscribe((cats) => {
      this.categories = cats;
    });

    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.isEditing = true;
      this.pageTitle = 'Editar Tarea';
      this.taskService.getTaskById(taskId).subscribe((task) => {
        if (task) {
          this.task = { ...task };
        }
      });
    }
  }

  async saveTask(): Promise<void> {
    if (!this.task.title?.trim()) {
      this.showToast('El título es obligatorio', 'danger');
      return;
    }

    if (this.isEditing && this.task.id) {
      await this.taskService.updateTask(this.task.id, {
        title: this.task.title,
        description: this.task.description,
        categoryId: this.task.categoryId,
      });
      this.showToast('Tarea actualizada', 'success');
    } else {
      await this.taskService.addTask({
        title: this.task.title!,
        description: this.task.description,
        completed: false,
        categoryId: this.task.categoryId,
      });
      this.showToast('Tarea creada', 'success');
    }

    this.router.navigate(['/home']);
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}