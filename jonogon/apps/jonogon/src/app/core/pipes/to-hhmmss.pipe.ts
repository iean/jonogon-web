import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ToHHMMSS',
  standalone: true,
})
export class ToHHMMSSPipe implements PipeTransform {
  transform(sec: number): string {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
}
