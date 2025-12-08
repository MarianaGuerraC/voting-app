import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../services/vote.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  results: any[] = [];
  votes: any[] = [];
  selectedVote: any = null;

  isLoading = true;
  errorMessage = '';
  isAdmin = false;

  //paginacion
  candidatesPerPage = 5;
  currentCandidatesPage = 1;
  totalCandidatesPages = 1;
  pagedResults: any[] = [];

  votesPerPage = 5;
  currentVotesPage = 1;
  totalVotesPages = 1;
  pagedVotes: any[] = [];

  constructor(
    private voteService: VoteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = !!this.authService.getToken();
    this.loadResults();
    this.loadVotes();
  }

  loadResults(): void {
    this.voteService.getResults().subscribe({
      next: (data) => {
        this.results = data;
        this.updatePagedResults();
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
        this.updatePagedVotes();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error loading votes.';
        this.cdr.detectChanges();
      }
    });
  }

  // detalle de voto
  viewDetail(id: number) {
    this.voteService.getVoteDetail(id).subscribe({
      next: (data) => {
        this.selectedVote = data;
        this.cdr.detectChanges();
      },
      error: () => alert('Error loading vote detail')
    });
  }

  //vuelvo al panel admin
  goBack() {
    this.router.navigate(['/admin']);
  }

  //paginacion candidatos
  updatePagedResults(): void {
    const start = (this.currentCandidatesPage - 1) * this.candidatesPerPage;
    const end = start + this.candidatesPerPage;
    this.pagedResults = this.results.slice(start, end);
    this.totalCandidatesPages = Math.ceil(this.results.length / this.candidatesPerPage);
  }

  goToCandidatesPage(page: number) {
    this.currentCandidatesPage = page;
    this.updatePagedResults();
  }

  //paginacion votos
  updatePagedVotes(): void {
    const start = (this.currentVotesPage - 1) * this.votesPerPage;
    const end = start + this.votesPerPage;
    this.pagedVotes = this.votes.slice(start, end);
    this.totalVotesPages = Math.ceil(this.votes.length / this.votesPerPage);
  }

  goToVotesPage(page: number) {
    this.currentVotesPage = page;
    this.updatePagedVotes();
  }
}
