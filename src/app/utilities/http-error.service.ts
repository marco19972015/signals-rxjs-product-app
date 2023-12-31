import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class HttpErrorService {
  // This service examines the error and returns a formatted message.
  // This is a simple example thatw e can expand on to format custom messages
  // For example, checking for an error return code of 503 and display a message that the
  // server isn't available, please try again later.

  formatError(err: HttpErrorResponse): string {
    return this.httpErrorFormatter(err);
  }

  private httpErrorFormatter(err: HttpErrorResponse): string {
    // In a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    // console.error(err);
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.statusText}`;
    }
    return errorMessage;
  }
}
