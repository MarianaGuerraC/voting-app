import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../services/vote.service';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: any[] = [];       //candidatos + votos
  votes: any[] = [];         //lista de votos
  selectedVote: any = null;  //detalle del voto

  isLoading = true;
  errorMessage = '';

  constructor(private voteService: VoteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadResults();
    this.loadVotes();
  }

  loadResults(): void {
    this.voteService.getResults().subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error loading results.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadVotes(): void {
    this.voteService.getVotesList().subscribe({
      next: (data) => {
        this.votes = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error loading votes.';
        this.cdr.detectChanges();
      }
    });
  }

  viewDetail(id: number) {
    this.voteService.getVoteDetail(id).subscribe({
      next: (data) => {
        this.selectedVote = data;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Error loading vote detail');
      }
    });
  }
}
