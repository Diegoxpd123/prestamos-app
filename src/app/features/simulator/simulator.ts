import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SimulationService } from '../../core/services/simulation.service';
import { SimulationResult } from '../../core/models/loan.model';
import { WhatsappButton } from '../../shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, WhatsappButton],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator implements OnInit {
  monto = signal(10000);
  plazo = signal(12);

  availableAmounts: number[] = [];
  availableTerms: number[] = [];

  simulation = signal<SimulationResult | null>(null);
  
  showAmortizationTable = signal(false);

  constructor(
    private simulationService: SimulationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.availableAmounts = this.simulationService.getAvailableAmounts();
    this.availableTerms = this.simulationService.getAvailableTerms();
    this.calculateSimulation();
  }

  onMontoChange(value: number): void {
    this.monto.set(value);
    this.calculateSimulation();
  }

  onPlazoChange(value: number): void {
    this.plazo.set(value);
    this.calculateSimulation();
  }

  calculateSimulation(): void {
    const result = this.simulationService.calculateSimulation(
      this.monto(),
      this.plazo()
    );
    this.simulation.set(result);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  }

  toggleAmortizationTable(): void {
    this.showAmortizationTable.update(val => !val);
  }

  goToLogin(): void {
    // Guardar simulación en localStorage para pre-llenar el formulario
    if (this.simulation()) {
      localStorage.setItem('simulationData', JSON.stringify({
        monto: this.monto(),
        plazo: this.plazo()
      }));
    }
    this.router.navigate(['/login']);
  }

  goToRequestLoan(): void {
    // Si está logueado, ir directo a solicitar
    // Si no, ir a login
    const user = localStorage.getItem('currentUser');
    if (user) {
      // Guardar simulación
      if (this.simulation()) {
        localStorage.setItem('simulationData', JSON.stringify({
          monto: this.monto(),
          plazo: this.plazo()
        }));
      }
      this.router.navigate(['/dashboard']);
    } else {
      this.goToLogin();
    }
  }
}
