import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpotService } from '@core/services';
import { AuthService } from '@core/services/auth.service';
import { Spot, SpotType } from '@core/models';
import { getSpotTypeIcon, getSpotTypeLabel } from '@shared/constants/spot-type-icons';

@Component({
    selector: 'app-spot-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './spot-detail.html',
    styleUrl: './spot-detail.css',
})
export class SpotDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private spotService = inject(SpotService);
    private authService = inject(AuthService);

    spot = signal<Spot | null>(null);
    isLoading = signal(true);
    isFavorite = signal(false);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/explore']);
            return;
        }

        this.spotService.getSpotById(id).subscribe((spot) => {
            if (!spot) {
                this.router.navigate(['/explore']);
                return;
            }
            this.spot.set(spot);
            this.isLoading.set(false);
            this.loadFavoriteStatus(spot.id);
        });
    }

    private loadFavoriteStatus(spotId: string): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;
        const key = `favorites_${user.email}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            const favArray: string[] = JSON.parse(stored);
            this.isFavorite.set(favArray.includes(spotId));
        }
    }

    toggleFavorite(): void {
        const user = this.authService.getCurrentUser();
        const spot = this.spot();
        if (!user || !spot) {
            this.authService.openLoginModal();
            return;
        }

        const key = `favorites_${user.email}`;
        const stored = localStorage.getItem(key);
        const favArray: string[] = stored ? JSON.parse(stored) : [];

        if (this.isFavorite()) {
            const updated = favArray.filter((id) => id !== spot.id);
            localStorage.setItem(key, JSON.stringify(updated));
            this.isFavorite.set(false);
        } else {
            favArray.push(spot.id);
            localStorage.setItem(key, JSON.stringify(favArray));
            this.isFavorite.set(true);
        }
    }

    getStars(rating: number): string {
        const full = Math.round(rating);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    }

    getTypeIcon(type: SpotType): string {
        return getSpotTypeIcon(type);
    }

    getTypeLabel(type: SpotType): string {
        return getSpotTypeLabel(type);
    }

    goBack(): void {
        window.history.back();
    }

    isOwner(): boolean {
        const user = this.authService.getCurrentUser();
        const spot = this.spot();
        if (!user || !spot) return false;
        return spot.userId === user.email;
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    }
}
