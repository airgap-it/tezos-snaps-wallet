import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../types';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-nft-list',
  templateUrl: './nft-list.component.html',
  styleUrls: ['./nft-list.component.scss'],
})
export class NftListComponent implements OnInit {
  @Input() nfts: Token[] = [];

  constructor(private readonly modalService: ModalService) {}

  ngOnInit(): void {}

  showNFTModal(nft: Token) {
    this.modalService.showNFTModal(nft);
  }
}
