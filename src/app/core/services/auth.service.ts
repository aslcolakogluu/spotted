import{Injectable, signal , computed} from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginForm, Session } from '../models/user.model';
import { resolve } from 'path';

@Injectable({
    providedIn: 'root'
    })
    export class AuthService {
    private session = signal<Session | null>(null);

    private currentUserSignal = signal <User | null>(null);
    private isAuthenticatedSignal = signal<boolean>(false);

    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

    readonly userInitials = computed(() => {
        const user = this.currentUserSignal();
        return user ? user.email.charAt(0).toUpperCase() : '';
    });


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
    const sessionData = localStorage.getItem('spotted-in-session');

    if (!sessionData) return null;

    try {
      const session: Session = JSON.parse(sessionData);
      const now = Date.now();

      if (now - session.timestamp > session.expiresIn) {
        this.clearSession();
        return null;
      }

    return session;
    } catch (error) {
        console.error('Error parsing session data:', error);
        return null;
        }
    }

    private saveSessionToStorage(user: User): void {
    const session: Session = {
        user,
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000 
        };
        
    localStorage.setItem('spotted-in-session', JSON.stringify(session));
    }

    private clearSession(): void {
        localStorage.removeItem('spotted-in-session');
    }

    @param credentials: any
    @returns Promise: any

    async login(credentials: LoginForm): Promise<void> {
        setTimeout(() => {
            if (credentials.email && credentials.password.length >= 6) {

                const user: User = {
                    id: Math.random().toString(36).substr(2, 9),
                    email: credentials.email,
                    name: credentials.email.split('@')[0],
                    profile: credentials.email.charAt(0).toUpperCase()
                };

                this.saveSessionToStorage(user);

                this.currentUserSignal.set(user);
                this.isAuthenticatedSignal.set(true);
                }
                
                resolve();
            } else {
                reject(new Error('Invalid email or password'));
            }
            }, 1000);
        });
    }

    logout(): void {
        this.clearSession();
        this.currentUserSignal.set(null);
        this.isAuthenticatedSignal.set(false);
        this.router.navigate(['/login']);
    }
}




            


   
    


