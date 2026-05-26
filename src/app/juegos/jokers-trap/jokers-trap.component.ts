import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Carta {
  id: number;
  numero: string; 
  palo: string;   
  color: string;
  seleccionada?: boolean;
}

@Component({
  selector: 'app-jokers-trap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jokers-trap.component.html',
  styleUrl: './jokers-trap.component.css'
})
export class JokersTrapComponent implements OnInit {
  mazo: Carta[] = [];
  manoJugador: Carta[] = [];
  manoIA: Carta[] = [];
  pozoDescarte: Carta[] = [];
  
  esTurnoJugador: boolean = true;
  yaRoboDeIA: boolean = false;       // Controla si ya le sacaste la carta al bot
  tieneParDisponible: boolean = false; // Flag para saber si el jugador puede zafar sin ir al mazo

  juegoTerminado: boolean = false;
  mensajeResultado: string = '';
  castigoActivo: string = '';
  mensajeError: string = '';

  jugadorBloqueado: boolean = false;
  iaBloqueada: boolean = false;
  revelarManoJugador: boolean = false;
  revelarManoIA: boolean = false;

  ngOnInit() {
    this.iniciarNuevaPartida();
  }

  iniciarNuevaPartida() {
    this.mazo = [];
    this.manoJugador = [];
    this.manoIA = [];
    this.pozoDescarte = [];
    this.juegoTerminado = false;
    this.esTurnoJugador = Math.random() > 0.5;
    this.yaRoboDeIA = false;
    this.tieneParDisponible = false;
    this.mensajeResultado = '';
    this.castigoActivo = '';
    this.mensajeError = '';
    this.jugadorBloqueado = false;
    this.iaBloqueada = false;
    this.revelarManoJugador = false;
    this.revelarManoIA = false;

    this.crearMazo();
    this.repartirCartas();

    if (!this.esTurnoJugador) {
      setTimeout(() => this.turnoDeLaIA(), 1200);
    }
  }

  private crearMazo() {
    const numeros = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const palos = [
      { signo: "♥", color: "rojo" },
      { signo: "♦", color: "rojo" },
      { signo: "♣", color: "negro" },
      { signo: "♠", color: "negro" }
    ];

    let id = 1;
    for (let num of numeros) {
      for (let palo of palos) {
        this.mazo.push({ id: id++, numero: num, palo: palo.signo, color: palo.color, seleccionada: false });
      }
    }
    this.mazo.push({ id: id, numero: "Joker", palo: "👾", color: "virus", seleccionada: false });
    this.mazo.sort(() => Math.random() - 0.5);
  }

  private repartirCartas() {
    for (let i = 0; i < 8; i++) {
      this.manoJugador.push(this.mazo.pop()!);
      this.manoIA.push(this.mazo.pop()!);
    }
  }

  mostrarErrorTemporal(msg: string) {
    this.mensajeError = msg;
    setTimeout(() => this.mensajeError = '', 3000);
  }

  seleccionarCartaJugador(carta: Carta) {
    if (this.juegoTerminado || !this.esTurnoJugador || !this.yaRoboDeIA || this.jugadorBloqueado) return;
    if (carta.numero === "Joker") {
      this.mostrarErrorTemporal("❌ El Joker no se puede usar para armar parejas.");
      return;
    }
    carta.seleccionada = !carta.seleccionada;
  }

  // PASO 1: Robarle al Bot obligatoriamente
  robarCartaA_IA(indexIA: number) {
    if (!this.esTurnoJugador || this.yaRoboDeIA || this.juegoTerminado || this.jugadorBloqueado) return;
    this.castigoActivo = '';

    const cartaRobada = this.manoIA.splice(indexIA, 1)[0];
    cartaRobada.seleccionada = false;
    this.manoJugador.push(cartaRobada);
    
    this.yaRoboDeIA = true; 

    if (cartaRobada.numero === "Joker") {
      this.aplicarCastigo("Jugador");
    }

    // Escaneamos automáticamente si al jugador le quedó algún par formado en la mano
    this.verificarSiTienePares();
    this.comprobarGanador();
  }

  // Verifica de forma interna si el usuario tiene algún par disponible para tirar
  private verificarSiTienePares() {
    const conteo: { [key: string]: number } = {};
    this.manoJugador.forEach(c => {
      if (c.numero !== "Joker") {
        conteo[c.numero] = (conteo[c.numero] || 0) + 1;
      }
    });
    // Si hay algún número repetido 2 o más veces, se habilita el botón de par
    this.tieneParDisponible = Object.values(conteo).some(cant => cant >= 2);
  }

  // PASO 2 (Opción A): Destruir par (Si tiene) y pasa el turno limpio
  tirarParejaAlPozo() {
    if (!this.esTurnoJugador || !this.yaRoboDeIA) return;

    const seleccionadas = this.manoJugador.filter(c => c.seleccionada);

    if (seleccionadas.length !== 2) {
      this.mostrarErrorTemporal("⚠️ Seleccioná las 2 cartas iguales para eliminarlas.");
      return;
    }

    const c1 = seleccionadas[0];
    const c2 = seleccionadas[1];

    if (c1.numero === c2.numero) {
      this.manoJugador = this.manoJugador.filter(c => !c.seleccionada);
      this.pozoDescarte.push(c1, c2);
      this.castigoActivo = "✨ ¡Pareja purgada con éxito!";
      
      if (this.comprobarGanador()) return;
      this.finalizarTurnoJugador();
    } else {
      this.mostrarErrorTemporal("❌ Los números no coinciden.");
      this.manoJugador.forEach(c => c.seleccionada = false);
    }
  }

