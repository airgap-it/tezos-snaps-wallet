import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly toastr: ToastrService) {}

  showTxSucessToast() {
    return this.toastr.success('Operation sent', undefined, {
      progressBar: true,
      positionClass: 'toast-bottom-center',
    });
  }

  showTxErrorToast() {
    return this.toastr.error('Operaton failed to send', undefined, {
      progressBar: true,
      positionClass: 'toast-bottom-center',
    });
  }

  showCopiedToClipboard() {
    return this.toastr.success('Copied to clipboard', 'Success', {
      progressBar: true,
      positionClass: 'toast-bottom-center',
    });
  }
}
