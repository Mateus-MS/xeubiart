import { Component, Type } from '@angular/core';
import { Gallery } from './panels/gallery/gallery';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [NgComponentOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  selectedCategory: string = 'geral';
  
  categories = new Map<string, dashboard_panel[]>([
    ['geral', [
      { 
        title: 'Galeria', panel: Gallery
      }
    ]],
  ]);

  get getSelectedPanel(): Type<any> | undefined {
    return this.categories.get(this.selectedCategory)?.[0]?.panel;
  }
}

interface dashboard_panel{
  title: string;
  panel: Type<any> | undefined;
}