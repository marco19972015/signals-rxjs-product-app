import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  // Just enough here for the code to compile
  private reviewsUrl = 'api/reviews';

  // Building the get url endpoint
  getReviewUrl(productId: number): string {
    // Below we use the base URL, appends a query parameter. We use caret and dollar regular expression anchor to 
    // get an exact match on the product id
    return this.reviewsUrl + '?productId=^' + productId + '$';
  }
}
