import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Dimensions,
  SafeAreaView,
  Modal,
  Image
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
<<<<<<< HEAD
import * as ImagePicker from 'expo-image-picker';
=======
>>>>>>> main
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { predict_location } from '../../utils/imageUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import LoadingScreen from '../../common/components/LoadingScreen';
import { fetchCountries, fetchProfile } from '../../store/profile/profileSlice';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
<<<<<<< HEAD
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For testing, set to true
=======
>>>>>>> main
  const cameraRef = useRef<CameraView>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    (async () => {
      if (!mediaLibraryPermission?.granted) {
        await requestMediaLibraryPermission();
      }
      // Request image picker permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Media library permission not granted');
      }
    })();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          setCapturedPhoto(photo.uri);
          setShowPhotoModal(true);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  }

<<<<<<< HEAD
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setShowUploadModal(true);
    }
  }

  async function handleConfirmPhoto() {
    if (capturedPhoto && user) {
      try {
        setIsLoading(true);
        setShowPhotoModal(false); // Hide the photo modal
        
        // Convert the image URI to a File object
        const response = await fetch(capturedPhoto);
        const blob = await response.blob();
        const file = new File([blob], `captured_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Process with AI and save to Firebase
        await predict_location(file, user);
        
        // Save to device gallery if permission granted
        if (mediaLibraryPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(capturedPhoto);
        }
        
        setIsLoading(false);
        Alert.alert('Success', 'Photo processed and saved successfully!');
        
        // Refresh profile data
        dispatch(fetchProfile(user.id));
        dispatch(fetchCountries(user.id));
        
        setCapturedPhoto(null);
      } catch (error) {
        setIsLoading(false);
        console.error('Error processing photo:', error);
        Alert.alert('Error', 'Failed to process photo');
      }
    }
  }

  function handleCancelPhoto() {
    setShowPhotoModal(false);
    setCapturedPhoto(null);
  }

    async function handleConfirmUpload() {
    if (selectedImage && user) {
      try {
        setIsLoading(true);
        setShowUploadModal(false); // Hide the upload modal
        
        // Convert the image URI to a File object
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Now pass the File object and user to your prediction function
        await predict_location(file, user);
        
        setIsLoading(false);
        Alert.alert('Success', 'Image uploaded successfully!');
        dispatch(fetchProfile(user.id));
        dispatch(fetchCountries(user.id));
        setSelectedImage(null);
      } catch (error) {
        setIsLoading(false);
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image');
      }
    }
  }

  function handleCancelUpload() {
    setShowUploadModal(false);
    setSelectedImage(null);
=======
  function handleConfirmPhoto() {
    // For now, both confirm and cancel do the same thing
    handleCancelPhoto();
  }

  function handleCancelPhoto() {
    setCapturedPhoto(null);
    setShowPhotoModal(false);
>>>>>>> main
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      />
      
<<<<<<< HEAD
      {/* Top Right Controls */}
      <View style={styles.topRightControls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={pickImage}
        >
          <Ionicons name="cloud-upload" size={24} color="white" />
        </TouchableOpacity>
      </View>
=======
      {/* Top Right Switch Button */}
      <TouchableOpacity 
        style={styles.flipButton} 
        onPress={toggleCameraFacing}
      >
        <Ionicons name="camera-reverse" size={24} color="white" />
      </TouchableOpacity>
>>>>>>> main
      
      {/* Camera Controls Overlay */}
      <View style={styles.controlsOverlay}>
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={takePicture}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>

      {/* Photo Confirmation Modal */}
      <Modal
        visible={showPhotoModal}
<<<<<<< HEAD
        transparent={true}
        animationType="fade"
=======
        animationType="fade"
        transparent={true}
>>>>>>> main
        onRequestClose={handleCancelPhoto}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
<<<<<<< HEAD
            <Text style={styles.modalTitle}>Photo Preview</Text>
            {capturedPhoto && (
              <Image 
                source={{ uri: capturedPhoto }} 
                style={styles.previewImage}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
=======
            {capturedPhoto && (
              <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
>>>>>>> main
                onPress={handleCancelPhoto}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
<<<<<<< HEAD
                style={styles.confirmButton}
=======
                style={styles.confirmButton} 
>>>>>>> main
                onPress={handleConfirmPhoto}
              >
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
<<<<<<< HEAD

      {/* Upload Confirmation Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelUpload}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Image</Text>
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.previewImage}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelUpload}
              >
                <Ionicons name="close" size={40} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmUpload}
              >
                <Ionicons name="checkmark" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Screen */}
      <LoadingScreen 
        visible={isLoading} 
        message="Analyzing image..."
      />
=======
>>>>>>> main
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: theme.spacing.large,
    color: theme.colors.background,
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.primary,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.primaryBold,
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  
  // Camera Controls Overlay
  controlsOverlay: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
  },

<<<<<<< HEAD
  // Top Controls
  topRightControls: {
    position: 'absolute',
    top: 60, // Account for status bar
    right: theme.spacing.large,
    gap: theme.spacing.extraLarge,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

=======
>>>>>>> main
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: theme.spacing.large,
    resizeMode: 'contain',
  },
<<<<<<< HEAD
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontFamily: theme.fontFamilies.primaryBold,
    color: 'white',
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
=======
>>>>>>> main
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    gap: theme.spacing.large,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.error,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
<<<<<<< HEAD
});



//TODO

// Need to remove duplicates from countries list
// Need to show loading screen during upload (its a bit slow)
// Need to test camera and upload (probably with test on actual physical device)
=======
  buttonText: {
    color: 'white',
    fontSize: theme.fontSizes.small,
    fontFamily: theme.fontFamilies.primary,
    marginLeft: theme.spacing.small,
  },
});
>>>>>>> main
