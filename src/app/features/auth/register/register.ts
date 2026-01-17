import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleSheetsService } from '../../../core/services/google-sheets.service';
import { WhatsappButton } from '../../../shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, WhatsappButton],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private googleSheetsService: GoogleSheetsService,
    public router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData = {
        nombre: this.registerForm.value.nombre,
        apellido: this.registerForm.value.apellido,
        dni: this.registerForm.value.dni,
        telefono: this.registerForm.value.telefono,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      try {
        // Primero verificar si el email ya existe en Google Sheets
        const emailExists = await this.googleSheetsService.checkEmailExists(registerData.email);
        
        if (emailExists) {
          this.isLoading = false;
          this.errorMessage = 'Este email ya está registrado. Por favor, usa otro email.';
          return;
        }

        // Registrar en la aplicación (localStorage)
        this.authService.register(registerData).subscribe({
          next: async (authResponse) => {
            // Después de registrar en la app, guardar en Google Sheets con contraseña
            try {
              // Primero agregar cliente sin contraseña (para mantener compatibilidad)
              const sheetResult = await this.googleSheetsService.addClientWithPassword({
                email: registerData.email,
                nombre: registerData.nombre,
                apellido: registerData.apellido,
                dni: registerData.dni,
                telefono: registerData.telefono,
                password: registerData.password
              });

              if (!sheetResult.success) {
                console.warn('Usuario registrado en la app, pero error al guardar en Google Sheets:', sheetResult.error);
                // Continuamos aunque haya error en Sheets
              }

              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            } catch (error) {
              console.error('Error al guardar en Google Sheets:', error);
              // El usuario ya está registrado en la app, así que continuamos
              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error al registrar. Por favor, intenta nuevamente.';
            console.error('Register error:', error);
          }
        });
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Error al verificar email. Por favor, intenta nuevamente.';
        console.error('Error checking email:', error);
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get nombre() { return this.registerForm.get('nombre'); }
  get apellido() { return this.registerForm.get('apellido'); }
  get dni() { return this.registerForm.get('dni'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get passwordMismatch() { return this.registerForm.errors?.['passwordMismatch'] && this.confirmPassword?.touched; }
}
