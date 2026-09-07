import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UiInputDirective } from '../../../directives/uiInputDirective';
import { AuthService } from '../../../services/auth.service';

type InputState = 'default' | 'valid' | 'invalid';

@Component({
	selector: 'app-login',
	imports: [UiInputDirective],
	templateUrl: './login.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Login {
    private router = inject(Router);
	private authService = inject(AuthService);

    loginFeedback = signal<InputState>('default');

    email = signal('');
    password = signal('');

    get canSubmit(): boolean {
        return this.email().trim() !== '' && this.password().trim() !== '';
    }

    submit() {
        if (!this.canSubmit) {
            return;
        }

        this.loginFeedback.set('default');

        this.authService.login(this.email(), this.password()).subscribe({
            next: () => {
                this.router.navigate(['/admin/dashboard']);
            },
            error: error => {
                this.loginFeedback.set('invalid');
                console.error('Login failed:', error);
            }
        });
    }
}
