import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useRouter} from 'expo-router';
import {Platform, StyleSheet, View} from 'react-native';
import {Drawer, withTheme} from 'react-native-paper';
import {useToken} from '../data/token';
import DownloadOnTheAppStoreButton from './DownloadOnTheAppStoreButton';

const IS_WEB = Platform.OS === 'web';

// Map drawer route names to their URL paths
const ROUTE_PATH_MAP = {
  Available: '/todos/available',
  Tomorrow: '/todos/tomorrow',
  Future: '/todos/future',
  Completed: '/todos/completed',
  Deleted: '/todos/deleted',
  Categories: '/categories',
  About: '/about',
  'Sign in': '/signin',
  'Sign up': '/signup',
};

function CustomNavigationDrawer({theme, iconByRoute, ...navProps}) {
  const {state} = navProps;
  const {isLoggedIn, clearToken} = useToken();
  const router = useRouter();

  const isSelected = index => index === state.index;

  const scrollViewStyle = {
    backgroundColor: theme.colors.background,
  };

  async function signOut() {
    await clearToken();
    router.push('/signin');
  }

  return (
    <DrawerContentScrollView style={scrollViewStyle} {...navProps}>
      {state.routes.map((route, index) => (
        <Drawer.Item
          testID={`${route.name.toLowerCase()}-nav-button`}
          key={route.key}
          label={route.name}
          accessibilityLabel={route.name}
          icon={iconByRoute[route.name]}
          active={isSelected(index)}
          onPress={() => router.push(ROUTE_PATH_MAP[route.name])}
        />
      ))}
      {isLoggedIn && (
        <Drawer.Item
          testID="sign-out-button"
          label="Sign out"
          onPress={signOut}
        />
      )}
      {IS_WEB && (
        <View style={styles.appStoreButtonContainer}>
          <DownloadOnTheAppStoreButton />
        </View>
      )}
    </DrawerContentScrollView>
  );
}

export default withTheme(CustomNavigationDrawer);

const styles = StyleSheet.create({
  appStoreButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});
