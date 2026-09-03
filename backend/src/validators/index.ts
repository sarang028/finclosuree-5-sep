import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(1, 'Password is required.'),
});

export const deceasedProfileSchema = z.object({
  fullName: z.string().min(2, 'Deceased full name is required.'),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().optional(),
  relationship: z.string().min(2, 'Relationship is required.'),
  claimantRole: z.enum(['Nominee', 'Legal Heir', 'Both', 'Other']),
  contactInfo: z.string().optional(),
  knownInstitutions: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const assetSchema = z.object({
  deceasedId: z.string().min(1, 'Deceased Profile reference required.'),
  name: z.string().min(2, 'Asset name is required.'),
  category: z.enum([
    'Bank Account',
    'Fixed Deposit',
    'Insurance',
    'Investment',
    'Pension',
    'Digital Asset',
    'Other',
  ]),
  institution: z.string().min(1, 'Institution is required.'),
  accountOrPolicyNumber: z.string().optional(),
  estimatedValue: z.number().nonnegative().optional(),
  status: z.enum(['Known', 'Potential', 'Confirmed', 'Claim Started', 'Claim Completed']).optional(),
  notes: z.string().optional(),
});

export const claimSchema = z.object({
  deceasedId: z.string().min(1, 'Deceased Profile reference required.'),
  assetId: z.string().min(1, 'Asset reference required.'),
  institution: z.string().min(1, 'Institution is required.'),
  claimType: z.string().min(1, 'Claim type is required.'),
  claimReferenceNumber: z.string().optional(),
  notes: z.string().optional(),
});
