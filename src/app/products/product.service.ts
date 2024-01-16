import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, concatMap, filter, map, of, shareReplay, switchMap, tap, throwError, toArray } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { Result } from '../utilities/Result';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'api/products';
  private errorService = inject(HttpErrorService)
  private http = inject(HttpClient);
  private reviewService = inject(ReviewService)



  // To hold the ID of the user selected product
  // Undefined since initially the user hasn't had a change to choose a product
  selectedProductId = signal<number | undefined>(undefined);

  // Retrieve product data, making it private and accessible only within the service
  private productsResult$ =  this.http.get<Product[]>(this.productsUrl).pipe(  // This is the observable
    // The retrieved array of items is emitted into this operator
    // In the map operator I create a Result opbject
    map(p => ({ data: p}) as Result<Product[]>),
    tap(p => console.log(JSON.stringify(p))),
    shareReplay(1),
    // Use the of creation function to create an observable, catchError wants an observable
    catchError(err => of({ 
      data: [],
      // We can format the error using the formatError method
      error: this.errorService.formatError(err)
    } as Result<Product[]>))
    );

  // Create a signal from the observable
  // We add private so other components can't access this signal
  private productsResult = toSignal(this.productsResult$,  // A signal that contains a product array
    // Initial value needs to match the observable type, which is result of product array
    { initialValue: ({ data: []} as Result<Product[]>) });
  // Now our components can use these two signals to get the data and check for any error messages
  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);
 

  // This code now reacts to an emission whenever the selectedProductId changes
  private productResult$ = toObservable(this.selectedProductId).pipe(
    filter(Boolean),
    switchMap(id => {
      const productUrl = this.productsUrl + '/' + id;
      // It then issues the HTTP request to get the product 
      return this.http.get<Product>(productUrl).pipe(
        // And the product reviews
        switchMap(product => this.getProductWithReviews(product)),
        catchError(err => of({
          data: undefined, 
          err: this.errorService.formatError
        } as Result<Product>))
      )
    }),
    // We place the map method here because we first want to get the product along with the reviews
    map(p => ({data: p} as Result<Product>))
  ) 

  private productResult = toSignal(this.productResult$);
  // We use the ? in both of computed signals, ? defines optional chaining. 
  // It prevents null or undefined errors.
  // The code only dots into the property if the object isn't null or undefined. 
  // It's needed because the inital value of our productResult signal defaults to undefined
  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);
  
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
    this.selectedProductId.set(selectedProductId);
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
