import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginForm, Session } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const savedSession = this.getSessionFromStorage();
    if (savedSession) {
      this.currentUserSignal.set(savedSession.user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  private getSessionFromStorage(): Session | null {
    const sessionData = sessionStorage.getItem('spotted-in-session');
    if (!sessionData) return null;

    try {
      const session: Session = JSON.parse(sessionData);
      const now = Date.now();
      if (now - session.timestamp >= session.expiresIn) {
        this.clearSession();
        return null;
      }
      return session;
    } catch (error) {
      console.error('Error in session data:', error);
      return null;
    }
  }

  private saveSessionToStorage(user: User): void {
    const session: Session = {
      user,
      timestamp: Date.now(),
      expiresIn: 24 * 60 * 60 * 1000, // 24 saat
    };
    sessionStorage.setItem('spotted-in-session', JSON.stringify(session));
  }

  private clearSession(): void {
    sessionStorage.removeItem('spotted-in-session');
  }

  login(credentials: LoginForm): Observable<boolean> {
    setTimeout(() => {
      if (credentials.email && credentials.password.length >= 6) {
        // ✅ Önce kullanıcıyı users'dan kontrol et
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(
          (u: any) =>
            u.email === credentials.email &&
            u.password === credentials.password,
        );

        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: credentials.email,
          name: existingUser
            ? existingUser.name
            : credentials.email.split('@')[0],
          profileUrl: credentials.email.charAt(0).toUpperCase(),
        };

        this.saveSessionToStorage(user);
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
        this.closeLoginModal();
        this.router.navigateByUrl('/');
      }
    }, 300);
    return of(true);
  }

  // ✅ REGISTER METODU - DÜZELTİLDİ
  register(name: string, email: string, password: string): boolean {
    // Email kontrolü
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find((u: any) => u.email === email);

    if (exists) {
      return false; // Email zaten kayıtlı
    }

    // Yeni kullanıcı ekle
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Otomatik login - ✅ Senin yapına göre
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: name,
      profileUrl: email.charAt(0).toUpperCase(),
    };

    this.saveSessionToStorage(user);
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);

    return true;
  }

  logout(): void {
    this.clearSession();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/']);
  }

  // ✅ Helper metod - Register component için
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  showLoginModal = signal(false);

  openLoginModal(): void {
    this.showLoginModal.set(true); // showLoginModal sinyalini true yaparak login modal'ını açar, böylece kullanıcı giriş yapmak istediğinde modal görünür hale gelir
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false); // showLoginModal sinyalini false yaparak login modal'ını kapatır, böylece kullanıcı giriş yaptıktan sonra modal kapanır veya kullanıcı modal'ı kapatmak istediğinde modal görünmez hale gelir
  }
}
