import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CitiesService } from '../cities.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-find-cities',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './find-cities.component.html',
  styleUrls: ['./find-cities.component.scss']
})
export class FindCitiesComponent implements OnInit {
  nearestCity: any = null;
  selectedCity: any = null;
  isLoadingNearest = false;
  errorMessage = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const { name, zipCode, x, y } = params;

      // Petit log pour vérifier que la navigation envoie bien les params
      console.log('[FindCities] params:', params);

      if (name && zipCode && x && y) {
        this.selectedCity = {
          name,
          zipCode,
          coordinates: { x, y }
        };
        this.getNearestCity(x, y);
      } else {
        this.selectedCity = null;
        this.nearestCity = null;
      }
    });
  }

  constructor(private citiesService: CitiesService, private route: ActivatedRoute) {}

  getNearestCity(x: string, y: string): void {
    this.isLoadingNearest = true;
    this.errorMessage = '';

    // Si le backend attend des nombres, décommente ces 2 lignes :
    // const xNum = Number(x), yNum = Number(y);
    // const params = { x: xNum, y: yNum };

    const params = { x, y }; // sinon string OK

    this.citiesService.getNearestCities(params).subscribe({
      next: (data) => {
        this.nearestCity = Array.isArray(data) ? data[0] : data;
        this.isLoadingNearest = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement de la ville la plus proche.';
        this.isLoadingNearest = false;
      }
    });
  }
}
