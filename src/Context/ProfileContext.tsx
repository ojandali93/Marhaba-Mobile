import React, {createContext, useContext, useState} from 'react';

interface ProfileContextType {
  userProfile: any | null;
  matchProfiles: any[]; // List of other profiles (feed, explore, etc.)
  setUserProfile: (profile: any) => void;
  setMatchProfiles: (profiles: any[]) => void;
  clearProfiles: () => void;
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Create the provider
export const ProfileProvider = ({children}: {children: React.ReactNode}) => {
  const [userProfile, setUserProfileState] = useState<any | null>(null);
  const [matchProfiles, setMatchProfilesState] = useState<any[]>([]);

  // Functions to update state
  const setUserProfile = (profile: any) => {
    setUserProfileState(profile);
  };

  const setMatchProfiles = (profiles: any[]) => {
    setMatchProfilesState(profiles);
  };

  const clearProfiles = () => {
    setUserProfileState(null);
    setMatchProfilesState([]);
  };

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        matchProfiles,
        setUserProfile,
        setMatchProfiles,
        clearProfiles,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Create a custom hook to use it
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
