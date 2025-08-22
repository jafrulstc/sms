import BaseApiService from '~/shared/services/api/baseApi';
import type { LoginCredentials, User } from '../store/authSlice';

/**
 * Login response interface
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Token verification response interface
 */
export interface TokenVerificationResponse {
  user: User;
  token: string;
}

/**
 * Mock users for development
 */
const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'admin',
    email: 'admin@school.edu',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'super_admin',
    permissions: [
      { moduleValue: 'hostel', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'education', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'accounts', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'library', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'boarding', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'education',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user2',
    username: 'hostel_manager',
    email: 'hostel@school.edu',
    firstName: 'Hostel',
    lastName: 'Manager',
    role: 'admin',
    permissions: [
      { moduleValue: 'hostel', permissions: ['read', 'write', 'delete', 'manage'] },
      { moduleValue: 'boarding', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'hostel',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user3',
    username: 'education_admin',
    email: 'education@school.edu',
    firstName: 'Education',
    lastName: 'Administrator',
    role: 'admin',
    permissions: [
      { moduleValue: 'education', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'education',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user4',
    username: 'accounts_manager',
    email: 'accounts@school.edu',
    firstName: 'Accounts',
    lastName: 'Manager',
    role: 'admin',
    permissions: [
      { moduleValue: 'accounts', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'accounts',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user5',
    username: 'boarding_manager',
    email: 'boarding@school.edu',
    firstName: 'Boarding',
    lastName: 'Manager',
    role: 'admin',
    permissions: [
      { moduleValue: 'boarding', permissions: ['read', 'write', 'delete', 'manage'] },
    ],
    defaultModule: 'boarding',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user6',
    username: 'teacher1',
    email: 'teacher1@school.edu',
    firstName: 'John',
    lastName: 'Smith',
    role: 'teacher',
    permissions: [
      { moduleValue: 'education', permissions: ['read', 'write'] },
    ],
    defaultModule: 'education',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Auth API service class
 */
class AuthApiService extends BaseApiService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.simulateDelay(1000);

    // Find user by username
    const user = mockUsers.find(u => u.username === credentials.username && u.isActive);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // In a real implementation, you would verify the password hash
    // For demo purposes, we'll accept any password for existing users
    if (!credentials.password) {
      throw new Error('Password is required');
    }

    // Generate mock JWT token
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    return {
      user,
      token,
    };
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.simulateDelay(500);
    // In a real implementation, you would invalidate the token on the server
    return;
  }

  /**
   * Verify token
   */
  async verifyToken(token: string): Promise<TokenVerificationResponse> {
    await this.simulateDelay(300);

    // Extract user ID from mock token
    const tokenParts = token.split('_');
    if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt' || tokenParts[2] !== 'token') {
      throw new Error('Invalid token format');
    }

    const userId = tokenParts[3];
    const user = mockUsers.find(u => u.id === userId && u.isActive);

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    return {
      user,
      token,
    };
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    await this.simulateDelay(200);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await this.verifyToken(token);
    return response.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.simulateDelay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockUsers[userIndex];
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await this.simulateDelay(500);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real implementation, you would verify the current password
    // and hash the new password before storing it
    
    return;
  }
}

export const authApi = new AuthApiService();