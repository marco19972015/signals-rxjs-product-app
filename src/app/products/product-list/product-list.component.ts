import { Component, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
    imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  pageTitle = 'Products';
  

  private productService = inject(ProductService);

  // Products
  products = this.productService.products;
  errorMessage = this.productService.productError;

  // reference the references the observable from the service
  // it's good practice to bind from a template to component, not from a template to a service
  // readonly to ensure we don't overwright the variable
  selectedProductId  = this.productService.selectedProductId

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}
