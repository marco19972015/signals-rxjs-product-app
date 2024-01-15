import { Injectable, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  eLength = effect(() => console.log('Cart array length: ', this.cartItems().length));

  addToCart(product: Product): void{
    // Why do we make a cope of the array?
    // Adding, removing or updating an item directly in the array does not change the signal
    // To change the value in the signal, we update the signal with a new value
    // In this example, that new value is a new array 
    this.cartItems.update(items => [...items, { product, quantity: 1} ])
    //                              ^ we create a new array from the old array 
    //                                          ^and make any changes to that copy adding the new cart item
  }

}
