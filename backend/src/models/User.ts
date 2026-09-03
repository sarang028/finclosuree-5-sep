import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  role: 'user' | 'admin';
  provider: 'local' | 'google' | 'both';
  googleId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, enum: ['local', 'google', 'both'], default: 'local' },
    googleId: { type: String, index: true, sparse: true },
    avatar: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
