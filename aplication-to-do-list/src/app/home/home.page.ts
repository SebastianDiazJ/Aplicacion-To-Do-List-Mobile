import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonItemSliding,
  ToastController,
  IonContent,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { FirebaseConfigService } from '../../services/firebase-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  showCompleted = true;
  bannerMessage = '';
  enableDueDates = false;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private firebaseConfig: FirebaseConfigService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilter();
    });

    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });

    this.firebaseConfig.featureFlags$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flags) => {
        this.enableDueDates = flags['enable_due_dates'] ?? false;
      });

    this.bannerMessage = this.firebaseConfig.getBannerMessage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(): void {
    let result = [...this.tasks];

    if (this.selectedCategoryId) {
      result = result.filter((t) => t.categoryId === this.selectedCategoryId);
    }

    if (!this.showCompleted) {
      result = result.filter((t) => !t.completed);
    }

    this.filteredTasks = result;
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  toggleShowCompleted(): void {
    this.showCompleted = !this.showCompleted;
    this.applyFilter();
  }

  getCategoryById(id?: string): Category | undefined {
    if (!id) return undefined;
    return this.categoryService.getCategoryById(id);
  }

  goToAddTask(): void {
    this.router.navigate(['/task-form']);
  }

  goToEditTask(task: Task): void {
    this.router.navigate(['/task-form', task.id]);
  }

  async toggleComplete(task: Task): Promise<void> {
    await this.taskService.toggleComplete(task.id);
    const msg = task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada';
    this.showToast(msg, 'success');
  }

  async deleteTask(task: Task, sliding: IonItemSliding): Promise<void> {
    await sliding.close();

    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Estás seguro de eliminar "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
            this.showToast('Tarea eliminada', 'warning');
          },
        },
      ],
    });
    await alert.present();
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
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