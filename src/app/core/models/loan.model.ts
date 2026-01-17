export interface Loan {
  id: string;
  userId: string;
  monto: number;
  plazo: number; // meses
  tasaInteres: number; // porcentaje anual
  cuotaMensual: number;
  totalPagar: number;
  estado: LoanStatus;
  fechaSolicitud: Date;
  fechaAprobacion?: Date;
  fechaInicio?: Date;
  fechaVencimiento?: Date;
  saldoPendiente: number;
  proximaCuota?: Cuota;
  historialCuotas: Cuota[];
}

export interface Cuota {
  numero: number;
  fechaVencimiento: Date;
  monto: number;
  capital: number;
  interes: number;
  estado: CuotaStatus;
  fechaPago?: Date;
}

export type LoanStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'activo' | 'pagado' | 'vencido';

export type CuotaStatus = 'pendiente' | 'pagada' | 'vencida';

export interface LoanRequest {
  monto: number;
  plazo: number;
  proposito: string;
  documentos?: Documento[];
}

export interface Documento {
  tipo: string;
  nombre: string;
  url: string;
  fechaSubida: Date;
}

export interface SimulationResult {
  monto: number;
  plazo: number;
  tasaInteres: number;
  cuotaMensual: number;
  totalPagar: number;
  totalIntereses: number;
  tablaAmortizacion: AmortizacionItem[];
}

export interface AmortizacionItem {
  numero: number;
  saldoInicial: number;
  cuota: number;
  capital: number;
  interes: number;
  saldoFinal: number;
}
