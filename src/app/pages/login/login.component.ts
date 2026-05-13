import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para el *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Agregamos CommonModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email = '';
  password = '';
  
  // Variables para el feedback visual
  mensajeError: string = '';
  esExito: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin() {
    this.mensajeError = '';
    this.esExito = false;

    const { data, error } = await this.auth.signIn(this.email, this.password);
    
    if (error) {
      this.esExito = false;
      // Traducimos el error para que quede más pro
      if (error.message.includes('Invalid login credentials')) {
        this.mensajeError = "Email o contraseña incorrectos.";
      } else if (error.message.includes('Email not confirmed')) {
        this.mensajeError = "Debes confirmar tu email para ingresar.";
      } else {
        this.mensajeError = "Error: " + error.message;
      }
    } else {
      this.esExito = true;
      this.mensajeError = "¡Ingreso exitoso! Entrando a la sala...";
      
      // Esperamos un segundo para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1200);
    }
  }

  fastLogin() {
    this.email = 'admin1@royalbet.com';
    this.password = 'admin1234';
    this.mensajeError = ''; // Limpiamos si había algún error previo
  }
}