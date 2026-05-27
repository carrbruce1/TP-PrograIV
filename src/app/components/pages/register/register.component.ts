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
  
  mensajeError: string = ''; 
  esExito: boolean = false;  

  constructor(private auth: AuthService, private router: Router) {}

  async onRegister() {
    this.mensajeError = ''; 
    this.esExito = false;


    if(!this.nombre || !this.apellido || !this.email || !this.password || this.edad == null){
      this.mensajeError = 'Completa todos los campos';
      return;
    }
    
    if(this.edad < 0 || this.edad > 99){
      this.mensajeError = 'Ingrese una edad válida';
      return;
    }

    try {
      const metadata = { nombre: this.nombre, apellido: this.apellido, edad: this.edad };
      const { data, error } = await this.auth.signUp(this.email, this.password, metadata);

      if (error) {
        if (error.message.includes('User already registered')) {
          this.mensajeError = 'Ese email ya está registrado. Por favor, usá otro.';
        } else if (error.message.includes('Password should be')) {
          this.mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
          this.mensajeError = 'Error: ' + error.message;
        }
      } else if (data.user) {
        
        const { error: dbError } = await this.auth.guardarUsuarioEnTabla(data.user.id, this.email, metadata);

        if (dbError) {
          this.mensajeError = "Usuario creado, pero hubo un error al guardar sus datos personales.";
          console.error("Error BD:", dbError);
        } else {
          // ÉXITO
          await this.auth.signOut();
          this.esExito = true;
          this.mensajeError = "¡Cuenta creada! Por favor, confirmá tu email. Redirigiendo al Home...";
          
          // Limpieza
          this.email = '';
          this.password = '';
          this.nombre = '';
          this.apellido = '';
          this.edad = null;
          
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 4000);
        }
      }
    } catch (err) {
      this.mensajeError = "Ocurrió un error inesperado.";
      console.error(err);
    }
  }
}