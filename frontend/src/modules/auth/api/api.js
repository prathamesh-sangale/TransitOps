import axios from 'axios';

// Mock data adapter for development - structured for easy replacement when backend is ready
const MOCK_AUTH_RESPONSE = {
  success: true,
  data: {
    user: {
      id: "development-user",
      name: "TransitOps Manager",
      email: "manager@transitops.local",
      role: "FLEET_MANAGER"
    },
    token: "development-token"
  }
};

const IS_MOCK = true; // Toggle this to false when backend is ready

export const authApi = {
  login: async (credentials) => {
    if (IS_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Basic validation simulation
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      if (credentials.email === 'admin@transitops.com' && credentials.password === 'password123') {
        return MOCK_AUTH_RESPONSE;
      }

      throw new Error('Invalid email or password');
    } else {
      // Real API call
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    }
  },
  
  logout: async () => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true };
    } else {
      const response = await axios.post('/api/auth/logout');
      return response.data;
    }
  }
};
