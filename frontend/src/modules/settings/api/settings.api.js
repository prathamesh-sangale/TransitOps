const IS_MOCK = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockProfile = {
  name: 'Marcus Thorne',
  role: 'System Admin', // Real role is mapped from AuthContext, this is for display
  email: 'marcus.t@transitops.io',
  loginActivity: '2 minutes ago',
  mfaStatus: 'Active',
  teamMembers: 24,
  accessRoles: 8
};

export const settingsApi = {
  getProfileSettings: async () => {
    if (IS_MOCK) {
      await delay(500);
      return { success: true, data: mockProfile };
    }
    // Future real API call
  }
};
