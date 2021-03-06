import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../login/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  @Input() state: any;
  @Output() updateStateOutputCallback: EventEmitter<any> = new EventEmitter<any>();
  controlsIngredients: any;
  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.controlsIngredients = Object.keys( this.state.ingredients )
      .map( ingredientName => ingredientName )
      .reduce((prev, current) => {
          return prev.concat(current)
      }, []);

  }

  addIngredient(type) {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = this.state.ingredientsPrice[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.state.totalPrice = newPrice;
    this.state.ingredients = updatedIngredients;
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredient ( type ) {
    const oldCount = this.state.ingredients[type];
    if ( oldCount <= 0 ) {
        return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
        ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = this.state.ingredientsPrice[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.state.totalPrice = newPrice;
    this.state.ingredients = updatedIngredients;
    this.updatePurchaseState(updatedIngredients);
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys( ingredients )
      .map( igKey => {
          return ingredients[igKey];
      } )
      .reduce( ( sum, el ) => {
          return sum + el;
      }, 0 );
    this.state.purchasable = sum > 0;
    this.updateStateOutputCallback.emit({'state': this.state});
  }


}
