import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule],
  standalone: true,
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Inicio de sesión exitoso:', response);
        // Dependiendo del rol del usuario (tipo_usuario), redirigir a la página correspondiente
        switch (response.tipo_usuario) {
          case 'Cliente':
          case 'Admin':
            this.router.navigate(['/homeAdmin']);
            break;
          default:
            console.error('Rol de usuario desconocido');
        }
      },
      (error) => {
        console.error('Error durante el login:', error);
      }
    );
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}
