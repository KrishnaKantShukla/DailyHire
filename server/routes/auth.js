const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Helper, isConnected, memoryStore } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dailyhire_jwt_secret_key_2026';

// ─── Google Auth (Employers / Customers Only) ────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Google account email is required.' });
    }

    const userFirstName = firstName || email.split('@')[0];
    const userLastName = lastName || '';

    if (isConnected()) {
      let user = await User.findOne({ email });

      if (user) {
        // Enforce: Employees (Workers) cannot log in with Google
        if (user.accountType === 'helper') {
          return res.status(403).json({
            message: 'Employees (Workers) cannot log in with Google. Please log in using your registered email and password or complete the 2-step Worker Verification signup.',
          });
        }
        if (googleId && !user.googleId) user.googleId = googleId;
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
      } else {
        // Create new Employer (Customer) user via Google
        user = await User.create({
          firstName: userFirstName,
          lastName: userLastName,
          username: email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
          email,
          googleId: googleId || `g_${Date.now()}`,
          avatar: avatar || '',
          accountType: 'customer', // Strictly Employer / Customer
        });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        message: 'Employer Google authentication successful',
        token,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          accountType: user.accountType,
          role: user.accountType,
        },
      });
    }

    // Memory Store Fallback
    let memUser = memoryStore.users.find((u) => u.email === email);
    if (memUser) {
      if (memUser.accountType === 'helper' || memUser.role === 'helper') {
        return res.status(403).json({
          message: 'Employees (Workers) cannot log in with Google. Please log in using your email and password.',
        });
      }
    } else {
      const userId = `u_${Date.now()}`;
      memUser = {
        _id: userId,
        id: userId,
        firstName: userFirstName,
        lastName: userLastName,
        username: email.split('@')[0],
        email,
        googleId: googleId || `g_${Date.now()}`,
        avatar: avatar || '',
        accountType: 'customer', // Strictly Employer
        role: 'customer',
      };
      memoryStore.users.push(memUser);
    }

    const token = jwt.sign({ userId: memUser.id, email: memUser.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Employer Google authentication successful',
      token,
      user: {
        id: memUser.id,
        firstName: memUser.firstName,
        lastName: memUser.lastName,
        username: memUser.username,
        email: memUser.email,
        avatar: memUser.avatar,
        accountType: memUser.accountType,
        role: memUser.accountType,
      },
    });
  } catch (error) {
    console.error('Google Auth error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during Google authentication.' });
  }
});

