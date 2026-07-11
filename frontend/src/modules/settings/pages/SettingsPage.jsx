import { useState, useEffect } from 'react';
import { settingsApi } from '../api/settings.api';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Loader2, Mail, Verified, Users, Shield, UserCog, Settings2, Bell, ShieldCheck, UserPlus } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useAuth(); // Contains actual authenticated role
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await settingsApi.getProfileSettings();
        if (result.success) {
          setProfile(result.data);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings Overview</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your personal preferences, team members, and enterprise system configurations.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Primary Card: User Profile Summary */}
        <div className="lg:col-span-8 bg-surface rounded-xl border border-border-subtle p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-primary-soft opacity-50 rounded-l-full -mr-20 pointer-events-none group-hover:bg-primary-soft transition-colors duration-500" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10 w-full">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-surface-secondary shadow-md border-4 border-surface flex items-center justify-center text-4xl font-bold text-primary">
                {profile.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center border-2 border-surface shadow-sm">
                <Verified className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-text-primary">{profile.name}</h3>
                <span className="bg-primary-soft text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {user?.role || profile.role}
                </span>
              </div>
              <p className="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-2 mb-6">
                <Mail className="w-4 h-4" /> {profile.email}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Button>Edit Profile</Button>
                <Button variant="outline">Security Settings</Button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-3 text-right relative z-10 mt-6 sm:mt-0">
            <div className="p-3 bg-surface-secondary rounded-xl border border-border-subtle w-40">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">Login Activity</p>
              <p className="text-sm font-bold text-text-primary">{profile.loginActivity}</p>
            </div>
            <div className="p-3 bg-surface-secondary rounded-xl border border-border-subtle w-40">
              <p className="text-xs font-bold text-text-secondary uppercase mb-1">MFA Status</p>
              <div className="flex items-center justify-end gap-1 text-success">
                <ShieldCheck className="w-4 h-4" />
                <p className="text-sm font-bold">{profile.mfaStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stats / Quick Info */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Active Team</p>
              <h4 className="text-xl font-bold text-text-primary">{profile.teamMembers} Users</h4>
            </div>
          </div>
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Access Roles</p>
              <h4 className="text-xl font-bold text-text-primary">{profile.accessRoles} Defined</h4>
            </div>
          </div>
        </div>

        {/* Navigation Cards Grid */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          
          <div className="group bg-surface border border-border-subtle rounded-xl p-6 shadow-sm hover:border-primary transition-all cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <UserCog className="w-6 h-6" />
              </div>
            </div>
            <h5 className="text-lg font-bold text-text-primary mb-2">My Profile</h5>
            <p className="text-sm text-text-secondary mb-6 flex-1">Update your personal details, change your password, and manage your display preferences.</p>
          </div>

          <div className="group bg-surface border border-border-subtle rounded-xl p-6 shadow-sm hover:border-primary transition-all cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
            <h5 className="text-lg font-bold text-text-primary mb-2">User Management</h5>
            <p className="text-sm text-text-secondary mb-6 flex-1">Add or remove team members, assign operational roles, and audit access logs.</p>
          </div>

          <div className="group bg-surface border border-border-subtle rounded-xl p-6 shadow-sm hover:border-primary transition-all cursor-pointer flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <Settings2 className="w-6 h-6" />
              </div>
            </div>
            <h5 className="text-lg font-bold text-text-primary mb-2">System Preferences</h5>
            <p className="text-sm text-text-secondary mb-6 flex-1">Configure global operational defaults, localization, and notification rules.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
