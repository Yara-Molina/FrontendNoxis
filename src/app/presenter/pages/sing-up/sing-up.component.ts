import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sing-up',
  standalone: true,
  imports: [FormsModule],
  providers: [],
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.scss'],
})
export class SingUpComponent {
  
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  tipoUsuario: string = '';

  constructor(private userService: UserService, private router: Router) {}

  

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Método para registrar usuario
  register() {
    if (this.password !== this.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const userData = {
      name: 'Nombre Temporal',
      email: this.email,
      password: this.password,
      tipo_usuario: this.tipoUsuario,
      perfil_id: null 
    };

    this.userService.register(userData).subscribe(
      (response) => {
        console.log('Usuario registrado exitosamente:', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error en el registro:', error);
      }
    );
  }
}
