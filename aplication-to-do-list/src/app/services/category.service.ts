import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly STORAGE_KEY = 'categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private readonly DEFAULT_CATEGORIES: Category[] = [
    {
      id: 'personal',
      name: 'Personal',
      color: '#4CAF50',
      icon: 'person-outline',
      createdAt: Date.now(),
    },
    {
      id: 'work',
      name: 'Trabajo',
      color: '#2196F3',
      icon: 'briefcase-outline',
      createdAt: Date.now(),
    },
    {
      id: 'study',
      name: 'Estudio',
      color: '#FF9800',
      icon: 'school-outline',
      createdAt: Date.now(),
    },
  ];

  constructor(private storage: Storage) {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    let categories = await this.storage.get(this.STORAGE_KEY);
    if (!categories || categories.length === 0) {
      categories = this.DEFAULT_CATEGORIES;
      await this.storage.set(this.STORAGE_KEY, categories);
    }
    this.categoriesSubject.next(categories);
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    await this.storage.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSubject.value.find((c) => c.id === id);
  }

  async addCategory(
    category: Omit<Category, 'id' | 'createdAt'>
  ): Promise<void> {
    const categories = this.categoriesSubject.value;
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
      createdAt: Date.now(),
    };
    await this.saveCategories([...categories, newCategory]);
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<void> {
    const categories = this.categoriesSubject.value.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    await this.saveCategories(categories);
  }

  async deleteCategory(id: string): Promise<void> {
    const categories = this.categoriesSubject.value.filter(
      (c) => c.id !== id
    );
    await this.saveCategories(categories);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}