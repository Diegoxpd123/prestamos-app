import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WhatsappButton } from '../../shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, WhatsappButton],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  stats = [
    { value: '10,000+', label: 'Clientes satisfechos', icon: '👥' },
    { value: 'S/. 50M+', label: 'Prestados', icon: '💰' },
    { value: '95%', label: 'Aprobación rápida', icon: '⚡' },
    { value: '24/7', label: 'Atención', icon: '🕐' }
  ];

  features = [
    {
      icon: '⚡',
      title: 'Aprobación Rápida',
      description: 'Respuesta en menos de 24 horas. Proceso 100% digital sin papeles.'
    },
    {
      icon: '💰',
      title: 'Tasas Competitivas',
      description: 'Ofrecemos las mejores tasas del mercado. Calcula tu préstamo sin compromiso.'
    },
    {
      icon: '📋',
      title: 'Sin Documentación Compleja',
      description: 'Solo necesitas tu DNI y comprobante de ingresos. Todo desde tu celular.'
    },
    {
      icon: '🔒',
      title: 'Totalmente Seguro',
      description: 'Tus datos están protegidos con encriptación de nivel bancario.'
    },
    {
      icon: '📱',
      title: 'Plataforma Digital',
      description: 'Gestiona tu préstamo desde cualquier dispositivo, cuando quieras.'
    },
    {
      icon: '✅',
      title: 'Flexibilidad de Pago',
      description: 'Elige el plazo que mejor se adapte a tus necesidades. De 3 a 36 meses.'
    }
  ];

  steps = [
    {
      number: '01',
      title: 'Simula tu Préstamo',
      description: 'Usa nuestra calculadora para ver cuánto puedes obtener y cuánto pagarías mensualmente.'
    },
    {
      number: '02',
      title: 'Completa tu Solicitud',
      description: 'Llena el formulario en menos de 5 minutos. Solo necesitas información básica.'
    },
    {
      number: '03',
      title: 'Recibe tu Aprobación',
      description: 'Te notificamos en menos de 24 horas. Si eres aprobado, el dinero está en tu cuenta.'
    }
  ];

  testimonials = [
    {
      name: 'María González',
      role: 'Emprendedora',
      image: '👩',
      comment: 'El proceso fue súper rápido. En menos de un día tenía el dinero en mi cuenta. Muy recomendable.',
      rating: 5
    },
    {
      name: 'Carlos Ramírez',
      role: 'Comerciante',
      image: '👨',
      comment: 'Excelente servicio. Las tasas son justas y el proceso es muy transparente. Definitivamente volveré a usar sus servicios.',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      role: 'Profesional',
      image: '👩‍💼',
      comment: 'Me encantó que todo se puede hacer desde el celular. Muy moderno y eficiente. El equipo de soporte es excelente.',
      rating: 5
    }
  ];

  faqs = [
    {
      question: '¿Cuáles son los requisitos para solicitar un préstamo?',
      answer: 'Solo necesitas ser mayor de edad, tener DNI vigente, comprobante de ingresos y una cuenta bancaria activa.',
      isOpen: false
    },
    {
      question: '¿Cuánto tiempo tarda la aprobación?',
      answer: 'Normalmente aprobamos préstamos en menos de 24 horas. En algunos casos puede tomar hasta 48 horas.',
      isOpen: false
    },
    {
      question: '¿Cuál es el monto mínimo y máximo?',
      answer: 'Puedes solicitar desde S/. 1,000 hasta S/. 50,000, dependiendo de tu capacidad de pago.',
      isOpen: false
    },
    {
      question: '¿Qué plazos de pago ofrecen?',
      answer: 'Ofrecemos plazos flexibles desde 3 hasta 36 meses. Tú eliges el que mejor se adapte a tus necesidades.',
      isOpen: false
    },
    {
      question: '¿Necesito aval o garantía?',
      answer: 'No, nuestros préstamos son personales sin necesidad de aval o garantía física.',
      isOpen: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  goToSimulator(): void {
    this.router.navigate(['/simulador']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
