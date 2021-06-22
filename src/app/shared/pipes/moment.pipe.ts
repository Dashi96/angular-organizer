import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'moment',
  pure: false
})
export class MomentPipe implements PipeTransform {
  transform(m: any, format: string = 'MMMM YYYY'): string {
    return m.format(format)
  }
}
