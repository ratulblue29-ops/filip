export interface User {
  name: string;
  avatar: any;
  greeting: string;
}

export const userData: User = {
  name: 'Alex',
  avatar: require('../../assets/images/image1.png'),
  greeting: 'Good Morning',
};

export interface GigUser {
  name: string;
  avatar: any;
  verified: boolean;
}

export interface RecommendedGig {
  id: string;
  title: string;
  image: any;
  rate: number;
  currency: string;
  location: string;
  distance: string;
  date: string;
  duration?: string;
  tags: string[];
  user: GigUser;
  featured?: boolean;
  seasonal?: boolean;
}

export const recommendedGigs: RecommendedGig[] = [
  {
    id: '1',
    title: 'Event Server',
    image: require('../../assets/images/banner1.png'),
    rate: 25,
    currency: '€',
    location: 'Sofitel, New York',
    distance: '5.6 Mi',
    date: 'Today, 6:00 PM - 2:00 AM',
    tags: ['Weddings', 'Vip Service'],
    user: {
      name: 'Michael J.',
      avatar: require('../../assets/images/image1.png'),
      verified: true,
    },
    featured: true,
  },
  {
    id: '2',
    title: 'Bartender Assistance',
    image: require('../../assets/images/banner1.png'),
    rate: 35,
    currency: '€',
    location: 'Zinc Lounge',
    distance: '5 Mi',
    date: 'Nov 15 - Jan 05',
    duration: 'Multiple Shifts Available',
    tags: ['Inventory', 'Mixology-Basic'],
    user: {
      name: 'Sarah J.',
      avatar: require('../../assets/images/image1.png'),
      verified: true,
    },
    seasonal: true,
  },
];