// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { authApi } from '../../api/authApi';
// import type { AuthResponse, LoginRequest, SignUpRequest, User } from '../../types';

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   isHydrated: boolean; // ✅ ADD THIS
//   error: string | null;
// }


// const initialState: AuthState = {
//   user: null,
//   token: localStorage.getItem('authToken'),
//   isAuthenticated: false,   // ❗ important
//   isLoading: false,
//   isHydrated: false,        // ✅ ADD
//   error: null,
// };


// // Async thunks
// export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       console.log("[Thunk] 1. Calling API...");
//       const response = await authApi.login(credentials);
      
//       console.log("[Thunk] 2. API Success!", response); // Check if 'token' is visible here

//       if (!response.token) {
//           console.error("[Thunk] ❌ RESPONSE HAS NO TOKEN!", response);
//           throw new Error("Server response missing token");
//       }

//       // Save token to localStorage
//       localStorage.setItem('authToken', response.token);
//       console.log("[Thunk] 3. Token Saved to Storage:", localStorage.getItem('authToken'));

//       localStorage.setItem('user', JSON.stringify({
//         id: response.id,
//         name: response.name,
//         email: response.email,
//         role: response.role,
//       }));
      
//       return response;
//     } catch (error: any) {
//       console.error("[Thunk] ❌ ERROR:", error);
//       return rejectWithValue(error.message || 'Login failed');
//     }
//   }
// );

// export const signup = createAsyncThunk<AuthResponse, SignUpRequest, { rejectValue: string }>(
//   'auth/signup',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await authApi.signup(userData);
      
//       // Save token to localStorage
//       localStorage.setItem('authToken', response.token);
//       localStorage.setItem('user', JSON.stringify({
//         id: response.id,
//         name: response.name,
//         email: response.email,
//         role: response.role,
//       }));
      
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Signup failed');
//     }
//   }
// );

// export const logout = createAsyncThunk('auth/logout', async () => {
//   try {
//     await authApi.logout();
//   } catch (error) {
//     console.error('Logout API call failed', error);
//   } finally {
//     // Always clear localStorage even if API fails
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     loadUserFromStorage: (state) => {
//       const token = localStorage.getItem('authToken');
//       const userStr = localStorage.getItem('user');

//       if (token && userStr) {
//         state.token = token;
//         state.user = JSON.parse(userStr);
//         state.isAuthenticated = true;
//       } else {
//         state.isAuthenticated = false;
//       }

//       state.isHydrated = true; // ✅ THIS FIXES YOUR ISSUE
//     },

//   },
//   extraReducers: (builder) => {
//     // Login
//     builder
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.token = action.payload.token;
//         state.user = {
//           id: action.payload.id,
//           name: action.payload.name,
//           email: action.payload.email,
//           role: action.payload.role as 'ADMIN' | 'CUSTOMER',
//           isActive: true,
//         };
//         state.error = null;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Login failed';
//       });

//     // Signup
//     builder
//       .addCase(signup.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.token = action.payload.token;
//         state.user = {
//           id: action.payload.id,
//           name: action.payload.name,
//           email: action.payload.email,
//           role: action.payload.role as 'ADMIN' | 'CUSTOMER',
//           isActive: true,
//         };
//         state.error = null;
//       })
//       .addCase(signup.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload || 'Signup failed';
//       });

//     // Logout
//     builder.addCase(logout.fulfilled, (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.isLoading = false;
//       state.error = null;
//     });
//   },
// });

// export const { clearError, loadUserFromStorage } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import type { AuthResponse, LoginRequest, SignUpRequest, User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean; // ✅ already present
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  isLoading: true,        // 🔧 CHANGE: MUST start as true
  isHydrated: false,      // ✅ already correct
  error: null,
};

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("[Thunk] 1. Calling API...");
      const response = await authApi.login(credentials);

      console.log("[Thunk] 2. API Success!", response);

      if (!response.token) {
        console.error("[Thunk] ❌ RESPONSE HAS NO TOKEN!", response);
        throw new Error("Server response missing token");
      }

      localStorage.setItem('authToken', response.token);
      console.log("[Thunk] 3. Token Saved:", localStorage.getItem('authToken'));

      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      }));

      return response;
    } catch (error: any) {
      console.error("[Thunk] ❌ ERROR:", error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk<AuthResponse, SignUpRequest, { rejectValue: string }>(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(userData);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      }));

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Logout API call failed', error);
  } finally {
    // 🔥 Clear auth storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // 🔥 Clear cart storage
    localStorage.removeItem('cart');
    localStorage.removeItem('styliste_cart');
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    /** Call this when token expires (401) - clears state without API call */
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isHydrated = true;
      state.error = null;
    },

    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        state.token = token;
        state.user = JSON.parse(userStr);
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }

      state.isHydrated = true; // 🔧 CHANGE: hydration completes here
      state.isLoading = false; // 🔧 CHANGE: stop loading AFTER hydration
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role as 'ADMIN' | 'CUSTOMER',
          isActive: true,
        };
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role as 'ADMIN' | 'CUSTOMER',
          isActive: true,
        };
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Signup failed';
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isHydrated = true; // 🔧 CHANGE: hydration still complete
      state.error = null;
    });
  },
});

export const { clearError, loadUserFromStorage, forceLogout } = authSlice.actions;
export default authSlice.reducer;
