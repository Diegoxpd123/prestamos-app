import { Injectable } from '@angular/core';
import { SimulationResult, AmortizacionItem } from '../models/loan.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private readonly TASA_INTERES_ANUAL = 24; // 24% anual

  calculateSimulation(monto: number, plazo: number): SimulationResult {
    const tasaInteres = this.TASA_INTERES_ANUAL;
    const tasaMensual = tasaInteres / 100 / 12;
    
    // Fórmula de cuota mensual
    const cuotaMensual = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                        (Math.pow(1 + tasaMensual, plazo) - 1);
    
    const totalPagar = cuotaMensual * plazo;
    const totalIntereses = totalPagar - monto;
    
    // Generar tabla de amortización
    const tablaAmortizacion = this.generateAmortizationTable(monto, plazo, tasaMensual, cuotaMensual);

    return {
      monto,
      plazo,
      tasaInteres,
      cuotaMensual: Math.round(cuotaMensual * 100) / 100,
      totalPagar: Math.round(totalPagar * 100) / 100,
      totalIntereses: Math.round(totalIntereses * 100) / 100,
      tablaAmortizacion
    };
  }

  private generateAmortizationTable(
    monto: number, 
    plazo: number, 
    tasaMensual: number, 
    cuotaMensual: number
  ): AmortizacionItem[] {
    const tabla: AmortizacionItem[] = [];
    let saldoInicial = monto;

    for (let i = 1; i <= plazo; i++) {
      const interes = saldoInicial * tasaMensual;
      const capital = cuotaMensual - interes;
      const saldoFinal = saldoInicial - capital;

      tabla.push({
        numero: i,
        saldoInicial: Math.round(saldoInicial * 100) / 100,
        cuota: Math.round(cuotaMensual * 100) / 100,
        capital: Math.round(capital * 100) / 100,
        interes: Math.round(interes * 100) / 100,
        saldoFinal: Math.max(0, Math.round(saldoFinal * 100) / 100)
      });

      saldoInicial = saldoFinal;
    }

    return tabla;
  }

  getAvailableAmounts(): number[] {
    return [1000, 2000, 5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000];
  }

  getAvailableTerms(): number[] {
    return [3, 6, 9, 12, 18, 24, 30, 36];
  }
}
