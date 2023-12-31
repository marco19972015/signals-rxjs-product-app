import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/productsss';
  
  // Declaring our prop as private so it's only accessible within this service uisng DepInjec
  private http = inject(HttpClient);

  // Currently this method does not do anything
  getProducts(): Observable<Product[]> {
    // We need to add the generic type parameter and specify the return as a Product array
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        // we ignore the value returned and log out that we are in the pipeline
        tap(() => console.log('In http.get pipeline.')),
        catchError(err => {
          console.error(err);
          // When the error happens return the list of hard coded items
          return of(ProductData.products)  // We need to make the hard coded items return as an observable
        })
      );
  }


  // Here we add code that returns one product by id
  getProduct(id: number){
    // Create a productUrl that gets a single item based of id
    const productUrl = this.productsUrl + '/' + id;
    // We return the singular product
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log('In http.get by id pipeline'))
      )
  }
}
