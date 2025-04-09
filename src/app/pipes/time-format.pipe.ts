import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(time: string): string {
    if (!time) return '';

    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);

    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
  }
}
