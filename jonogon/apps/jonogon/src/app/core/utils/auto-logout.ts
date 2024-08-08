import { signal } from '@angular/core';
import { AutoLogoutSettings } from '../models/app-configuration.model';

const AUTO_LOGOUT_SETTING_LOCAL_STORAGE_KEY = 'auto-logout-settings';
// auto-login settings
export const autoLogoutSettings = signal<AutoLogoutSettings>({
  auto_logout:
    JSON.parse(
      localStorage.getItem(AUTO_LOGOUT_SETTING_LOCAL_STORAGE_KEY) ?? '{}'
    ).auto_logout ?? true,
  auto_logout_duration:
    JSON.parse(
      localStorage.getItem(AUTO_LOGOUT_SETTING_LOCAL_STORAGE_KEY) ?? '{}'
    ).auto_logout_duration ?? 30,
});

export function saveAutoLogoutSettings(setting: AutoLogoutSettings) {
  localStorage.setItem(
    AUTO_LOGOUT_SETTING_LOCAL_STORAGE_KEY,
    JSON.stringify(setting)
  );
  autoLogoutSettings.set(setting);
}

export function getSavedAutoLogoutSettings(): AutoLogoutSettings {
  return autoLogoutSettings();
}
