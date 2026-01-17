import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoanService } from '../../core/services/loan.service';
import { Loan } from '../../core/models/loan.model';
import { User } from '../../core/models/user.model';
import { WhatsappButton } from '../../shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WhatsappButton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  loans: Loan[] = [];
  activeLoan: Loan | null = null;
  isLoading = true;
  sidebarOpen = false;

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadLoans();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  loadLoans(): void {
    this.isLoading = true;
    this.loanService.getUserLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.activeLoan = loans.find(loan => loan.estado === 'activo' || loan.estado === 'aprobado') || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToSimulator(): void {
    this.router.navigate(['/simulador']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pendiente': 'badge-warning',
      'aprobado': 'badge-success',
      'rechazado': 'badge-error',
      'activo': 'badge-primary',
      'pagado': 'badge-success',
      'vencido': 'badge-error'
    };
    return classes[status] || 'badge-default';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado',
      'activo': 'Activo',
      'pagado': 'Pagado',
      'vencido': 'Vencido'
    };
    return labels[status] || status;
  }

  get activeLoansCount(): number {
    return this.loans.filter(loan => loan.estado === 'activo' || loan.estado === 'aprobado').length;
  }
}
