import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.scss',
})
export class WhatsappButton implements OnInit {
  phoneNumber = '51928080340'; // Número sin el + y sin espacios
  isVisible = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ocultar el botón en páginas de autenticación si se desea
    this.checkVisibility();
  }

  private checkVisibility(): void {
    // Puedes personalizar cuándo mostrar el botón
    const currentUrl = this.router.url;
    // El botón se muestra en todas las páginas por defecto
  }

  openWhatsApp(message: string = ''): void {
    const user = this.authService.getCurrentUser();
    let defaultMessage = 'Hola, estoy interesado en obtener información sobre préstamos.';

    if (user) {
      defaultMessage = `Hola, soy ${user.nombre} ${user.apellido} (${user.email}) y necesito información sobre préstamos.`;
    }

    const finalMessage = message || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }

  openWithSupportMessage(): void {
    this.openWhatsApp('Necesito soporte técnico');
  }

  openWithQueryMessage(): void {
    this.openWhatsApp('Tengo una consulta sobre mi préstamo');
  }

  openWithFollowUpMessage(): void {
    this.openWhatsApp('Quiero hacer seguimiento a mi solicitud de préstamo');
  }
}
