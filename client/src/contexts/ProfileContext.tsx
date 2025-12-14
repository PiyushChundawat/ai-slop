import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { ProfileType } from "@shared/schema";

interface ProfileContextType {
  profile: ProfileType;
  setProfile: (profile: ProfileType) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileType>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedProfile");
      return (saved as ProfileType) || "piyush";
    }
    return "piyush";
  });

  useEffect(() => {
    localStorage.setItem("selectedProfile", profile);
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
