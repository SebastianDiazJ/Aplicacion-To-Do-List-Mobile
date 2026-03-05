import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  readonly availableColors = [
    '#4CAF50', '#2196F3', '#FF9800', '#E91E63',
    '#9C27B0', '#00BCD4', '#795548', '#607D8B',
  ];

  readonly availableIcons = [
    'person-outline', 'briefcase-outline', 'school-outline',
    'home-outline', 'cart-outline', 'fitness-outline',
    'heart-outline', 'star-outline', 'flag-outline',
    'rocket-outline', 'code-outline', 'musical-notes-outline',
  ];

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cats) => {
        this.categories = cats;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async addCategory(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: async (data) => {
            if (data.name?.trim()) {
              await this.categoryService.addCategory({
                name: data.name.trim(),
                color: this.availableColors[
                  Math.floor(Math.random() * this.availableColors.length)
                ],
                icon: this.availableIcons[
                  Math.floor(Math.random() * this.availableIcons.length)
                ],
              });
              this.showToast('Categoría creada', 'success');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editCategory(category: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Nombre de la categoría',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.name?.trim()) {
              await this.categoryService.updateCategory(category.id, {
                name: data.name.trim(),
              });
              this.showToast('Categoría actualizada', 'success');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteCategory(category: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Categoría',
      message: `¿Eliminar "${category.name}"? Las tareas asociadas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.categoryService.deleteCategory(category.id);
            this.showToast('Categoría eliminada', 'warning');
          },
        },
      ],
    });
    await alert.present();
  }

  async changeColor(category: Category): Promise<void> {
    const inputs = this.availableColors.map((color) => ({
      name: 'color',
      type: 'radio' as const,
      label: `● ${color}`,
      value: color,
      checked: category.color === color,
      cssClass: `color-option`,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Elegir Color',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aplicar',
          handler: async (selectedColor) => {
            if (selectedColor) {
              await this.categoryService.updateCategory(category.id, {
                color: selectedColor,
              });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async changeIcon(category: Category): Promise<void> {
    const inputs = this.availableIcons.map((icon) => ({
      name: 'icon',
      type: 'radio' as const,
      label: icon.replace('-outline', ''),
      value: icon,
      checked: category.icon === icon,
    }));

    const alert = await this.alertCtrl.create({
      header: 'Elegir Ícono',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aplicar',
          handler: async (selectedIcon) => {
            if (selectedIcon) {
              await this.categoryService.updateCategory(category.id, {
                icon: selectedIcon,
              });
            }
          },
        },
      ],
    });
    await alert.present();
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