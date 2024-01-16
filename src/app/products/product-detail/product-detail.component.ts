import { Component, computed, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, catchError, tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent{

  // Inject an instance of our ProductService 
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Product to display
  product = this.productService.product;
  errorMessage = this.productService.productError;

  // Set the page title
  // pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = computed(() =>
    this.product()
      // We use ? because it could be null or undefined, if not used we will get an error
      ? `Product Detail for: ${this.product()?.productName}`
      : `Product Detail`)

  addToCart(product: Product ) {
    this.cartService.addToCart(product)
  }
}
