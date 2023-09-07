import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { NetworkType } from '@airgap/beacon-types';
@Component({
  selector: 'app-node-selector-modal',
  templateUrl: './node-selector-modal.component.html',
  styleUrls: ['./node-selector-modal.component.scss'],
})
export class NodeSelectorModalComponent implements OnInit {
  public customNodeAddress: string = '';
  public customNodeNetwork: NetworkType = NetworkType.MAINNET;
  public networks: string[] = [NetworkType.MAINNET, NetworkType.GHOSTNET];

  public nodes: [string, { selected: boolean; url: string }[]][] = [];

  constructor(
    public readonly bsModalRef: BsModalRef,
    public readonly api: ApiService,
  ) {
    this.loadRPCs();
  }

  ngOnInit(): void {}

  loadRPCs() {
    this.nodes = Object.entries(this.api.RPCs)
      .filter((element) => element[1].all.length > 0)
      .map((element) => {
        return [
          element[0] as NetworkType,
          element[1].all.map((rpc) => ({
            selected: element[1].selected === rpc,
            url: rpc,
          })),
        ];
      });
  }

  selectNode(network: NetworkType, rpc: string) {
    this.api.selectRpc(network, rpc);
    this.loadRPCs();
  }

  addNode(): void {
    this.api.addCustomRpc(this.customNodeNetwork, this.customNodeAddress);

    this.bsModalRef.hide();
  }
}
