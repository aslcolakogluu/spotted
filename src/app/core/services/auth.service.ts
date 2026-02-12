import{Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginForm, Session } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSignal = signal<User | null>(null); // giriş yapılmayabilir unutma onun için null
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
        console.error('Error in session data:', error); // hatada oturum sil
        return null;
        }
    }

    private saveSessionToStorage(user: User): void {
    const session: Session = {
        user,
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000 // 24 sa
        };
        
    sessionStorage.setItem('spotted-in-session', JSON.stringify(session)); // sekme kapatınca tekrar login yapmak için
    }

    private clearSession(): void {
        sessionStorage.removeItem('spotted-in-session');
    }


    async login(credentials: LoginForm): Promise<void> {
        setTimeout(() => {
            if (credentials.email && credentials.password.length >= 6) { // 6 dan kücük hata olmalı

                const user: User = {
                    id: Math.random().toString(36).substr(2, 9),  // random yaptık id
                    email: credentials.email, 
                    name: credentials.email.split('@')[0], 
                    profileUrl: credentials.email.charAt(0).toUpperCase()
                };

                this.saveSessionToStorage(user); // kaydet

                this.currentUserSignal.set(user);
                this.isAuthenticatedSignal.set(true);

                

                } else {
                    throw(new Error('Invalid email or password. Password must be at least 6 characters long.')); // hata mesajı
                }
        }, 300); // add spota dönerkenki hızı 
        
    }

    logout(): void {
        this.clearSession(); // oturumu temizler
        this.currentUserSignal.set(null); 
        this.isAuthenticatedSignal.set(false); 
        this.router.navigate(['/index.html']); //anasayfa git

    }
}

