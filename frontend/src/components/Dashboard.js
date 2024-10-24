import React, { useEffect, useState } from 'react';
import { auth } from '../pages/firebaseConfig'; // Adjust path accordingly
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <h1>Welcome, {user.displayName}</h1> : <h1>Please sign in</h1>}
    </div>
  );
};

export default Dashboard;
