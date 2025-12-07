import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoteService } from '../../../services/vote.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vote-form.component.html',
  styleUrls: ['./vote-form.component.css'],
})
export class VoteFormComponent implements OnInit {
  ci: string = '';
  selectedCandidate: string = '';
  candidates: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  submitted = false;

  constructor(private voteService: VoteService, public router: Router) { }

  ngOnInit() {
    this.voteService.getCandidates().subscribe({
      next: (data) => (this.candidates = data),
      error: () => (this.errorMessage = 'Could not load candidates.'),
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.ci || !this.selectedCandidate) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    //Lo convierto a numero
    const candidateIdNumber = parseInt(this.selectedCandidate, 10);
    this.voteService.sendVote(this.ci, candidateIdNumber).subscribe({
      next: () => {
        this.successMessage = 'Vote successfully registered';
        this.ci = '';
        this.selectedCandidate = '';
        this.submitted = false;
      },
      error: (err) => {
        if (err.status === 409) {
          //ValueError("This voter has already voted")
          this.errorMessage =
            'Error: This document has already registered a vote.';
        } else if (err.status === 404) {
          //VoterService.find_voter_by_document (si lanza 404)
          this.errorMessage =
            'Error: The voter document could not be found in the registry.';
        } else if (err.status === 400) {
          //Candidato inválido o a otros errores 400
          if (err.error?.detail) {
            this.errorMessage = err.error.detail; //Muestra "The selected candidate is not a valid candidate."
          } else {
            this.errorMessage =
              'Error: Invalid request data (check document format or candidate).';
          }
        } else {
          this.errorMessage =
            'Server connection error. Please try again later.';
        }
      },
    });
  }
}
