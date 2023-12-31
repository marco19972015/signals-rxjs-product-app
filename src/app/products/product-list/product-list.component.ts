import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Notice that we already have a declared variable for displaying any error message.
  // Further down, we have an ngOnInit, where we want to catch the error emitted from the replacement observable.

  // There are two ways we can do this, with the observer or in the pipeline
  // We can use the observer error callback function within our subscribe. 

  pageTitle = 'Products';
  errorMessage = '';

  // We use this property to unsubscribe from our observable (keeps best practice)
  sub!: Subscription;

  // Inject our ProductService in order to get the product so we can show it in our template
  private productService = inject(ProductService);

  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  ngOnInit(){
    this.sub = this.productService.getProducts()
    .pipe(
      tap(() => console.log('In component pipeline'))
    )
    // The subscribe only takes in one argument, so we add a curly braces to define an observer object 
    .subscribe({
      next: products => {  // We set the next property to our next function
        this.products = products;
        console.log(this.products);
      },
      // For the erro callback, we set the errorMessage local variable to the error message emitted by the service 
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