// ─── Signup (Support Step 1 & Step 2 Worker details) ───────────────────────
router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      accountType,
      profession,
      experience,
      hourlyRate,
      phone,
      bio,
      skills,
      // Step 2 worker verification & payout details
      govIdType,
      govIdNumber,
      govIdProofUrl,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      upiId,
    } = req.body;

    const selectedRole = accountType || role || 'customer';

    if (!email || (!password && !req.body.googleId) || !firstName) {
      return res.status(400).json({ message: 'First name, email, and password are required.' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : '';

    if (isConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const newUser = await User.create({
        firstName,
        lastName: lastName || '',
        username: username || email.split('@')[0],
        email,
        password: hashedPassword,
        accountType: selectedRole,
        phone: phone || '',
        profession: profession || '',
        experience: experience || '',
        hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
        skills: Array.isArray(skills) ? skills : [],
        bio: bio || '',
        govIdType: govIdType || '',
        govIdNumber: govIdNumber || '',
        govIdProofUrl: govIdProofUrl || '',
        bankName: bankName || '',
        accountHolderName: accountHolderName || '',
        accountNumber: accountNumber || '',
        ifscCode: ifscCode || '',
        upiId: upiId || '',
        verificationStatus: selectedRole === 'helper' ? 'pending' : 'verified',
      });

      if (selectedRole === 'helper') {
        const helperId = `h_${newUser._id}`;
        await Helper.create({
          customId: helperId,
          userId: newUser._id.toString(),
          name: `${firstName} ${lastName || ''}`.trim(),
          profession: profession || 'General Helper',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
          hourlyRate: hourlyRate ? Number(hourlyRate) : 85,
          priceRange: `₹${hourlyRate || 85}/hr`,
          skills: Array.isArray(skills) && skills.length > 0 ? skills : [profession || 'General'],
          bio: bio || `Professional ${profession || 'helper'} awaiting verification.`,
          phone: phone || '',
          govIdType: govIdType || '',
          govIdNumber: govIdNumber || '',
          govIdProofUrl: govIdProofUrl || '',
          bankName: bankName || '',
          accountHolderName: accountHolderName || `${firstName} ${lastName || ''}`.trim(),
          accountNumber: accountNumber || '',
          ifscCode: ifscCode || '',
          upiId: upiId || '',
          verified: false,
          verificationStatus: 'pending',
        });
        const Notification = require('../db').Notification;
        if (Notification) {
          await Notification.create({
            userId: newUser._id.toString(),
            title: selectedRole === 'helper' ? `Welcome to Worker Portal, ${firstName}! 🚀` : `Welcome to DailyHire, ${firstName}! 🌟`,
            message: selectedRole === 'helper'
              ? 'Your worker profile has been registered and is under verification review.'
              : 'Your account is active! You can now explore verified daily-wage helpers and book services.',
            type: 'system',
            read: false,
            link: '/dashboard',
          }).catch(() => {});
        }
      }

      const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

      const userObj = {
        id: newUser._id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        accountType: newUser.accountType,
        role: newUser.accountType,
        govIdType: newUser.govIdType,
        govIdNumber: newUser.govIdNumber,
        accountNumber: newUser.accountNumber,
        verificationStatus: newUser.verificationStatus,
      };

      return res.status(201).json({
        message: 'Account registered successfully',
        token,
        user: userObj,
      });
    }

    // Memory Store Fallback
    const existingMemUser = memoryStore.users.find((u) => u.email === email);
    if (existingMemUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const userId = `u_${Date.now()}`;
    const memUser = {
      _id: userId,
      id: userId,
      firstName,
      lastName: lastName || '',
      username: username || email.split('@')[0],
      email,
      password: hashedPassword,
      accountType: selectedRole,
      role: selectedRole,
      phone: phone || '',
      profession: profession || '',
      experience: experience || '',
      hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
      bio: bio || '',
      govIdType: govIdType || '',
      govIdNumber: govIdNumber || '',
      govIdProofUrl: govIdProofUrl || '',
      bankName: bankName || '',
      accountHolderName: accountHolderName || '',
      accountNumber: accountNumber || '',
      ifscCode: ifscCode || '',
      upiId: upiId || '',
      verificationStatus: selectedRole === 'helper' ? 'pending' : 'verified',
    };

    memoryStore.users.push(memUser);

    if (selectedRole === 'helper') {
      memoryStore.helpers.push({
        customId: `h_${userId}`,
        _id: `h_${userId}`,
        userId: userId,
        name: `${firstName} ${lastName || ''}`.trim(),
        profession: profession || 'General Helper',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        hourlyRate: hourlyRate ? Number(hourlyRate) : 85,
        priceRange: `₹${hourlyRate || 85}/hr`,
        rating: 5.0,
        reviewCount: 0,
        available: true,
        verified: false,
        verificationStatus: 'pending',
        skills: Array.isArray(skills) && skills.length > 0 ? skills : [profession || 'General'],
        bio: bio || `Professional ${profession || 'helper'} awaiting admin verification.`,
        phone: phone || '',
        govIdType: govIdType || '',
        govIdNumber: govIdNumber || '',
        govIdProofUrl: govIdProofUrl || '',
        bankName: bankName || '',
        accountHolderName: accountHolderName || '',
        accountNumber: accountNumber || '',
        ifscCode: ifscCode || '',
        upiId: upiId || '',
      });
    }


    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        username: memUser.username,
        email,
        accountType: selectedRole,
        role: selectedRole,
        govIdType: memUser.govIdType,
        govIdNumber: memUser.govIdNumber,
        accountNumber: memUser.accountNumber,
        verificationStatus: memUser.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during signup.' });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Direct Administrator Credentials Check
    const cleanEmail = email.toLowerCase().trim();
    if ((cleanEmail === 'admin@dailyhire.com' || cleanEmail === 'admin') && (password === 'admin' || password === 'admin123')) {
      const adminToken = jwt.sign({ userId: 'admin_1', email: 'admin@dailyhire.com', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        message: 'Administrator login successful',
        token: adminToken,
        user: {
          id: 'admin_1',
          firstName: 'DailyHire',
          lastName: 'Admin',
          username: 'admin',
          email: 'admin@dailyhire.com',
          accountType: 'admin',
          role: 'admin',
          isAdmin: true,
        },
      });
    }

    if (isConnected()) {

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      let helperStatus = user.verificationStatus || 'verified';
      let isVerified = user.verificationStatus === 'verified';

      if (user.accountType === 'helper') {
        const helperObj = await Helper.findOne({
          $or: [
            { userId: user._id.toString() },
            { customId: `h_${user._id}` },
            { customId: user._id.toString() },
          ],
        });
        if (helperObj) {
          helperStatus = helperObj.verificationStatus || (helperObj.verified ? 'verified' : 'pending');
          isVerified = helperObj.verified || helperStatus === 'verified';
        }
      }

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          accountType: user.accountType,
          role: user.accountType,
          verificationStatus: helperStatus,
          verified: isVerified,
        },
      });
    }

    // Memory store fallback login
    const memUser = memoryStore.users.find((u) => u.email === email);
    if (!memUser) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: memUser.id, email: memUser.email }, JWT_SECRET, { expiresIn: '7d' });

    let memHelperStatus = memUser.verificationStatus || 'verified';
    let memIsVerified = memUser.verificationStatus === 'verified';

    if (memUser.accountType === 'helper') {
      const helperObj = memoryStore.helpers.find(
        (h) => h.userId === memUser.id || h.customId === `h_${memUser.id}` || h.id === memUser.id
      );
      if (helperObj) {
        memHelperStatus = helperObj.verificationStatus || (helperObj.verified ? 'verified' : 'pending');
        memIsVerified = helperObj.verified || memHelperStatus === 'verified';
      }
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: memUser.id,
        firstName: memUser.firstName,
        lastName: memUser.lastName,
        username: memUser.username,
        email: memUser.email,
        accountType: memUser.accountType,
        role: memUser.accountType,
        verificationStatus: memHelperStatus,
        verified: memIsVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ─── Get Profile ─────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id ? user._id.toString() : user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    accountType: user.accountType,
    role: user.accountType,
    phone: user.phone,
    profession: user.profession,
    hourlyRate: user.hourlyRate,
    skills: user.skills,
  });
});

