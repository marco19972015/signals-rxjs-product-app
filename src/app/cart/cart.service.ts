import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    .reduce((accQty, item) => accQty + item.quantity, 0)
  );

  subTotal = computed(() => this.cartItems().reduce((accTotal, item) => 
    accTotal + (item.quantity * item.product.price), 0));

  deliveryFee = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);

  tax = computed(() => Math.round(this.subTotal() * 10.75)/ 100);

  totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  eLength = effect(() => console.log('Cart array length: ', this.cartItems()));

  addToCart(product: Product): void{
    this.cartItems.update(items => [...items, { product, quantity: 1} ])
    //                              ^ we create a new array from the old array 
    //                                          ^and make any changes to that copy adding the new cart item
  }

  removeFromCart(cartItem: CartItem): void {
    // use signal method to make sure the signal is aware of the change
    this.cartItems.update(items => 
      // Using the JS array filter method to create a new array
      // The array filter method loops through each item in the original array
      // It copies the item to the new array if the item does not have a product id 
      // that matches the remove cartItem's product id. initialy the cartItem is empty so no id
      items.filter(item => item.product.id !== cartItem.product.id));
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    // We get the items from the cart
    this.cartItems.update(items => 
      // Use the map method to loop through the items in the cart
      // if the item.product.id matches the passed-in cartItem's product.id
      items.map(item => item.product.id === cartItem.product.id ? 
        // We change the item to a copy of the item with the updated quantity
        // If the ids don't match, we return the item unchanged
        {...item, quantity}: item));
        // The array map method creates a new array to store in the signal
        // It then loops through each items in the original array, adding it to the new array
        // As it loops through, if there is a change, we update the quantity
  }

}
