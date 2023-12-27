// This file sets up the in-memory database, so to speak, with our data
import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ProductData } from './products/product-data';
import { ReviewData } from './reviews/review-data';
import { Product } from './products/product';
import { Review } from './reviews/review';

export class AppData implements InMemoryDbService {
  // Here we define product and product review data
  createDb(): { products: Product[], reviews: Review[]} {
    const products = ProductData.products;
    const reviews = ReviewData.reviews;
    return { products, reviews };
  }
}
 