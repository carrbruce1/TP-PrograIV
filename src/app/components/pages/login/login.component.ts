import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email = '';
  password = '';
  mensajeError: string = '';
  esExito: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin() {
    this.mensajeError = '';
    this.esExito = false;

    const { data, error } = await this.auth.signIn(this.email, this.password);
    
    if (error) {
      this.esExito = false;
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
      
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1200);
    }
  }

  fastLogin() {
    this.email = 'ricardo@hotmail.com';
    this.password = 'ricardo1234';
    this.mensajeError = '';
  }

  fastlogin2(){
    this.email = 'manuel@hotmail.com';
    this.password = 'manuel1234';
    this.mensajeError = '';

  }

  fastlogin3(){
    this.email = 'jazmin@hotmail.com';
    this.password = 'jazmin1234';
    this.mensajeError = '';

  }
}