import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface StatItem {
  number: string;
  label: string;
}

interface PhilosophyItem {
  number: string;
  title: string;
  description: string;
}

interface ValueItem {
  title: string;
  description: string;
}

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  
  // Stats data
  readonly stats: StatItem[] = [
    { number: '150+', label: 'Explored Spots' },
    { number: '2,500+', label: 'Active Users' },
    { number: '8,000+', label: 'Shared Experiences' }
  ];

  // Philosophy items
  readonly philosophyItems: PhilosophyItem[] = [
    {
      number: '01',
      title: 'Right to Silence',
      description: 'Everyone has the right to find and enjoy quiet moments in the city. We believe that these moments are essential for well-being and creativity, and we are committed to making them accessible to all.'
    },
    {
      number: '02',
      title: 'Discovery Spirit',
      description: 'We uncover quiet corners that you won’t find in tourist guides, spaces that local people haven’t even discovered yet. Every discovery is an adventure, every moment an experience.'
    },
    {
      number: '03',
      title: 'Community Power',
      description: 'Our growing ecosystem is powered by our users’ experiences and suggestions. Together, we are stronger.'
    },
    {
      number: '04',
      title: 'Sustainability',
      description: 'We encourage respectful exploration of nature and the environment, working to ensure these special spaces are preserved for future generations.'
    }
  ];

  // Story paragraphs
  readonly storyParagraphs = [
    'Spotted In was born from the explorations of a group of friends living in 2024 who sought to escape the noise of the city and find quiet moments.',
    'They started sharing their discoveries with friends, and soon realized that there was a growing community of people looking for the same thing: quiet, hidden spots in the city.',
    'From the first day to today, our platform has become a community where thousands of users share, discover, and experience quiet moments. Every new spot, every shared experience, strengthens our mission.'
  ];

  // Values
  readonly values: ValueItem[] = [
    {
      title: 'Security',
      description: 'Our users\' privacy and security are our top priorities. We implement robust measures to protect personal data and ensure a safe experience for everyone.'
    },
    {
      title: 'Uniqueness',
      description: 'Every spot is verified, and every review comes from real experiences. We provide content created by the community for the community.'
    },
    {
      title: 'Accessibility',
      description: 'We make our platform easy to use, understandable, and inclusive for everyone. Technology should not be a barrier, but a bridge.'
    },
    {
      title: 'Transparency',
      description: 'We share how we work, how we make decisions, and how we grow our community in an open and clear way.'
    }
  ];

  // Team members
  readonly teamMembers: TeamMember[] = [
    {
      initials: 'AY',
      name: 'Ahmet Yılmaz',
      role: 'Manager & CEO',
      bio: '10-year technology experience bringing quiet moments to the digital world.'
    },
    {
      initials: 'ED',
      name: 'Elif Demir',
      role: 'Design Director',
      bio: 'Creative designer who always puts user experience at the forefront.'
    },
    {
      initials: 'MK',
      name: 'Mehmet Kaya',
      role: 'Technical Leader',
      bio: 'Platform technology and infrastructure expert.'
    },
    {
      initials: 'ZA',
      name: 'Zeynep Arslan',
      role: 'Community Manager',
      bio: 'Our community manager who brings people together and fosters a supportive environment for all users.'
    }
  ];

  // Footer data
  readonly footerSections = {
    platform: [
      { label: 'Discover', link: '/explore' },
      { label: 'Map', link: '/map' },
      { label: 'Community', link: '/community' },
      { label: 'Blog', link: '/blog' }
    ],
    support: [
      { label: 'Help Center', link: '/help' },
      { label: 'Privacy', link: '/privacy' },
      { label: 'Terms of Use', link: '/terms' },
      { label: 'Contact', link: '/contact' }
    ],
    social: [
      { label: 'Instagram', link: 'https://instagram.com' },
      { label: 'Twitter', link: 'https://twitter.com' },
      { label: 'LinkedIn', link: 'https://linkedin.com' }
    ]
  };

  readonly currentYear = new Date().getFullYear();
}