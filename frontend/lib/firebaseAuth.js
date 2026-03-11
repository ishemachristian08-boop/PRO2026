// Firebase Authentication Service
// Connects to Firebase Auth and Firestore for user roles
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Provider
const googleProvider = new GoogleAuthProvider();

// Get user role from Firestore
async function getUserRoleFromFirestore(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      // If role exists in Firestore, use it
      if (data.role) {
        return data.role;
      }
      // If email is in the document, check if it's admin
      if (data.email) {
        const adminEmails = ['admin@nca.rw', 'administrator@nca.rw'];
        if (adminEmails.includes(data.email.toLowerCase())) {
          return 'admin';
        }
      }
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
    let role = await getUserRoleFromFirestore(user.uid);
    
    // If no role in Firestore, check email for admin
    if (!role) {
      const adminEmails = ['admin@nca.rw', 'administrator@nca.rw'];
      if (adminEmails.includes(email.toLowerCase())) {
        role = 'admin';
        // Save role to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          role: 'admin',
          lastLogin: serverTimestamp(),
        }, { merge: true });
      } else {
        role = 'user';
        // Save user to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          role: 'user',
          lastLogin: serverTimestamp(),
        }, { merge: true });
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
    
    // Get or create user role in Firestore
    let role = await getUserRoleFromFirestore(user.uid);
    
    // If no role, check email for admin or create as user
    if (!role) {
      const adminEmails = ['admin@nca.rw', 'administrator@nca.rw'];
      if (adminEmails.includes(user.email?.toLowerCase())) {
        role = 'admin';
      } else {
        role = 'user';
      }
    }
    
    // Save/update user in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
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

// Register with Email & Password
export async function registerWithEmail(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Determine role based on email
    const adminEmails = ['admin@nca.rw', 'administrator@nca.rw'];
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';
    
    // Save user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName || email.split('@')[0],
      photoURL: null,
      role: role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    }, { merge: true });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: null,
        role: role
      }
    };
  } catch (error) {
    console.error('Firebase register error:', error);
    return {
      success: false,
      message: getErrorMessage(error.code)
    };
  }
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
      let role = await getUserRoleFromFirestore(user.uid);
      
      // Check email if no role found
      if (!role) {
        const adminEmails = ['admin@nca.rw', 'administrator@nca.rw'];
        if (adminEmails.includes(user.email?.toLowerCase())) {
          role = 'admin';
        } else {
          role = 'user';
        }
      }
      
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
      });
    } else {
      callback(null);
    }
  });
}

// Get all users (for admin management)
export async function getAllUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, users };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, message: error.message, users: [] };
  }
}

// Update user role (for admin)
export async function updateUserRole(uid, newRole) {
  try {
    await setDoc(doc(db, 'users', uid), {
      role: newRole,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: error.message };
  }
}

// Get error message
function getErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/popup-closed-by-user': 'Login was cancelled',
    'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method',
    'auth/network-request-failed': 'Network error. Please check your connection',
  };
  
  return messages[code] || 'An error occurred. Please try again.';
}
