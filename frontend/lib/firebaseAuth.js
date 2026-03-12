// Firebase Authentication Service
// Admin emails list - emails that will be granted admin role
const ADMIN_EMAILS = [
  'ishemachristian08@gmail.com'
];

// Staff/Teacher emails list
const STAFF_EMAILS = [
  'ishemachristian08@gmail.com'
];

// Check if email is in admin list
function isAdminEmail(email) {
  return ADMIN_EMAILS.some(adminEmail => 
    email.toLowerCase() === adminEmail.toLowerCase()
  );
}

// Check if email is in staff list
function isStaffEmail(email) {
  return STAFF_EMAILS.some(staffEmail => 
    email.toLowerCase() === staffEmail.toLowerCase()
  ) || isAdminEmail(email);
}
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Get user role from Firestore
export async function getUserRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Login with Email & Password
export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Get user role from Firestore
    let role = await getUserRole(user.uid);
    
    // If no role in Firestore, check admin/staff email list
    if (!role) {
      if (isAdminEmail(user.email)) {
        role = 'admin';
        // Create/update user record in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || 'Admin',
          role: 'admin',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }, { merge: true });
      } else if (isStaffEmail(user.email)) {
        role = 'teacher';
        // Create/update user record in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || 'Teacher',
          role: 'teacher',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }, { merge: true });
      } else {
        await signOut(auth);
        return {
          success: false,
          message: 'Access denied. Your account is not registered in the system.'
        };
      }
    }
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role
      }
    };
  } catch (error) {
    console.error('Firebase login error:', error);
    return {
      success: false,
      message: getErrorMessage(error.code)
    };
  }
}

// Login with Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get user role from Firestore
    let role = await getUserRole(user.uid);
    
    // If no role in Firestore, check admin/staff email list
    if (!role) {
      if (isAdminEmail(user.email)) {
        role = 'admin';
      } else if (isStaffEmail(user.email)) {
        role = 'teacher';
      } else {
        await signOut(auth);
        return {
          success: false,
          message: 'Access denied. Your Google account is not registered in the system.'
        };
      }
    }
    
    // Update user in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName || (role === 'admin' ? 'Admin' : 'Teacher'),
      role: role,
      lastLogin: serverTimestamp(),
    }, { merge: true });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role
      }
    };
  } catch (error) {
    console.error('Firebase Google login error:', error);
    return {
      success: false,
      message: getErrorMessage(error.code)
    };
  }
}

// Register new user (disabled for admin - only Firestore admin can create users)
export async function registerWithEmail(email, password, displayName) {
  return {
    success: false,
    message: 'User registration is disabled. Contact the administrator.'
  };
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase logout error:', error);
    return {
      success: false,
      message: getErrorMessage(error.code)
    };
  }
}

// Auth state observer - returns user with role from Firestore
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get role from Firestore
      const role = await getUserRole(user.uid);
      
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role || 'user',
      });
    } else {
      callback(null);
    }
  });
}

// Check if user is admin
export async function checkAdminAccess(uid) {
  const role = await getUserRole(uid);
  return role === 'admin';
}

// Get error message
function getErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/popup-closed-by-user': 'Login was cancelled',
    'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method',
    'auth/network-request-failed': 'Network error. Please check your connection',
  };
  
  return messages[code] || 'An error occurred. Please try again.';
}
