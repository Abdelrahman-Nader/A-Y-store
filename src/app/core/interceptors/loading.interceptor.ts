import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // زيادة عدد الطلبات النشطة
    this.totalRequests++;
    this.loadingService.setLoading(true);
    
    return next.handle(request).pipe(
      finalize(() => {
        // تقليل عدد الطلبات النشطة
        this.totalRequests--;
        
        // إذا لم تعد هناك طلبات نشطة، إيقاف مؤشر التحميل
        if (this.totalRequests === 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
