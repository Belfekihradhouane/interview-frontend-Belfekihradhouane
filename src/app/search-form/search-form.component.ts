import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CitiesService } from '../cities.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

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
  pageSize: number = 10; // Pagination toujours par 10
  totalPages: number = 1;
  errorMessage: string = '';
  hasSearched: boolean = false;

  constructor(private citiesService: CitiesService, private router: Router) {}

  ngOnInit(): void {
  }

  getCities(): void {

    this.errorMessage = '';
    this.currentPage = 1; // Reset page on new search
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
        this.hasSearched = true;
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
    this.totalPages = Math.max(1, Math.ceil(this.cities.length / this.pageSize));
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    this.pagedCities = this.cities.slice(startIdx, endIdx);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedCities();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedCities();
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, -1, this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push(1, -1);
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, -1, this.currentPage - 1, this.currentPage, this.currentPage + 1, -1, this.totalPages);
      }
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagedCities();
    }
  }

  goToFirst(): void {
    this.goToPage(1);
  }

  goToLast(): void {
    this.goToPage(this.totalPages);
  }

  goToCityDetail(city: any): void {
    this.router.navigate(['/find-cities'], {
      queryParams: {
        name: city.name,
        zipCode: city.zipCode,
        x: city.coordinates.x,
        y: city.coordinates.y
      }
    });
  }
}
