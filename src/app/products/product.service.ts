import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, concatMap, filter, map, of, shareReplay, switchMap, tap, throwError, toArray } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { toSignal } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'api/productss';
  private errorService = inject(HttpErrorService)
  private http = inject(HttpClient);
  private reviewService = inject(ReviewService)

  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();

  // Retrieve product data, making it private and accessible only within the service
  private products$ =  this.http.get<Product[]>(this.productsUrl).pipe(
    tap(p => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError(err => this.handleError(err))
    );

    // A signal that contains a product array
    // Create a signal from the observable
  // products = toSignal(this.products$, { initialValue: [] as Product[]});
  products = computed(() => {
    try {
      return toSignal(this.products$, { initialValue: [] as Product[]})();
    } catch (error) {
      // If we catch an error, return an empty array of products
      return [] as Product[];
    }
  })

  readonly product$ = this.productSelected$.pipe(
    filter(Boolean),
    switchMap(id => {
      const productUrl = this.productsUrl + '/' + id;
      return this.http.get<Product>(productUrl).pipe(
        switchMap(product => this.getProductWithReviews(product)),
        catchError(err => this.handleError(err))
      )
    })
  ) 
  
  // // combineLatest does not emit until both observables have emitted at least once
  // // We used combineLatest to combine our
  // product$ = combineLatest([
  //   // productSelected$ observable, which emits every time the user selects a different product
  //   this.productSelected$,
  //   // and our products$ observable, which emits when the array of products is retrieved 
  //   this.products$
  // ]).pipe(
  //   map(([selectedProductId, products]) => 
  //     products.find(product => product.id === selectedProductId)
  //   ),
  //   // In the case we get undef-ined, we filter by Boolean since the product property might give us issues otherwise.
  //   filter(Boolean),
  //   switchMap(product => this.getProductWithReviews(product)),
  //   catchError(err => this.handleError(err))
  // )
  
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
