import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent implements OnInit, OnDestroy {

  // Lógica de cartas y juego
  cartaActual: any = { numero: 0, palo: '', color: '' };
  cartaSiguiente: any = { numero: 0, palo: '', color: '' };
  puntos: number = 0;
  vidas: number = 3; 
  tiempo: number = 60;
  reloj: any;

  palos: string[] = ['♥', '♦', '♣', '♠'];

  // Control de pantallas e interfaces
  pantallaInicio: boolean = true;
  huboError: boolean = false;
  mensajeError: string = '';
  efectoFallo: boolean = false; 

  ngOnInit() {}

  ngOnDestroy() {
    this.pararReloj();
  }

  iniciarJuego() {
    this.pantallaInicio = false;
    this.huboError = false;
    this.efectoFallo = false;
    this.puntos = 0;
    this.vidas = 3; 
    this.tiempo = 40; 
    
    this.cartaActual = this.generarCartaAzar();
    
    this.pararReloj();
    this.correrReloj();
  }

  correrReloj() {
    this.reloj = setInterval(() => {
      this.tiempo--;
      if (this.tiempo <= 0) {
        this.finalizarJuego('¡Te quedaste sin tiempo!');
      }
    }, 1000);
  }

  pararReloj() {
    if (this.reloj) clearInterval(this.reloj);
  }

  generarCartaAzar() {
    const numero = Math.floor(Math.random() * 12) + 1;
    const palo = this.palos[Math.floor(Math.random() * this.palos.length)];
    const color = (palo === '♥' || palo === '♦') ? 'red' : 'black';
    return { numero, palo, color };
  }

  apostarMayor() {
    this.evaluarApuesta(true);
  }

  apostarMenor() {
    this.evaluarApuesta(false);
  }

  evaluarApuesta(esMayor: boolean) {
    if (this.huboError) return;

    let nueva = this.generarCartaAzar();
    while (nueva.numero === this.cartaActual.numero) {
      nueva = this.generarCartaAzar();
    }
    this.cartaSiguiente = nueva;

    const ganoAcertijo = esMayor 
      ? this.cartaSiguiente.numero >= this.cartaActual.numero 
      : this.cartaSiguiente.numero <= this.cartaActual.numero;

    if (ganoAcertijo) {
      this.puntos += 10;
      this.avanzarRonda();
    } else {
      this.vidas--; 
      if (this.vidas <= 0) {
        this.finalizarJuego('¡Te quedaste sin intentos!');
      } else {
        this.efectoFallo = true;
        setTimeout(() => this.efectoFallo = false, 800);
        this.avanzarRonda();
      }
    }
  }

  avanzarRonda() {
    if (this.cartaSiguiente.numero !== 0) {
      this.cartaActual = { ...this.cartaSiguiente };
    }
  }

  finalizarJuego(mensaje: string) {
    this.pararReloj();
    this.huboError = true;
    this.mensajeError = mensaje; 
  }

  volverAlInicio() {
    this.pantallaInicio = true;
    this.huboError = false;
    this.puntos = 0;
    this.cartaSiguiente = { numero: 0, palo: '', color: '' };
  }
}