  // PASO 2 (Opción B): No tenés par, robás del mazo obligatoriamente y pasás
  robarMazoYPasar() {
    if (!this.esTurnoJugador || !this.yaRoboDeIA || this.tieneParDisponible) return;

    if (this.mazo.length === 0) {
      this.mazo = [...this.pozoDescarte].sort(() => Math.random() - 0.5);
      this.pozoDescarte = [];
    }

    const cartaMazo = this.mazo.pop()!;
    this.manoJugador.push(cartaMazo);

    this.castigoActivo = "📥 Robaste del mazo de red. Pasando control...";

    if (cartaMazo.numero === "Joker") {
      this.aplicarCastigo("Jugador");
    }

    if (this.comprobarGanador()) return;
    this.finalizarTurnoJugador();
  }

  private finalizarTurnoJugador() {
    this.esTurnoJugador = false;
    this.yaRoboDeIA = false;
    this.tieneParDisponible = false;
    this.manoJugador.forEach(c => c.seleccionada = false);
    setTimeout(() => this.turnoDeLaIA(), 1500);
  }

  // LÓGICA DEL BOT SIMÉTRICA
  turnoDeLaIA() {
    if (this.juegoTerminado) return;

    if (this.iaBloqueada) {
      this.iaBloqueada = false;
      this.esTurnoJugador = true;
      return;
    }

    // 1. El bot te roba a vos
    const indexJugador = Math.floor(Math.random() * this.manoJugador.length);
    const cartaRobada = this.manoJugador.splice(indexJugador, 1)[0];
    this.manoIA.push(cartaRobada);

    if (cartaRobada.numero === "Joker") this.aplicarCastigo("IA");
    if (this.comprobarGanador()) return;

    // 2. Busca par para descartar
    let parEncontrado = false;
    this.manoIA.sort((a, b) => a.numero.localeCompare(b.numero));
    for (let i = 0; i < this.manoIA.length - 1; i++) {
      if (this.manoIA[i].numero === this.manoIA[i+1].numero && this.manoIA[i].numero !== "Joker") {
        const removidas = this.manoIA.splice(i, 2);
        this.pozoDescarte.push(removidas[0], removidas[1]);
        this.castigoActivo = "🎩 El Sombrerero purgó un par.";
        parEncontrado = true;
        break;
      }
    }

    // 3. Si el bot NO encontró par, saca del mazo central automáticamente y pasa
    if (!parEncontrado && this.mazo.length > 0) {
      const cartaMazo = this.mazo.pop()!;
      this.manoIA.push(cartaMazo);
      if (cartaMazo.numero === "Joker") this.aplicarCastigo("IA");
    }

    if (this.jugadorBloqueado) this.jugadorBloqueado = false;

    if (this.comprobarGanador()) return;
    
    this.esTurnoJugador = true;
    this.yaRoboDeIA = false;
    this.tieneParDisponible = false;
  }

  private aplicarCastigo(afectado: "Jugador" | "IA") {
    const opciones = [1, 2, 3];
    const castigoElegido = opciones[Math.floor(Math.random() * opciones.length)];
    const nombreAfectado = afectado === "Jugador" ? "Tu terminal" : "El Sombrerero";

    if (castigoElegido === 1) {
      this.castigoActivo = `🚨 MALDICIÓN JOKER: ${nombreAfectado} recibió +2 cartas de sobrecarga.`;
      const mano = afectado === "Jugador" ? this.manoJugador : this.manoIA;
      if (this.mazo.length >= 2) {
        mano.push(this.mazo.pop()!);
        mano.push(this.mazo.pop()!);
      }
    } 
    else if (castigoElegido === 2) {
      this.castigoActivo = `🚨 MALDICIÓN JOKER: ${nombreAfectado} sufrió PANTALLAZO AZUL (Salta 1 turno).`;
      if (afectado === "Jugador") {
        this.jugadorBloqueado = true;
        setTimeout(() => this.finalizarTurnoJugador(), 2000);
      } else {
        this.iaBloqueada = true;
      }
    } 
    else if (castigoElegido === 3) {
      this.castigoActivo = `🚨 MALDICIÓN JOKER: FIREWALL INVERTIDO. Datos expuestos por 10 segundos.`;
      if (afectado === "Jugador") {
        this.revelarManoJugador = true;
        setTimeout(() => this.revelarManoJugador = false, 10000);
      } else {
        this.revelarManoIA = true;
        setTimeout(() => this.revelarManoIA = false, 10000);
      }
    }
  }

  comprobarGanador(): boolean {
    const tieneJokerJugador = this.manoJugador.some(c => c.numero === "Joker");
    if (this.manoJugador.length === 0 && !tieneJokerJugador) {
      this.juegoTerminado = true;
      this.mensajeResultado = "🏆 INTERFAZ SANEADA. ¡Ganaste la partida!";
      return true;
    }

    const tieneJokerIA = this.manoIA.some(c => c.numero === "Joker");
    if (this.manoIA.length === 0 && !tieneJokerIA) {
      this.juegoTerminado = true;
      this.mensajeResultado = "💀 SERVER OVERRIDE. El Sombrerero ganó.";
      return true;
    }
    return false;
  }
}