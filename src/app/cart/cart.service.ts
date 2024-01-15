import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    // We call the JS reduce method to accumulate the total quantity of items.
    // The array reduce method loops through each item in the cart and accumulates a value,
    // as defined by a provided function. 
    // The reduce method parameters include the accumulated quantity and each item.
    // As the reduce method loops through each item, we add the current items quantity to the prior accumulated value.
    // we set 0 to the last argument to the reduce method to set the initial value for the accumulation to 0.
    .reduce((accQty, item) => accQty + item.quantity, 0)
  );

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
