import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly toastr: ToastrService) {}

  showTxSuccessToast() {
    return this.toastr.success('Operation sent', undefined, {
      progressBar: true,
      positionClass: 'toast-bottom-center',
    });
  }

  showTxErrorToast() {
    return this.toastr.error('Operation failed to send', undefined, {
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

  showOperationRequestReceivedToast() {
    return this.toastr.success('Operation request received', 'Success', {
      closeButton: true,
      timeOut: 0,
      positionClass: 'toast-bottom-center',
    });
  }

  showSignRequestReceivedToast() {
    return this.toastr.success('Sign request received', 'Success', {
      closeButton: true,
      timeOut: 0,
      positionClass: 'toast-bottom-center',
    });
  }
}
