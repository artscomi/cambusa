import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export const useSaveUser = () => {
  const { user } = useUser();

  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/save-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.fullName,
            email: user.emailAddresses[0].emailAddress,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save user');
        }

        const data = await response.json();
        console.log('User saved to database:');
      } catch (error) {
        console.error('Error saving user:', error);
      }
    };

    saveUser();
  }, [user]);
};
