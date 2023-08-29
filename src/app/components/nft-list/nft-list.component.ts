import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../types';

@Component({
  selector: 'app-nft-list',
  templateUrl: './nft-list.component.html',
  styleUrls: ['./nft-list.component.scss'],
})
export class NftListComponent implements OnInit {
  @Input() nfts: Token[] = [];

  constructor() {}

  ngOnInit(): void {}
}
