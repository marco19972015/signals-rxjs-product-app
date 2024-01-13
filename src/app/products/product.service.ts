import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, concatMap, map, of, switchMap, tap, throwError } from 'rxjs';
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

  // We don't want any other code to modify this code so we add readonly
  readonly products$ =  this.http.get<Product[]>(this.productsUrl).pipe(
    tap(() => console.log('In http.get pipeline.')),
    catchError(err => this.handleError(err))
    );
  
  getProduct(id: number){
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        tap(() => console.log('In http.get by id pipeline')),
        // We want the map above catchError since it can generate an error
        switchMap(product => this.getProductWithReviews(product)),  // Pass product to getProductWithReviews method, emits an observable (inner observable) 
        catchError(err => this.handleError(err))
      )
  }

  private getProductWithReviews(product: Product): Observable<Product>{
    if (product.hasReviews){
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id)) 
        .pipe(
          map(reviews => ({ ...product, reviews} as Product))
        )
    } else {
      return of(product);
    }
  }



  // Create a private HandleError method
  private handleError(err: HttpErrorResponse): Observable<never>{  // We use never because we want an observable that doesn't emit anything and doesn't complete
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
  }
}
