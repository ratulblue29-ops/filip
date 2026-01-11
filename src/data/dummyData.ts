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

export interface NewestGig {
  id: string;
  title: string;
  company: string;
  distance: string;
  rate: string;
  date: string;
  time?: string;
  duration?: string;
  tags: string[];
  spotsLeft?: string;
  user: {
    name: string;
    avatar: any;
  };
  bookmarked: boolean;
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

export const newestGigs: NewestGig[] = [
  {
    id: '3',
    title: 'Catering Staff',
    company: 'Creative Event',
    distance: '31 Mi',
    rate: '€20/Hr',
    date: 'Sat Oct 26',
    duration: '2 Days Left',
    tags: [],
    spotsLeft: '5 spots left',
    user: {
      name: 'John Doe',
      avatar: require('../../assets/images/image1.png'),
    },
    bookmarked: true,
  },
  {
    id: '4',
    title: 'House Staff',
    company: 'Burger Joint',
    distance: '12.2 Mi',
    rate: '€20/Hr',
    date: 'Today',
    time: '5 PM - 11 PM',
    tags: ['Dishwashing'],
    spotsLeft: '5 spots left',
    user: {
      name: 'Jane Smith',
      avatar: require('../../assets/images/image1.png'),
    },
    bookmarked: true,
  },
];