import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { DeceasedProfile } from '../models/DeceasedProfile.js';
import { env } from '../config/env.js';
import { registerSchema, loginSchema } from '../validators/index.js';
import { logAuditAction } from '../services/auditService.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    const { fullName, email, password, phone } = parseResult.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      provider: 'local',
    });

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logAuditAction(user._id.toString(), 'USER_REGISTER', 'User', user._id.toString(), 'User registered account');

    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        provider: user.provider,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
      return;
    }

    if (!user.passwordHash) {
      res.status(401).json({ message: 'This account was created with Google Sign-In. Please click "Continue with Google".' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password credentials.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logAuditAction(user._id.toString(), 'USER_LOGIN', 'User', user._id.toString(), 'User logged in');

    res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        provider: user.provider,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate Google OAuth 2.0 Flow
 * Redirects user to Google Consent Screen
 */
export const initiateGoogleAuth = (req: Request, res: Response): void => {
  const clientId = env.GOOGLE_CLIENT_ID;
  const redirectUri = env.GOOGLE_CALLBACK_URL;

  if (!clientId) {
    res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Google Client ID is not configured on the server.')}`);
    return;
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', 'finclosure_oauth_state');

  res.redirect(authUrl.toString());
};

/**
 * Handle Google OAuth 2.0 Callback
 * Exchanges code for tokens, verifies identity, creates/links user, issues JWT, redirects to frontend
 */
export const handleGoogleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Google Sign-In was cancelled or denied.')}`);
      return;
    }

    if (!code || typeof code !== 'string') {
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Authorization code missing in Google callback.')}`);
      return;
    }

    if (!env.GOOGLE_CLIENT_SECRET) {
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Google authentication is not fully configured. GOOGLE_CLIENT_SECRET is missing in backend .env.')}`);
      return;
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('[Google OAuth Token Error]', errorData);
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Failed to exchange authorization code with Google.')}`);
      return;
    }

    const tokens = (await tokenResponse.json()) as { access_token?: string; id_token?: string };
    if (!tokens.access_token) {
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Google token response did not contain an access token.')}`);
      return;
    }

    // Fetch verified Google User Profile
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userinfoResponse.ok) {
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Failed to retrieve verified user profile from Google.')}`);
      return;
    }

    const googleUser = (await userinfoResponse.json()) as {
      sub: string;
      email: string;
      name?: string;
      picture?: string;
    };

    if (!googleUser.email) {
      res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('Google account does not have a valid email address.')}`);
      return;
    }

    const normalizedEmail = googleUser.email.toLowerCase();

    // Account finding and linking in MongoDB
    let user = await User.findOne({
      $or: [{ googleId: googleUser.sub }, { email: normalizedEmail }],
    });

    if (user) {
      // Existing user found - link Google ID if not already set
      let modified = false;
      if (!user.googleId) {
        user.googleId = googleUser.sub;
        user.provider = user.passwordHash ? 'both' : 'google';
        modified = true;
      }
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
        modified = true;
      }
      if (!user.fullName && googleUser.name) {
        user.fullName = googleUser.name;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    } else {
      // New user creation
      user = await User.create({
        fullName: googleUser.name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId: googleUser.sub,
        provider: 'google',
        avatar: googleUser.picture,
        role: 'user',
      });
    }

    // Check onboarding status
    const deceasedProfile = await DeceasedProfile.findOne({ userId: user._id });
    const hasProfile = !!deceasedProfile;

    // Issue JWT Token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logAuditAction(user._id.toString(), 'USER_GOOGLE_AUTH', 'User', user._id.toString(), 'User authenticated via Google OAuth');

    // Redirect to frontend callback route with token & hasProfile status
    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}&hasProfile=${hasProfile}`);
  } catch (error) {
    console.error('[Google Callback Exception]', error);
    res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent('An unexpected error occurred during Google Sign-In.')}`);
  }
};

