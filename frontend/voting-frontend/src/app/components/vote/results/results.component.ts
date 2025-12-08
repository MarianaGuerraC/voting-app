import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../services/vote.service';
import { AuthService } from '../../../services/auth.service'; // <-- importamos AuthService
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
  isAdmin = false; // <-- flag admin

  constructor(
    private voteService: VoteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadResults();
    this.loadVotes();

    //reviso si hay token de admin para habilitar el boton
    this.isAdmin = !!this.authService.getToken();
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
      error: () => alert('Error loading vote detail')
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
