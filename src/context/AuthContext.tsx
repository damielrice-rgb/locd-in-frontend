import { createContext, useContext, useState} from 'react';

// This describe what Auth Context will store
interface AuthContextType {
  token: string | null
  loginUser: (token: string) => void
  logout: () => void
};

// Create our Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Provies auth info to the rest of the app
export function AuthProvider({children}: {children: React.ReactNode}) {

  // Get token from localStorage when app starts 
  const [token, setToken] = useState<string | null>(localStorage.getItem('token')
)

// Save the users token
function loginUser(newToken: string) {
  localStorage.setItem('token', newToken)
  setToken(newToken)
}

// Remove the user's token when they log out
function logout() {
  localStorage.removeItem('token')
  setToken(null)
}

return (
  <AuthContext.Provider
  value={{
    token,
    loginUser,
    logout,
  }}
  >
    {children}
  </AuthContext.Provider>
)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if(!context) {
    throw new Error('useAuth must be inside AuthProvider')
  }

  return context
}

