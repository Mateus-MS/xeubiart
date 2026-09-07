import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Type } from '@angular/core';
import { Gallery } from './panels/gallery/gallery';
import { NgComponentOutlet } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-dashboard',
	imports: [NgComponentOutlet],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Dashboard {
	private authService = inject(AuthService);

	selectedCategory: string = 'geral';
	
	categories = new Map<string, dashboard_panel[]>([
		['geral', [
			{ 
				icon: 'icon-picture',
				title: 'Galeria', 
				panel: Gallery
			}
		]],
	]);

	get getSelectedPanel(): Type<any> | undefined {
		return this.categories.get(this.selectedCategory)?.[0]?.panel;
	}

	logout() {
		this.authService.logout().subscribe({
			next: () => {
				window.location.href = '/admin/login';
			},
			error: error => {
				console.error('Logout failed:', error);
			}
		});
	}
}

interface dashboard_panel{
	icon: string;
	title: string;
	panel: Type<any> | undefined;
}