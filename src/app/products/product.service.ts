import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Acts as our url
  private productsUrl = 'api/productsss';
  // Inject our HttpErrorService
  private errorService = inject(HttpErrorService)
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('In http.get pipeline.')),
        // We replace the multiline error function with the handleError function and pass in error
        catchError(err => this.handleError(err))
      );
  }
  
  getProduct(id: number){
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log('In http.get by id pipeline'))
      )
  }

  // Create a private HandleError method
  private handleError(err: HttpErrorResponse): Observable<never>{  // We use never because we want an observable that doesn't emit anything and doesn't complete
    // We simple want this method to error out

    // Declare a variable for our formatted message, then call the errorService formatError method
    const formattedMessage = this.errorService.formatError(err);

    // Return throwError. ThrowError creates a replacement observable that when subscribe emits an error notification with the error message
    // We pass in a function that returns a formatted error message
    return throwError(() => formattedMessage);
  }
}
