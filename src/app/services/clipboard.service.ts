import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  constructor() {}

  public async copy(text: string): Promise<void> {
    navigator.clipboard
      .writeText(text)
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
