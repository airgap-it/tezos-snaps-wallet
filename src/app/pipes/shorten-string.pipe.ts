import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenString',
})
export class ShortenStringPipe implements PipeTransform {
  public transform(value: string, args: { ifMatches?: string | RegExp } = {}) {
    if (!value || !(typeof value === 'string')) {
      // console.warn(`ShortenStringPipe: invalid value: ${value}`)
      return '';
    }

    let result = value;
    if (
      value.length >= 15 &&
      (args.ifMatches === undefined || result.match(args.ifMatches))
    ) {
      result = `${value.substr(0, 8)}...${value.substr(-5)}`;
    }

    return result;
  }
}
