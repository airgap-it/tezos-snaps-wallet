import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import packageJson from '../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public version = packageJson.version;

  constructor(public readonly modalService: ModalService) {}

  ngOnInit(): void {}

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
