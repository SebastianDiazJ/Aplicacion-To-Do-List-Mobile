import { Injectable } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseConfigService {
  private featureFlags = new BehaviorSubject<Record<string, boolean>>({});
  public featureFlags$ = this.featureFlags.asObservable();
  private bannerSubject = new BehaviorSubject<string>('');
  public banner$ = this.bannerSubject.asObservable();

  constructor(private remoteConfig: RemoteConfig) {
    this.initRemoteConfig();
  }

  private async initRemoteConfig(): Promise<void> {
    try {
      // Configurar intervalo mínimo de fetch (en desarrollo, usar 0)
      this.remoteConfig.settings.minimumFetchIntervalMillis = 1200; 

      // Valores por defecto
      this.remoteConfig.defaultConfig = {
        enable_dark_mode: false,
        enable_task_priority: false,
        enable_due_dates: true,
        app_banner_message: '',
      };

      await fetchAndActivate(this.remoteConfig);
      this.updateFlags();
    } catch (error) {
      console.warn('Remote Config fetch failed, using defaults:', error);
      this.featureFlags.next({
        enable_dark_mode: false,
        enable_task_priority: false,
        enable_due_dates: true,
      });
    }
  }

  private updateFlags(): void {
    const flags: Record<string, boolean> = {
      enable_dark_mode: getValue(this.remoteConfig, 'enable_dark_mode').asBoolean(),
      enable_task_priority: getValue(this.remoteConfig, 'enable_task_priority').asBoolean(),
      enable_due_dates: getValue(this.remoteConfig, 'enable_due_dates').asBoolean(),
    };
    this.featureFlags.next(flags);

    const banner = getValue(this.remoteConfig, 'app_banner_message').asString();
    this.bannerSubject.next(banner);
  }

  isFeatureEnabled(featureName: string): boolean {
    const flags = this.featureFlags.value;
    return flags[featureName] ?? false;
  }

  async refreshConfig(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      this.updateFlags();
    } catch (error) {
      console.error('Error refreshing Remote Config:', error);
    }
  }
}