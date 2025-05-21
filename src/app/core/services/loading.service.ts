import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() { }

  /**
   * تعيين حالة التحميل
   * @param loading حالة التحميل
   */
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
