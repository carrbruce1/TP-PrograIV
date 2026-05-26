import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnInit, OnDestroy {
  
  palabras: string[] = ['SISTEMA', 'KERNEL', 'PROTOCOLO', 'FIREWALL', 'ENCRIPTAR', 'BINARIO', 'CONSOLA'];
  palabraSecreta: string = '';
  guiones: string = '';
  
  // Control de pantallas
  pantallaInicio: boolean = true;
  juegoTerminado: boolean = false;
  huboError: boolean = false; 
  mensajeError: string = '';
  
  puntos: number = 0;
  vidas: number = 6;
  tiempo: number = 40;
  letrasUsadas: string[] = [];
  
  reloj: any;
  abc: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  ngOnInit() {}

  ngOnDestroy() {
    this.pararReloj();
  }

  volverAlInicio() {
    this.pantallaInicio = true;
    this.juegoTerminado = false;
    this.huboError = false;
    this.mensajeError = '';
    this.puntos = 0;
    this.pararReloj();
  }

  iniciarJuego() {
    this.pantallaInicio = false;
    this.huboError = false;
    this.puntos = 0;
    this.nuevaPalabra();
  }

  nuevaPalabra() {
    let azar = Math.floor(Math.random() * this.palabras.length);
    this.palabraSecreta = this.palabras[azar];
    
    this.letrasUsadas = [];
    this.vidas = 6;
    this.tiempo = 40;
    this.juegoTerminado = false;
    this.huboError = false;
    
    this.pararReloj();
    this.correrReloj();
    this.dibujarGuiones();
  }

  dibujarGuiones() {
    let temporal = '';
    for (let i = 0; i < this.palabraSecreta.length; i++) {
      if (this.letrasUsadas.includes(this.palabraSecreta[i])) {
        temporal += this.palabraSecreta[i] + ' ';
      } else {
        temporal += '_ ';
      }
    }
    this.guiones = temporal.trim();
  }

  correrReloj() {
    this.reloj = setInterval(() => {
      this.tiempo--;
      if (this.tiempo <= 0) {
        this.finalizarRonda('CRITICAL_TIMEOUT: TIEMPO DE RESPUESTA AGOTADO');
      }
    }, 1000);
  }

  pararReloj() {
    if (this.reloj) clearInterval(this.reloj);
  }

  presionarLetra(letra: string) {
    if (this.juegoTerminado || this.huboError || this.letrasUsadas.includes(letra)) return;

    this.letrasUsadas.push(letra);

    if (this.palabraSecreta.includes(letra)) {
      this.dibujarGuiones();
    } else {
      this.vidas--;
    }

    this.validarRonda();
  }

  validarRonda() {
    if (this.vidas <= 0) {
      this.finalizarRonda('CORE_RESET: DEMASIADOS INTENTOS FALLIDOS');
    }
    else if (!this.guiones.includes('_')) {
      this.pararReloj();
      this.puntos += 10;
      this.juegoTerminado = true;
    }
  }

  finalizarRonda(mensaje: string) {
    this.pararReloj();
    
    
    if (this.vidas <= 0 || this.tiempo <= 0) {
      this.huboError = true;
      this.mensajeError = mensaje;
    }
  }
}