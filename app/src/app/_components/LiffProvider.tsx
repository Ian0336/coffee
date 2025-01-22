'use client'; // 標記為 Client Component

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import LiffContext from '../../contexts/LiffContext';
import { useRouter } from 'next/navigation';

const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>('noUser');
  const [displayName, setDisplayName] = useState<string | null>('noUser');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>('/coffee.png');

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // console.log(process.env.NEXT_PUBLIC_LIFF_ID);
        // console.log(process.env.NEXT_PUBLIC_ADMIN_PASSWORD);
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '', withLoginOnExternalBrowser: true});
        console.log('LIFF initialized successfully');

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setUserId(profile.userId);
          setDisplayName(profile.displayName);
          setProfilePictureUrl(profile.pictureUrl || null);
          console.log(profile);
        }else{
          //TEST
          router.push('/');
        }
      } catch (error) {
        console.error('LIFF initialization failed', error);
        router.push('/');
      }
    };

    initializeLiff();
  }, []);

  return (
    <LiffContext.Provider value={{ userId, displayName, profilePictureUrl }}>
      {children}
    </LiffContext.Provider>
  );
};

export default LiffProvider;