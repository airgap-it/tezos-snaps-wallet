import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  constructor(private readonly toastService: ToastService) {}

  public async copy(text: string): Promise<void> {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.toastService.showCopiedToClipboard();
      })
      .catch((err) => console.error('Failed to copy!', err));
  }

  public async paste(): Promise<string> {
    return navigator.clipboard
      .readText()
      .then(async (clipText) => {
        return clipText;
      })
      .catch((error) => {
        throw error;
      });
  }
}
