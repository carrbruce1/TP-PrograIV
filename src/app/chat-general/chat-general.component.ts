import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Mensaje } from '../services/chat-general.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-flotante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-general.component.html',
  styleUrl: './chat-general.component.css'
})
export class ChatGeneralComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  nuevoMensaje: string = '';
  usuarioActual: string = 'Invitado';
  estaAbierto: boolean = false;
  
  mensajes: Mensaje[] = [];
  private chatSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getUser();
      if (user && user.email) {
        this.usuarioActual = user.email.split('@')[0]; 
      } else {
        const usuarioGuardado = localStorage.getItem('usuarioLogueado');
        if (usuarioGuardado) {
          this.usuarioActual = usuarioGuardado;
        } else {
          this.usuarioActual = 'Invitado';
        }
      }
    } catch (e) {
      this.usuarioActual = 'Invitado';
    }

    console.log('Tu usuario detectado para el chat es:', this.usuarioActual);

    this.chatSub = this.chatService.getMensajesObservable().subscribe((lista: Mensaje[]) => {
      this.mensajes = lista;
      this.autoScroll();
    });
  }

  ngOnDestroy() {
    if (this.chatSub) this.chatSub.unsubscribe();
  }

  toggleChat() {
    this.estaAbierto = !this.estaAbierto;
    if (this.estaAbierto) {
      this.autoScroll();
    }
  }

  enviar() {
    if (this.usuarioActual === 'Invitado') return;
    
    if (!this.nuevoMensaje.trim()) return;
    this.chatService.agregarMensaje(this.usuarioActual, this.nuevoMensaje.trim());
    this.nuevoMensaje = '';
  }

  autoScroll() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}