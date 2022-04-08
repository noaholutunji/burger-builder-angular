import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Ingredient } from '../../../shared/ingredient.model';
import { catchError } from 'rxjs/operators';

const baseUrl = 'https://hooks-with-react.firebaseio.com/orders.json';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const token = localStorage.getItem('token').replace(/['"]+/g, '');

    const userId = localStorage.getItem('userId').replace(/['"]+/g, '');

    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    return this.http.get(baseUrl + queryParams);
  }

  saveOrder(price, ingredients, userId) {
    const token = localStorage.getItem('token').replace(/['"]+/g, '');

    return this.http.post(baseUrl + '?auth=' + token, {
        price, ingredients, userId
      }
    )
    .pipe(
      catchError(errorRes => {
        const errorMessage = 'An error occurred!';
        return throwError(errorMessage);
      })
    );
  }
}