// ─── Update Profile ──────────────────────────────────────────────────────────
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      profession,
      hourlyRate,
      bio,
      govIdType,
      govIdNumber,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      upiId,
    } = req.body;

    const userId = req.user._id || req.user.id;

    if (isConnected()) {
      let user = null;
      if (typeof userId === 'string' && userId.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(userId);
      }
      if (!user && req.user.email) {
        user = await User.findOne({ email: req.user.email });
      }
      if (user) {
        if (firstName) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (profession !== undefined) user.profession = profession;
        if (hourlyRate !== undefined) user.hourlyRate = Number(hourlyRate);
        if (bio !== undefined) user.bio = bio;
        if (govIdType !== undefined) user.govIdType = govIdType;
        if (govIdNumber !== undefined) user.govIdNumber = govIdNumber;
        if (bankName !== undefined) user.bankName = bankName;
        if (accountHolderName !== undefined) user.accountHolderName = accountHolderName;
        if (accountNumber !== undefined) user.accountNumber = accountNumber;
        if (ifscCode !== undefined) user.ifscCode = ifscCode;
        if (upiId !== undefined) user.upiId = upiId;

        await user.save();

        if (user.accountType === 'helper') {
          const helperDoc = await Helper.findOne({
            $or: [{ userId: user._id.toString() }, { customId: `h_${user._id}` }],
          });
          if (helperDoc) {
            if (firstName || lastName !== undefined) helperDoc.name = `${user.firstName} ${user.lastName || ''}`.trim();
            if (profession) helperDoc.profession = profession;
            if (hourlyRate) {
              helperDoc.hourlyRate = Number(hourlyRate);
              helperDoc.priceRange = `₹${hourlyRate}/hr`;
            }
            if (bio !== undefined) helperDoc.bio = bio;
            if (phone !== undefined) helperDoc.phone = phone;
            if (govIdType !== undefined) helperDoc.govIdType = govIdType;
            if (govIdNumber !== undefined) helperDoc.govIdNumber = govIdNumber;
            if (bankName !== undefined) helperDoc.bankName = bankName;
            if (accountHolderName !== undefined) helperDoc.accountHolderName = accountHolderName;
            if (accountNumber !== undefined) helperDoc.accountNumber = accountNumber;
            if (ifscCode !== undefined) helperDoc.ifscCode = ifscCode;
            if (upiId !== undefined) helperDoc.upiId = upiId;
            await helperDoc.save();
          }
        }

        return res.json({
          message: 'Profile updated successfully',
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            accountType: user.accountType,
            role: user.accountType,
            phone: user.phone,
            profession: user.profession,
            hourlyRate: user.hourlyRate,
            bio: user.bio,
            govIdType: user.govIdType,
            govIdNumber: user.govIdNumber,
            bankName: user.bankName,
            accountHolderName: user.accountHolderName,
            accountNumber: user.accountNumber,
            ifscCode: user.ifscCode,
            upiId: user.upiId,
          },
        });
      }
    }

    // Memory store fallback update
    const memUser = memoryStore.users.find((u) => u.id === userId || u._id === userId);
    if (memUser) {
      if (firstName) memUser.firstName = firstName;
      if (lastName !== undefined) memUser.lastName = lastName;
      if (username) memUser.username = username;
      if (email) memUser.email = email;
      if (phone !== undefined) memUser.phone = phone;
      if (profession !== undefined) memUser.profession = profession;
      if (hourlyRate !== undefined) memUser.hourlyRate = Number(hourlyRate);
      if (bio !== undefined) memUser.bio = bio;
      if (govIdType !== undefined) memUser.govIdType = govIdType;
      if (govIdNumber !== undefined) memUser.govIdNumber = govIdNumber;
      if (bankName !== undefined) memUser.bankName = bankName;
      if (accountHolderName !== undefined) memUser.accountHolderName = accountHolderName;
      if (accountNumber !== undefined) memUser.accountNumber = accountNumber;
      if (ifscCode !== undefined) memUser.ifscCode = ifscCode;
      if (upiId !== undefined) memUser.upiId = upiId;

      const memHelper = memoryStore.helpers.find((h) => h.userId === userId || h.customId === `h_${userId}`);
      if (memHelper) {
        if (firstName || lastName !== undefined) memHelper.name = `${memUser.firstName} ${memUser.lastName || ''}`.trim();
        if (profession) memHelper.profession = profession;
        if (hourlyRate) {
          memHelper.hourlyRate = Number(hourlyRate);
          memHelper.priceRange = `₹${hourlyRate}/hr`;
        }
        if (bio !== undefined) memHelper.bio = bio;
        if (phone !== undefined) memHelper.phone = phone;
        if (bankName !== undefined) memHelper.bankName = bankName;
        if (accountNumber !== undefined) memHelper.accountNumber = accountNumber;
        if (ifscCode !== undefined) memHelper.ifscCode = ifscCode;
        if (upiId !== undefined) memHelper.upiId = upiId;
      }

      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: memUser.id,
          firstName: memUser.firstName,
          lastName: memUser.lastName,
          username: memUser.username,
          email: memUser.email,
          accountType: memUser.accountType,
          role: memUser.accountType,
          phone: memUser.phone,
          profession: memUser.profession,
          hourlyRate: memUser.hourlyRate,
          bio: memUser.bio,
          govIdType: memUser.govIdType,
          govIdNumber: memUser.govIdNumber,
          bankName: memUser.bankName,
          accountHolderName: memUser.accountHolderName,
          accountNumber: memUser.accountNumber,
          ifscCode: memUser.ifscCode,
          upiId: memUser.upiId,
        },
      });
    }

    res.status(404).json({ message: 'User profile not found.' });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update profile.' });
  }
});

module.exports = router;

