import ProfileScreen from "./screens/profile/ProfileScreen";
import CameraScreen from "./screens/camera/CameraScreen";

export const appRoutes = {
  Camera: {
    screen: CameraScreen,
    navigationOptions: {
      title: 'Camera',
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profile',
    },
  },
};