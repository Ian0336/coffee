'use client'; // 標記為 Client Component

import { createContext, useContext, useState } from 'react';

type LiffContextType = {
  userId: string | null;
  displayName: string | null;
  profilePictureUrl: string | null;
};

const LiffContext = createContext<LiffContextType>({
  userId: null,
  displayName: null,
  profilePictureUrl: null,
});

export const useLiff = () => useContext(LiffContext);

export default LiffContext;