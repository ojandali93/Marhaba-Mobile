import React, {createContext, useContext, useState} from 'react';

interface ProfileContextType {
  userProfile: any | null;
  matchProfiles: any[]; // List of other profiles (feed, explore, etc.)
  allProfiles: any[]; // Store all profiles fetched from DB
  setUserProfile: (profile: any) => void;
  setMatchProfiles: (profiles: any[]) => void;
  setAllProfiles: (profiles: any[]) => void; // Set all profiles at once
  addProfile: (profile: any) => void; // Add a single profile
  removeProfile: (profileId: string) => void; // Remove a profile by ID
  clearProfiles: () => void;
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Create the provider
export const ProfileProvider = ({children}: {children: React.ReactNode}) => {
  const [userProfile, setUserProfileState] = useState<any | null>(null);
  const [matchProfiles, setMatchProfilesState] = useState<any[]>([]);
  const [allProfiles, setAllProfilesState] = useState<any[]>([]); // New state for all profiles

  // Functions to update state
  const setUserProfile = (profile: any) => {
    setUserProfileState(profile);
  };

  const setMatchProfiles = (profiles: any[]) => {
    setMatchProfilesState(profiles);
  };

  // Function to set all profiles
  const setAllProfiles = (profiles: any[]) => {
    setAllProfilesState(profiles);
  };

  // Function to add a profile
  const addProfile = (profile: any) => {
    // Avoid duplicates based on ID, assuming profiles have an 'id' field
    setAllProfilesState(prevProfiles =>
      prevProfiles.some(p => p.id === profile.id)
        ? prevProfiles
        : [...prevProfiles, profile],
    );
  };

  // Function to remove a profile by ID
  const removeProfile = (profileId: string) => {
    setAllProfilesState(prevProfiles =>
      prevProfiles.filter(p => p.id !== profileId),
    );
  };

  const clearProfiles = () => {
    setUserProfileState(null);
    setMatchProfilesState([]);
    setAllProfilesState([]); // Clear all profiles state as well
  };

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        matchProfiles,
        allProfiles, // Provide the new state
        setUserProfile,
        setMatchProfiles,
        setAllProfiles, // Provide the new setter
        addProfile, // Provide the add function
        removeProfile, // Provide the remove function
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
