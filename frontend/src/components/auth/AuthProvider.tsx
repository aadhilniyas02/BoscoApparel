// "use client"

// import { createContext, useContext, useEffect, useState, ReactNode } from "react"
// import { useRouter } from "next/navigation"

// interface User {
//   email: string
//   role: string
//   name: string
// }

// interface AuthContextType {
//   user: User | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
//   hasRole: (role: string) => boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// interface AuthProviderProps {
//   children: ReactNode
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     // Check if user is already logged in
//     const checkAuth = () => {
//       const userAuth = localStorage.getItem("userAuth")
//       const userEmail = localStorage.getItem("userEmail")
//       const userRole = localStorage.getItem("userRole")
//       const userName = localStorage.getItem("userName")

//       if (userAuth === "true" && userEmail && userRole && userName) {
//         setUser({
//           email: userEmail,
//           role: userRole,
//           name: userName
//         })
//       }
//       setIsLoading(false)
//     }

//     checkAuth()
//   }, [])

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       // Mock authentication - replace with actual API call
//       const mockUsers = [
//         { email: "admin@example.com", password: "admin123", role: "admin", name: "Admin User" },
//         { email: "user@example.com", password: "user123", role: "user", name: "Regular User" },
//         { email: "manager@example.com", password: "manager123", role: "manager", name: "Manager User" }
//       ]

//       const foundUser = mockUsers.find(u => u.email === email && u.password === password)
      
//       if (foundUser) {
//         const userData = {
//           email: foundUser.email,
//           role: foundUser.role,
//           name: foundUser.name
//         }

//         // Store in localStorage
//         localStorage.setItem("userAuth", "true")
//         localStorage.setItem("userEmail", userData.email)
//         localStorage.setItem("userRole", userData.role)
//         localStorage.setItem("userName", userData.name)

//         setUser(userData)
//         return true
//       }
//       return false
//     } catch (error) {
//       console.error("Login error:", error)
//       return false
//     }
//   }

//   const logout = () => {
//     // Clear localStorage
//     localStorage.removeItem("userAuth")
//     localStorage.removeItem("userEmail")
//     localStorage.removeItem("userRole")
//     localStorage.removeItem("userName")

//     setUser(null)
//     router.push("/login")
//   }

//   const hasRole = (role: string): boolean => {
//     return user?.role === role
//   }

//   const isAuthenticated = !!user

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isAuthenticated,
//       isLoading,
//       login,
//       logout,
//       hasRole
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
