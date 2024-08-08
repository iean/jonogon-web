import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TimeRemaining',
  standalone: true,
})
export class TimeRemainingPipe implements PipeTransform {
  transform(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds} ms`;
    } else if (milliseconds < 60000) {
      const seconds = Math.floor(milliseconds / 1000);
      return `${seconds} sec`;
    } else if (milliseconds < 3600000) {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
      return `${minutes} min ${seconds} sec`;
    } else {
      const hours = Math.floor(milliseconds / 3600000);
      const minutes = Math.floor((milliseconds % 3600000) / 60000);
      return `${hours} hour ${minutes} min`;
    }
  }
}
