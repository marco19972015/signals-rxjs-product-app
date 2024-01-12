import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'api/products';
  private errorService = inject(HttpErrorService)
  private http = inject(HttpClient);
  // Private so the injected instance can only be used by this service
  private reviewService = inject(ReviewService)

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(() => console.log('In http.get pipeline.')),
        catchError(err => this.handleError(err))
      );
  }
  
  getProduct(id: number){
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log('In http.get by id pipeline')),
        // We want the map above catchError since it can generate an error
        map(product => this.getProductWithReviews(product)),  // Pass product to getProductWithReviews method, emits an observable (inner observable) 
        catchError(err => this.handleError(err))
      )
  }

  // Method to getProductWithReviews takes in a product (uses the product to retrieve the reviews)
  // This method emits an oberservable that emits the updated product with its reviews
  private getProductWithReviews(product: Product): Observable<Product>{
    // check if product has hasReviews property
    if (product.hasReviews){
      // If so, issue the http get request 
      // There may be multiple reviews, so we expect to get Review array
      // For the url we use reviewService.getReviewUrl and pass in the product id
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))  // returns an array of reviews
        //  We have an inner observable
        .pipe(
          // Create a copy of the passed in product using spread operator and append reviews to it
          // 'as' Product tells TS to treat the resulting object as an instance of the 'Product' type
          map(reviews => ({ ...product, reviews} as Product))
        )
    } else {
      // If false, then we don't need to get reviews, so return original product
      // Make sure to return the product as an observable, so we use 'of' operator
      return of(product);
    }
  }



  // Create a private HandleError method
  private handleError(err: HttpErrorResponse): Observable<never>{  // We use never because we want an observable that doesn't emit anything and doesn't complete
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
  }
}
