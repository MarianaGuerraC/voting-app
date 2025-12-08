import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private voteService: VoteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.voteService.getResults().subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Error loading results.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
