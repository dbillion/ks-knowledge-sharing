import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  private authService = inject(AuthService);

  // State management
  currentYear = signal(new Date().getFullYear());
  isAuthenticated = this.authService.isAuthenticated;

  // Footer links
  footerLinks = {
    product: [
      { label: 'Knowledge Base', route: '/articles' },
      { label: 'Categories', route: '/categories' },
      { label: 'Search', route: '/search' },
      { label: 'Recent Activity', route: '/activity' }
    ],
    company: [
      { label: 'About Us', route: '/about' },
      { label: 'Contact', route: '/contact' },
      { label: 'Careers', route: '/careers' },
      { label: 'Blog', route: '/blog' }
    ],
    support: [
      { label: 'Help Center', route: '/help' },
      { label: 'Documentation', route: '/docs' },
      { label: 'API Reference', route: '/api-docs' },
      { label: 'Status Page', route: '/status' }
    ],
    legal: [
      { label: 'Privacy Policy', route: '/privacy' },
      { label: 'Terms of Service', route: '/terms' },
      { label: 'Cookie Policy', route: '/cookies' },
      { label: 'GDPR', route: '/gdpr' }
    ]
  };

  // Social media links
  socialLinks = [
    {
      name: 'GitHub',
      icon: 'github',
      url: 'https://github.com/company',
      ariaLabel: 'Visit our GitHub repository'
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://linkedin.com/company/company',
      ariaLabel: 'Follow us on LinkedIn'
    },
    {
      name: 'Twitter',
      icon: 'twitter',
      url: 'https://twitter.com/company',
      ariaLabel: 'Follow us on Twitter'
    },
    {
      name: 'YouTube',
      icon: 'youtube',
      url: 'https://youtube.com/company',
      ariaLabel: 'Subscribe to our YouTube channel'
    }
  ];

  // Methods
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getCurrentVersion(): string {
    return '1.0.0'; // This would typically come from environment or package.json
  }

  getLastUpdated(): string {
    return 'December 2024'; // This would typically come from build info
  }
}
