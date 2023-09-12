import { animate, style, transition, trigger } from '@angular/animations';

export const fadeIn = trigger('fadeInAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('1s ease-out', style({ opacity: 1 })),
  ]),
]);
