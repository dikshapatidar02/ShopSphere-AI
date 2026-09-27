import type { User } from '@/types';

export const MOCK_USERS: readonly User[] = [
  {
    id: 'user-cust-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    phone: '+1 (555) 234-5678',
    addresses: [
      {
        id: 'addr-1',
        recipientName: 'Alex Johnson',
        line1: '123 Market Street',
        line2: 'Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States',
        phone: '+1 (555) 234-5678',
        isDefault: true,
      },
    ],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Sarah Connor',
    email: 'admin.sarah@shopsphere.ai',
    role: 'administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    phone: '+1 (555) 987-6543',
    createdAt: '2025-11-01T08:30:00Z',
  },
];
