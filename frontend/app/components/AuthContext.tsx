// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: (token: string, email: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
    
//     const token = localStorage.getItem('userToken');
//     setIsLoggedIn(!!token);
//   }, []);

//   const login = (token: string, email: string) => {
//     localStorage.setItem('userToken', token);
//     localStorage.setItem('userEmail', email);
//     setIsLoggedIn(true);
//     router.push('/dashboard');
//   };

//   const logout = () => {
//     localStorage.removeItem('userToken');
//     localStorage.removeItem('userEmail');
//     setIsLoggedIn(false);
//     router.push('/');
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// frontend/app/components/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, email: string, name?: string) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  }, []);

  const login = (token: string, email: string, name?: string) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userEmail', email);
    
    if (name) {
      localStorage.setItem('userName', name); 
    }
    
    setIsLoggedIn(true);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName'); 
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
