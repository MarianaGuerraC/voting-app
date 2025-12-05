import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VoterService } from '../../services/voter.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import * as voterModel from '../../models/voter.model';

@Component({
  selector: 'app-voter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './voter-form.component.html',
  styleUrls: ['./voter-form.component.css']
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
  ) {
  }

  ngOnInit(): void {
    // Inicializar el formulario AQUI, no en el constructor
    this.voterForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    //verifico si estoy en modo edicion
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.voterId = +id; //convierto a numero
        
        //logica para cargar datos del votante a editar
        this.voterService.getVoterById(this.voterId).subscribe({
          next: (voter) => {
            //relleno el form con los datos recibido
            this.voterForm.patchValue({
              name: voter.name,
              email: voter.email,
            });
          },
          error: (err) => {
            this.errorMessage = 'Error al cargar los datos del votante: ' + (err.error?.detail || err.message);
            //si no existe redirijo
            this.router.navigate(['/voter-list']); 
          }
        });
      }
    });
  }
  
  // Lógica principal de envío
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.voterForm.invalid) {
      this.errorMessage = 'Por favor, rellena todos los campos requeridos y corrige los errores.';
      return;
    }

    const payload: voterModel.VoterPayload = this.voterForm.value;
    let operation: Observable<voterModel.Voter>;

    if (this.isEditMode && this.voterId) {
      // 2. Modo Edición
      operation = this.voterService.updateVoter(this.voterId, payload);
    } else {
      // 3. Modo Creación
      operation = this.voterService.createVoter(payload);
    }

    operation.subscribe({
      next: () => {
        this.successMessage = `Votante ${this.isEditMode ? 'actualizado' : 'creado'} con éxito.`;
        // Redirigir al listado después de 1 segundo
        setTimeout(() => {
          this.router.navigate(['/voter-list']);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = 'Error al procesar la solicitud: ' + (err.error?.detail || err.message);
      }
    });
  }
}