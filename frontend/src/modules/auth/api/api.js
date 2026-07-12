import axios from 'axios';

const MOCK_USERS = {
  'manager@transitops.local': {
    id: "development-user-1",
    name: "Fleet Manager",
    email: "manager@transitops.local",
    role: "FLEET_MANAGER"
  },
  'dispatcher@transitops.local': {
    id: "development-user-2",
    name: "Dispatcher",
    email: "dispatcher@transitops.local",
    role: "DISPATCHER"
  },
  'safety@transitops.local': {
    id: "development-user-3",
    name: "Safety Officer",
    email: "safety@transitops.local",
    role: "SAFETY_OFFICER"
  },
  'finance@transitops.local': {
    id: "development-user-4",
    name: "Financial Analyst",
    email: "finance@transitops.local",
    role: "FINANCIAL_ANALYST"
  },
  'admin@transitops.com': {
    id: "development-user",
    name: "TransitOps Manager",
    email: "admin@transitops.com",
    role: "FLEET_MANAGER"
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
      
      if (credentials.password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      const user = MOCK_USERS[credentials.email];
      
      if (user) {
        return {
          success: true,
          data: {
            user,
            token: "development-token"
          }
        };
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
