// The T represents any type
export interface Result<T> {
    // We can get any data or get undefined
    data: T | undefined;
    // error is optional
    error?: string;
  }