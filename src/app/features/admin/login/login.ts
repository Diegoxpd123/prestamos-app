import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class AdminLogin implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/admin/dashboard';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener returnUrl de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    // Si ya está logueado como admin, redirigir
    if (this.adminService.isAdminLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const username = this.loginForm.value.username.trim();
      const password = this.loginForm.value.password;

      try {
        const isValid = await this.adminService.validateAdminCredentials(username, password);
        
        if (isValid) {
          this.isLoading = false;
          this.router.navigate([this.returnUrl]);
        } else {
          this.isLoading = false;
          this.errorMessage = 'Usuario o contraseña incorrectos. Verifica tus credenciales.';
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Error al validar credenciales. Por favor, intenta nuevamente.';
        console.error('Admin login error:', error);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
