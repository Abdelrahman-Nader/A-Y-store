import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(
      loading => this.loading = loading
    );
  }
}
