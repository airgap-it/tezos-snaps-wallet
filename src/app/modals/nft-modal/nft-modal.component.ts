import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/types';

@Component({
  selector: 'app-nft-modal',
  templateUrl: './nft-modal.component.html',
  styleUrls: ['./nft-modal.component.scss'],
})
export class NftModalComponent implements OnInit {
  nft?: Token;

  constructor() {}

  ngOnInit(): void {}

  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
