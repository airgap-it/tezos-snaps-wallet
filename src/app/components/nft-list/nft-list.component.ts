import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../types';
import { ModalService } from 'src/app/services/modal.service';
import { fadeIn } from 'src/app/animations/fade-in.animation';

@Component({
  selector: 'app-nft-list',
  templateUrl: './nft-list.component.html',
  styleUrls: ['./nft-list.component.scss'],
  animations: [fadeIn],
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
