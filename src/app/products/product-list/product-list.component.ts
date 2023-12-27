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
  // For the ProductListComponent, we want to load the products when the component is initialized
  // and we want to unsubscribe from the product observable when the component is destroyed
  
  pageTitle = 'Products';
  errorMessage = '';

  // We use this property to unsubscribe from our observable (keeps best practice)
  sub!: Subscription;

  // Inject our ProductService in order to get the product so we can show it in our template
  private productService = inject(ProductService);

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  ngOnInit(){
    this.sub = this.productService.getProducts()
    .pipe(
      tap(() => console.log('In component pipeline'))
    )
    // In order to react to the emissions when the observable emits our product array we need to 
    // add an observer inside the subscribe method
    .subscribe(products => {
      this.products = products;
      console.log(this.products);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
