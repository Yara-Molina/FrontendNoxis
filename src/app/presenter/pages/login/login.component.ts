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
        // Si el email contiene "@admin", redirige a homeAdmin
        if (this.email.includes('@admin')) {
          this.router.navigate(['/admin-dashboard']);
        }else{
          this.router.navigate(['/dashboard']);

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
