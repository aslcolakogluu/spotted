import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginForm, Session } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null); // giriş yapılmayabilir unutma onun için null ve uygulama ilk açıldığında kullanıcı yok
  private isAuthenticatedSignal = signal<boolean>(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(private router: Router) {
    this.initializeAuth(); // daha önce lohin yapılmış mı kontrol et
  }

  private initializeAuth(): void {
    const savedSession = this.getSessionFromStorage();

    if (savedSession) {
      this.currentUserSignal.set(savedSession.user);
      this.isAuthenticatedSignal.set(true);
    }
  } // sessionStorage bakıyor eğer session varsa  kullanıcıyı tekrar yüklüyor. yani sayfa yenilense bile login durumunu korur.

  private getSessionFromStorage(): Session | null {
    const sessionData = sessionStorage.getItem('spotted-in-session');

    if (!sessionData) return null; // sessionStorage sekme kapanınca silinir local gibi kalıcı değil

    try {
      const session: Session = JSON.parse(sessionData); // string object dönüşümü
      const now = Date.now();

      if (now - session.timestamp >= session.expiresIn) {
        // session süresi dolmuş mu
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error in session data:', error); // hatada oturum sil
      return null;
    }
  }

  private saveSessionToStorage(user: User): void {
    const session: Session = {
      user,
      timestamp: Date.now(),
      expiresIn: 24 * 60 * 60 * 1000, // 24 sa
    }; // user bilgisini timestamp ile birlikte storage kaydeder.

    sessionStorage.setItem('spotted-in-session', JSON.stringify(session)); // sekme kapatınca tekrar login yapmak için
  }

  private clearSession(): void {
    sessionStorage.removeItem('spotted-in-session');
  }

  login(credentials: LoginForm): Observable<boolean> { 
    setTimeout(() => { 
      if (credentials.email && credentials.password.length >= 6) {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9), // random yaptık id
          email: credentials.email,
          name: credentials.email.split('@')[0],
          profileUrl: credentials.email.charAt(0).toUpperCase(),
        };

        this.saveSessionToStorage(user); // kaydet

        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      }
    }, 300);

    return of(true);
  }

  logout(): void {
    this.clearSession(); // oturumu temizler
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/index.html']); //anasayfa git
  }
}
