import React, { createContext, useContext, useState } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setEditMode: (isActive: boolean) => void;
  toggleEditMode: () => void;
  adminPassword: string | null;
  setAdminPassword: (password: string | null) => void;
  isPasswordDialogOpen: boolean;
  setPasswordDialogOpen: (isOpen: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(
  undefined
);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [isPasswordDialogOpen, setPasswordDialogOpen] =
    useState<boolean>(false);

  const setEditMode = (isActive: boolean) => {
    setIsEditMode(isActive);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setAdminPassword(null);
    } else {
      setPasswordDialogOpen(true);
    }
  };

  const value = {
    isEditMode,
    setEditMode,
    toggleEditMode,
    adminPassword,
    setAdminPassword,
    isPasswordDialogOpen,
    setPasswordDialogOpen,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = (): EditModeContextType => {
  const context = useContext(EditModeContext);

  if (context === undefined) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }

  return context;
};
