import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private storage: Storage) {
    this.loadTasks();
  }

  private async loadTasks(): Promise<void> {
    const tasks = (await this.storage.get(this.STORAGE_KEY)) || [];
    this.tasksSubject.next(tasks);
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await this.storage.set(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTasksByCategory(categoryId: string): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((t) => t.categoryId === categoryId))
    );
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.tasks$.pipe(map((tasks) => tasks.find((t) => t.id === id)));
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const tasks = this.tasksSubject.value;
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.saveTasks([newTask, ...tasks]);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const tasks = this.tasksSubject.value.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
    );
    await this.saveTasks(tasks);
  }

  async toggleComplete(id: string): Promise<void> {
    const tasks = this.tasksSubject.value.map((t) =>
      t.id === id
        ? { ...t, completed: !t.completed, updatedAt: Date.now() }
        : t
    );
    await this.saveTasks(tasks);
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = this.tasksSubject.value.filter((t) => t.id !== id);
    await this.saveTasks(tasks);
  }

  async deleteTasksByCategory(categoryId: string): Promise<void> {
    const tasks = this.tasksSubject.value.filter(
      (t) => t.categoryId !== categoryId
    );
    await this.saveTasks(tasks);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}