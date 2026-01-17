import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Loan, LoanRequest, LoanStatus } from '../models/loan.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private mockLoans: Loan[] = [];

  constructor(private authService: AuthService) {
    // Cargar préstamos desde localStorage si existen
    this.loadLoansFromStorage();
  }

  private loadLoansFromStorage(): void {
    const loansStr = localStorage.getItem('userLoans');
    if (loansStr) {
      this.mockLoans = JSON.parse(loansStr);
    }
  }

  private saveLoansToStorage(): void {
    localStorage.setItem('userLoans', JSON.stringify(this.mockLoans));
  }

  getUserLoans(): Observable<Loan[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return of([]);
    }

    const userLoans = this.mockLoans.filter(loan => loan.userId === user.id);
    return of(userLoans).pipe(delay(500));
  }

  getLoanById(id: string): Observable<Loan | null> {
    const loan = this.mockLoans.find(l => l.id === id);
    return of(loan || null).pipe(delay(300));
  }

  requestLoan(request: LoanRequest): Observable<Loan> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Calcular detalles del préstamo
    const tasaInteres = 24; // 24% anual
    const tasaMensual = tasaInteres / 100 / 12;
    const cuotaMensual = request.monto * (tasaMensual * Math.pow(1 + tasaMensual, request.plazo)) / 
                        (Math.pow(1 + tasaMensual, request.plazo) - 1);
    const totalPagar = cuotaMensual * request.plazo;

    const newLoan: Loan = {
      id: Date.now().toString(),
      userId: user.id,
      monto: request.monto,
      plazo: request.plazo,
      tasaInteres: tasaInteres,
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      totalPagar: Math.round(totalPagar * 100) / 100,
      estado: 'pendiente' as LoanStatus,
      fechaSolicitud: new Date(),
      saldoPendiente: Math.round(totalPagar * 100) / 100,
      historialCuotas: []
    };

    this.mockLoans.push(newLoan);
    this.saveLoansToStorage();

    return of(newLoan).pipe(delay(1000));
  }

  updateLoanStatus(loanId: string, status: LoanStatus): Observable<Loan> {
    const loan = this.mockLoans.find(l => l.id === loanId);
    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    loan.estado = status;
    if (status === 'aprobado' || status === 'activo') {
      loan.fechaAprobacion = new Date();
      loan.fechaInicio = new Date();
      // Calcular fecha de vencimiento
      const vencimiento = new Date();
      vencimiento.setMonth(vencimiento.getMonth() + loan.plazo);
      loan.fechaVencimiento = vencimiento;
      
      // Generar cuotas
      this.generateCuotas(loan);
    }

    this.saveLoansToStorage();
    return of(loan).pipe(delay(500));
  }

  private generateCuotas(loan: Loan): void {
    const tasaMensual = loan.tasaInteres / 100 / 12;
    const cuotas: any[] = [];
    let saldoRestante = loan.totalPagar;

    for (let i = 1; i <= loan.plazo; i++) {
      const interes = saldoRestante * tasaMensual;
      const capital = loan.cuotaMensual - interes;
      saldoRestante -= loan.cuotaMensual;

      const fechaVencimiento = new Date(loan.fechaInicio!);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

      cuotas.push({
        numero: i,
        fechaVencimiento,
        monto: loan.cuotaMensual,
        capital: Math.max(0, capital),
        interes: Math.max(0, interes),
        estado: 'pendiente' as const,
        saldoRestante: Math.max(0, saldoRestante)
      });
    }

    loan.historialCuotas = cuotas;
    if (cuotas.length > 0) {
      loan.proximaCuota = cuotas[0];
    }
  }
}
