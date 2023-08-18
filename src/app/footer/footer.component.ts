import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HowToModalComponent } from '../components/how-to-modal/how-to-modal.component';
import { TextModalComponent } from '../text-modal/text-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private readonly modalService: BsModalService) {}

  ngOnInit(): void {}

  showModal(type: 'about' | 'privacy-policy' | 'terms'): void {
    const initialState: ModalOptions<TextModalComponent> = {
      initialState: {
        title: 'header',
        text: type,
        closeBtnName: 'Close',
      },
    };
    const bsModalRef = this.modalService.show(TextModalComponent, initialState);
  }
}
