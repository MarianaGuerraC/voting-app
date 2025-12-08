import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
//paso el reactive forms module porque uso formularios reactivos
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { Observable } from 'rxjs';
import { VoterService } from '../../services/voter.service';
import * as voterModel from '../../models/voter.model';


@Component({
  selector: 'app-voter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './voter-form.component.html',
  styleUrls: ['./voter-form.component.css'],
})

export class VoterFormComponent implements OnInit {

  voterForm!: FormGroup;
  isEditMode = false;
  voterId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private voterService: VoterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.voterForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', Validators.required],
      dob: ['', Validators.required],
      is_candidate: [null, Validators.required] //obligatorio elegir
    });

    //modo edicion update
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.voterId = +id;

        this.voterService.getVoterById(this.voterId).subscribe({
          next: (voter) => {
            this.voterForm.patchValue({
              name: voter.name,
              lastName: voter.lastName,
              document: voter.document,
              dob: voter.dob,
              is_candidate: voter.is_candidate
            });
          },
          error: (err) => {
            this.errorMessage = 'Error loading voter.';
            this.router.navigate(['/voter-list']);
          }
        });
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.voterForm.invalid) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    const payload: voterModel.VoterPayload = this.voterForm.value;
    let request: Observable<voterModel.Voter>;

    request = this.isEditMode && this.voterId
      ? this.voterService.updateVoter(this.voterId, payload)
      : this.voterService.createVoter(payload);

    request.subscribe({
      next: () => {
        this.successMessage = `Voter successfully ${this.isEditMode ? 'updated' : 'created'}.`;
        setTimeout(() => this.router.navigate(['/voter-list']), 800);
      },
      error: () => {
        this.errorMessage = 'Error processing request.';
      }
    });
  }
}
