import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { VoterService } from '../../services/voter.service';
import { Voter } from '../../models/voter.model'; 

@Component({
  selector: 'app-voter-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voter-list.component.html',
  styleUrl: './voter-list.component.css'
})
export class VoterListComponent implements OnInit { //implemento OnInit

  voters: Voter[] = [];
  errorMessage: string | null = null;
  loading: boolean = true;

  constructor(private voterService: VoterService) { }

  //para onitOnInit
  ngOnInit(): void {
    this.loadVoters();
  }

  //logica para carga de datos
  loadVoters(): void {
    this.loading = true;
    this.errorMessage = null;

    this.voterService.getVoters().subscribe({
      next: (data) => {
        this.voters = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading voters.' + (err.error?.detail || err.message);
        this.loading = false;
      }
    });
  }
}