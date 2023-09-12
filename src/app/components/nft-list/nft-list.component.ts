import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../types';
import { ModalService } from 'src/app/services/modal.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-nft-list',
  templateUrl: './nft-list.component.html',
  styleUrls: ['./nft-list.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class NftListComponent implements OnInit {
  @Input() nfts: Token[] = [];

  @Input() isLoading: boolean = true;

  constructor(private readonly modalService: ModalService) {}

  ngOnInit(): void {}

  showNFTModal(nft: Token) {
    this.modalService.showNFTModal(nft);
  }
}
