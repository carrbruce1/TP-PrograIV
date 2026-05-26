import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntadosService } from '../../services/preguntados.service';
import { AuthService } from '../../services/auth.service';
import { RankingService } from '../../services/ranking.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnInit, OnDestroy {
  estadoJuego: string = 'INICIO'; 
  
  preguntaActual: any = null;
  categoriaActual: string = '';
  puntaje: number = 0;
  puntajeAnterior: number | null = null;
  cargandoPregunta: boolean = false;
  tiempoRestante: number = 35;
  intervaloTiempo: any;

  usuarioActual: string = 'Invitado';

  constructor(
    private preguntadosService: PreguntadosService,
    private authService: AuthService,
    private rankingService: RankingService
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getUser();
      if (user && user.email) {
        this.usuarioActual = user.email.split('@')[0];
      } else {
        const guardado = localStorage.getItem('usuarioLogueado');
        if (guardado) this.usuarioActual = guardado;
      }
    } catch (e) {
      this.usuarioActual = 'Invitado';
    }
  }

  ngOnDestroy() {
    this.limpiarTemporizador();
  }

  iniciarJuego() {
    this.puntaje = 0;
    this.siguientePregunta();
  }

  async siguientePregunta() {
    this.limpiarTemporizador();
    this.cargandoPregunta = true;
    this.preguntaActual = await this.preguntadosService.obtenerPregunta();
    this.cargandoPregunta = false;

    if (this.preguntaActual) {
      this.categoriaActual = this.preguntaActual.categoria;
      this.estadoJuego = 'PREGUNTA';
      this.tiempoRestante = 35; 
      this.iniciarTemporizador();
    } else {
      this.finalizarJuego('Error de comunicación con el servidor de trivia.');
    }
  }

  iniciarTemporizador() {
    this.intervaloTiempo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finalizarJuego('¡Tiempo agotado!');
      }
    }, 1000);
  }

  limpiarTemporizador() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  verificarRespuesta(opcionSeleccionada: string) {
    this.limpiarTemporizador();

    if (opcionSeleccionada === this.preguntaActual.correcta) {
      this.puntaje += 10;
      setTimeout(() => {
        this.siguientePregunta();
      }, 400);
    } else {
      this.finalizarJuego(`Respuesta incorrecta. Era: ${this.preguntaActual.correcta}`);
    }
  }

  async finalizarJuego(motivo: string) {
    this.limpiarTemporizador();
    this.puntajeAnterior = this.puntaje;
    this.estadoJuego = 'INICIO'; 
    console.log(`Partida finalizada: ${motivo}. Volviendo a la pantalla de inicio.`);
    if (this.puntaje > 0) {
      try {
        await this.rankingService.guardarPuntaje(this.usuarioActual, this.puntaje, 'preguntados');
        console.log('Registro de alta puntuación subido exitosamente a la tabla ranking.');
      } catch (err) {
        console.error('Error al impactar el ranking:', err);
      }
    }
  }
}