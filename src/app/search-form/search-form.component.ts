import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CitiesService } from '../cities.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

export enum SortType {
  None = '',
  ZipCode = 'zipCode',
  Name = 'name'
}

export enum OrderType {
  None = '',
  ASC = 'ASC',
  DESC = 'DESC'
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {
  limit: string = '';
  start: string = '';
  sort: SortType = SortType.None;
  order: OrderType = OrderType.None;
  name_like: string = '';
  zipCode_like: string = '';
  SortType = SortType;
  OrderType = OrderType;
  cities: any[] = [];
  pagedCities: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  hasSearched: boolean = false;

  constructor(private citiesService: CitiesService) {}

  ngOnInit(): void {
  }

  getCities(): void {
    this.hasSearched = true;
    this.errorMessage = '';
    const params = {
      _limit: this.limit === '' ? 10 : Number(this.limit),
      _start: this.start === '' ? 0 : Number(this.start),
      _sort: this.sort,
      _order: this.order,
      name_like: this.name_like,
      zipCode_like: this.zipCode_like
    };
    this.citiesService.getCities(params).subscribe({
      next: (data) => {
        this.cities = Array.isArray(data) ? data : [];
        this.updatePagedCities();
      },
      error: (err) => {
        this.cities = [];
        this.pagedCities = [];
        this.errorMessage = 'Erreur lors de la récupération des villes.';
      }
    });
  }

  updatePagedCities(): void {
    this.pageSize = this.limit === '' ? 10 : Number(this.limit);
    this.totalPages = Math.max(1, Math.ceil(this.cities.length / this.pageSize));
    const startIdx = 0;
    const endIdx = this.pageSize;
    this.pagedCities = this.cities.slice(startIdx, endIdx);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getCities();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getCities();
    }
  }
}
