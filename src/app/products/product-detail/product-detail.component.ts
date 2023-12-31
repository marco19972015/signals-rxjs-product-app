import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Subscription, tap } from 'rxjs';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy{
  
  // Remember that Input properties provide the OnChanges lifecycle hook
  @Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  product: Product | null = null;

  // Inject an instance of our ProductService 
  private productService = inject(ProductService);

  // Property to unsubscribe from the observable
  sub!: Subscription;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  // SimpleChanges is a hash table of changes
  ngOnChanges(changes: SimpleChanges): void {
    // currentValue is part of SimpleChanges
    const id = changes['productId'].currentValue;

    // if id has a value, call the getProduct method in our service
    if (id){
      // We call the getProduct method and pass in the id, 
      // We subscribe and set the emitted value to the product in the observer
      // this.sub = this.productService.getProduct(id).subscribe(
      //   product => this.product = product
      // )
      this.sub = this.productService.getProduct(id).pipe(
        tap(data => this.product = data)
      ).subscribe();
    }
  }

  // Since we are subscribing in the ngOnChanges and not ngOnInit it's possible
  // this component is destroyed without us subscibing to anything
  ngOnDestroy(): void {
    // If the component is subscribed then we unsubscribe
    if (this.sub){
      this.sub.unsubscribe();
    }
  }

  addToCart(product: Product) {
  }
}
