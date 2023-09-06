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
      value.length >= 13 &&
      (args.ifMatches === undefined || result.match(args.ifMatches))
    ) {
      result = `${value.substr(0, 7)}...${value.substr(-4)}`;
    }

    return result;
  }
}
