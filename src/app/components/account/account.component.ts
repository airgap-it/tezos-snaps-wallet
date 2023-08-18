import { Component, Input, OnInit } from '@angular/core';
import { Token } from 'src/app/types';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() address: string = '';
  @Input() balance: string = '';
  @Input() usdBalance: string = '';
  @Input() tokens: Token[] = [];

  constructor() {}

  ngOnInit(): void {}
}
