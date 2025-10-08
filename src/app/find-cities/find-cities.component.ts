import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CitiesService } from '../cities.service';

@Component({
  selector: 'app-find-cities',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './find-cities.component.html',
  styleUrls: ['./find-cities.component.scss']
})
export class FindCitiesComponent implements OnInit {
  nearestCities: any[] = [];

  constructor(private citiesService: CitiesService) {}

  ngOnInit(): void {
    this.getNearestCities();
  }

  getNearestCities(): void {
    this.citiesService.getNearestCities().subscribe((data) => {
      this.nearestCities = data;
    });
  }
}
