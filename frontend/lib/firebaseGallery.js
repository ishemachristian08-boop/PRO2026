// Firebase Gallery Service
// Handles all Firestore operations for the gallery

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  where 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';

// Collection name
const GALLERY_COLLECTION = 'gallery';

// Gallery categories
export const GALLERY_CATEGORIES = [
  'Academics',
  'Co-curricular',
  'Christian Life',
  'Community',
  'Events'
];

// Category descriptions
export const CATEGORY_INFO = {
  'Academics': { description: 'Classroom learning and academic activities', icon: '📚' },
  'Co-curricular': { description: 'Sports, clubs, and extracurricular activities', icon: '🏃' },
  'Christian Life': { description: 'Prayer, worship, and spiritual activities', icon: "✝️" },
  'Community': { description: 'Parent meetings and community events', icon: '👨‍👩‍👧' },
  'Events': { description: 'Special events and ceremonies', icon: '🎉' }
};

// Upload image from device
export async function uploadImage(file, title, description = '', category = 'Academics') {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `gallery/${filename}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      title,
      description,
      category,
      imageUrl: downloadURL,
      storagePath: `gallery/${filename}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      id: docRef.id,
      imageUrl: downloadURL
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Add image from URL
export async function addImageFromURL(imageUrl, title, description = '', category = 'Academics') {
  try {
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      title,
      description,
      category,
      imageUrl,
      storagePath: null, // No storage path for URL images
      isUrl: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      id: docRef.id,
      imageUrl
    };
  } catch (error) {
    console.error('Error adding image from URL:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Get all images
export async function getAllImages() {
  try {
    const q = query(collection(db, GALLERY_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      });
    });
    
    return { success: true, images };
  } catch (error) {
    console.error('Error getting images:', error);
    return {
      success: false,
      message: error.message,
      images: []
    };
  }
}

// Get images by category
export async function getImagesByCategory(category) {
  try {
    const q = query(
      collection(db, GALLERY_COLLECTION), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
      });
    });
    
    return { success: true, images };
  } catch (error) {
    console.error('Error getting images by category:', error);
    return {
      success: false,
      message: error.message,
      images: []
    };
  }
}

// Get images grouped by category
export async function getImagesGroupedByCategory() {
  try {
    const result = await getAllImages();
    if (!result.success) return result;
    
    const grouped = {};
    GALLERY_CATEGORIES.forEach(cat => {
      grouped[cat] = [];
    });
    
    result.images.forEach(image => {
      const category = image.category || 'Academics';
      if (grouped[category]) {
        grouped[category].push(image);
      } else {
        grouped['Academics'].push(image);
      }
    });
    
    return { success: true, grouped };
  } catch (error) {
    console.error('Error grouping images:', error);
    return { success: false, message: error.message, grouped: {} };
  }
}

// Get single image
export async function getImage(imageId) {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, imageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        image: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: false,
        message: 'Image not found'
      };
    }
  } catch (error) {
    console.error('Error getting image:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Update image
export async function updateImage(imageId, updates) {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, imageId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating image:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Delete image
export async function deleteImage(imageId) {
  try {
    // Get the image first to check if it has a storage path
    const imageData = await getImage(imageId);
    
    if (imageData.success && imageData.image.storagePath) {
      // Delete from Storage
      const storageRef = ref(storage, imageData.image.storagePath);
      await deleteObject(storageRef);
    }
    
    // Delete from Firestore
    const docRef = doc(db, GALLERY_COLLECTION, imageId);
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      message: error.message
    };
  }
}
