import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  
  // Declaring our prop as private so it's only accessible within this service uisng DepInjec
  private http = inject(HttpClient);

  // Currently this method does not do anything
  getProducts(): Observable<Product[]> {
    // We need to add the generic type parameter and specify the return as a Product array
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        // we ignore the value returned and log out that we are in the pipeline
        tap(() => console.log('In http.get pipeline.'))
      )
  }
}
