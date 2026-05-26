import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  email = '';
  password = '';
  nombre = '';
  apellido = '';
  edad: number | null = null;
  // edad = null;
  
  mensajeError: string = ''; 
  esExito: boolean = false;  

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister() {
    this.mensajeError = ''; 
    this.esExito = false;

    if(
      !this.nombre ||
      !this.apellido ||
      !this.email ||
      !this.password ||
      !this.edad === null
    ){
      this.mensajeError = 'Completa todos los campos';
      return;
    };
    
    if(this.edad === null){
      this.mensajeError = "Datos invalidos";
      return;
    }

   if(this.edad < 0 || this.edad > 80){

  this.mensajeError =
  'Ingrese una edad válida';

  return;
}

    const { data, error } = await this.auth.signUp(this.email, this.password, {
      nombre: this.nombre,
      apellido: this.apellido,
      edad: this.edad
    });

    if (error) {
      this.esExito = false;
      this.mensajeError = "Error: " + error.message;
    } else {
    
      this.esExito = true;
      this.mensajeError = "¡Cuenta creada! Por favor, confirmá tu email para jugar.";
      
    
      this.email = '';
      this.password = '';
      this.nombre = '';
      this.apellido = '';
      this.edad = null;
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 4000);

    }
  }

  
}