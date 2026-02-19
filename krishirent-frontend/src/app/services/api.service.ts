import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Equipment, Booking, BookingRequest, User, UserRegisterRequest, UserLoginRequest, Payment, PaymentRequest } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8080';
  serverOffline = signal(false);

  constructor(private http: HttpClient) {}

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error('API Error:', error);
      if (error.status === 0) {
        this.serverOffline.set(true);
      }
      return of(result as T);
    };
  }

  // Equipment
  getEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/equipment`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Equipment[]>([]))
    );
  }

  getEquipmentById(id: number): Observable<Equipment | null> {
    return this.http.get<Equipment>(`${this.apiUrl}/equipment/${id}`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Equipment | null>(null))
    );
  }

  getEquipmentByType(type: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiUrl}/equipment/type/${type}`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Equipment[]>([]))
    );
  }

  // Bookings
  createBooking(request: BookingRequest): Observable<Booking | null> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, request).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Booking | null>(null))
    );
  }

  getBookingsByFarmer(farmerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/farmer/${farmerId}`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Booking[]>([]))
    );
  }

  cancelBooking(id: number): Observable<Booking | null> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/cancel`, {}).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Booking | null>(null))
    );
  }

  getBookingById(id: number): Observable<Booking | null> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Booking | null>(null))
    );
  }

  // Users
  registerUser(request: UserRegisterRequest): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, request).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<User | null>(null))
    );
  }

  loginUser(request: UserLoginRequest): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/users/login`, request).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<User | null>(null))
    );
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<User | null>(null))
    );
  }

  // Payments
  createPayment(request: PaymentRequest): Observable<Payment | null> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, request).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Payment | null>(null))
    );
  }

  getPaymentsByFarmer(farmerId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/farmer/${farmerId}`).pipe(
      tap(() => this.serverOffline.set(false)),
      catchError(this.handleError<Payment[]>([]))
    );
  }
}
