import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { WhatsappButton } from '../../../shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, WhatsappButton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard implements OnInit {
  currentAdmin: any = null;
  clients: any[] = [];
  statistics: any = {
    totalClientes: 0,
    clientesActivos: 0,
    clientesInactivos: 0,
    clientesNuevosHoy: 0
  };
  isLoading = true;
  sidebarOpen = false;

  constructor(
    private adminService: AdminService,
    private adminDashboardService: AdminDashboardService,
    public router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadAdminData();
    await this.loadData();
  }

  loadAdminData(): void {
    this.currentAdmin = this.adminService.getCurrentAdmin();
    if (!this.currentAdmin) {
      this.router.navigate(['/admin/login']);
    }
  }

  async loadData(): Promise<void> {
    this.isLoading = true;
    try {
      this.clients = await this.adminDashboardService.getAllClients();
      this.statistics = await this.adminDashboardService.getStatistics();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  }

  async refreshData(): Promise<void> {
    await this.loadData();
  }
}
