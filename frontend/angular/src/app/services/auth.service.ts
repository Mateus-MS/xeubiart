import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class AuthService {
    private http = inject(HttpClient);

    login(email: string, password: string) {
        return this.http.post(
            '/api/auth/login',
            { email, password },
            { withCredentials: true }
        );
    }

    logout() {
        return this.http.post(
            '/api/auth/logout',
            {},
            { withCredentials: true }
        );
    }
}
