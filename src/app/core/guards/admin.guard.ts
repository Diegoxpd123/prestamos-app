import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminService } from '../services/admin.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  if (adminService.isAdminLoggedIn()) {
    return true;
  }

  // Redirigir al login de admin si no está autenticado
  router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
