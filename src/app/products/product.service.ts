import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, concatMap, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
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
  private reviewService = inject(ReviewService)

  // We make the BehaviorSubject of generic type number and undefine. This allows us the pass the value 
  // of undefined. If the user hasn't selected anything, then the id will be undefined. 
  // Doing this allows us to avoid using 0, doing that would give it some special meaning.
  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  // readonly prevents us from accidently re-writing the property 
  readonly productSelected$ = this.productSelectedSubject.asObservable();

  // We don't want any other code to modify this code so we add readonly
  readonly products$ =  this.http.get<Product[]>(this.productsUrl).pipe(
    tap(p => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError(err => this.handleError(err))
    );
  
  getProduct(id: number){
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        // We want the map above catchError since it can generate an error
        switchMap(product => this.getProductWithReviews(product)),  // Pass product to getProductWithReviews method, emits an observable (inner observable) 
        catchError(err => this.handleError(err))
      )
  }

  // Everytime a user selects a product we'll use BehaviorSubject and emit a notification with the productId
  productSelected(selectedProductId: number): void{
    // Every time a user selects a product we emmit a next notification to any subscribers
    this.productSelectedSubject.next(selectedProductId);
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
