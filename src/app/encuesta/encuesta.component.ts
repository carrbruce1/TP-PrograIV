import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css',
})
export class EncuestaComponent {
  juegoFavorito = '';
  dificultad = 1;
  mejoras = '';
  recomienda = false;
  mensaje = '';

  constructor(private auth: AuthService) {}

  async enviarEncuesta() {
    if (!this.juegoFavorito.trim() || !this.mejoras.trim()) {
      this.mensaje = "Por favor, completa los campos de juego y mejoras.";
      return;
    }

    const user = await this.auth.getUser();
    
    if (!user) {
      this.mensaje = "Debes estar logueado para responder.";
      return;
    }

    const { error } = await this.auth.supabase
      .from('encuesta')
      .insert([{
        usuario_id: user.id,
        juego_favorito: this.juegoFavorito,
        dificultad: this.dificultad,
        mejoras: this.mejoras,
        recomienda: this.recomienda
      }]);

    if (error) {
      if (error.message.includes('violates row-level security')) {
        this.mensaje = "Error de permisos: No tienes autorización para enviar la encuesta.";
      } else if (error.message.includes('duplicate')) {
        this.mensaje = "Ya has enviado una encuesta anteriormente.";
      } else {
        this.mensaje = "Ups, algo salió mal. Por favor, intenta más tarde.";
      }
      console.error("Detalle del error:", error.message);
    } else {
      this.mensaje = "¡Gracias por tu opinión!";
      this.juegoFavorito = '';
      this.mejoras = '';
      this.dificultad = 1;
      this.recomienda = false;
    }
  }
}