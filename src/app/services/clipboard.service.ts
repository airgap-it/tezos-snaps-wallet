import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  constructor(private readonly toastr: ToastrService) {}

  public async copy(text: string): Promise<void> {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.toastr.success('Copied to clipboard', 'Success', {
          progressBar: true,
          positionClass: 'toast-bottom-center',
        });
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
