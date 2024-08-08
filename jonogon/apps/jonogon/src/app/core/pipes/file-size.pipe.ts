import { Pipe, PipeTransform } from '@angular/core';
import { getFileSizeFormat } from '../utils/misc.helpers';

@Pipe({
  name: 'jonogonFileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(value: number | string): string {
    return getFileSizeFormat(value);
  }
}
