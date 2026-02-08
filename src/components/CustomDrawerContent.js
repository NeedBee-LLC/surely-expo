import {usePathname, useRouter} from 'expo-router';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Drawer, withTheme} from 'react-native-paper';
import {useToken} from '../data/token';
import DownloadOnTheAppStoreButton from './DownloadOnTheAppStoreButton';

const IS_WEB = Platform.OS === 'web';

// Icon mappings for drawer items
const ICON_BY_ROUTE = {
  Available: 'clock-outline',
  Tomorrow: 'weather-night',
  Future: 'calendar-blank',
  Completed: 'checkbox-marked',
  Deleted: 'delete',
  Categories: 'tag',
  About: 'information-outline',
  'Sign in': 'login',
  'Sign up': 'account-plus',
};

// Map drawer items to their URL paths
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

// Drawer items when logged in
const LOGGED_IN_ROUTES = [
  'Available',
  'Tomorrow',
  'Future',
  'Completed',
  'Deleted',
  'Categories',
  'About',
];

// Drawer items when logged out
const LOGGED_OUT_ROUTES = ['Sign in', 'Sign up', 'About'];

function CustomDrawerContent({theme, ...props}) {
  const {isLoggedIn, clearToken} = useToken();
  const router = useRouter();
  const pathname = usePathname();

  const routes = isLoggedIn ? LOGGED_IN_ROUTES : LOGGED_OUT_ROUTES;

  // Determine if a route is active based on current pathname
  const isActive = routeName => {
    const routePath = ROUTE_PATH_MAP[routeName];
    // Match if pathname starts with the route path
    return pathname?.startsWith(routePath);
  };

  // Handle navigation to a route
  const handleNavigation = routeName => {
    const routePath = ROUTE_PATH_MAP[routeName];
    router.push(routePath);
  };

  async function signOut() {
    await clearToken();
    router.replace('/signin');
  }

  const scrollViewStyle = {
    backgroundColor: theme.colors.background,
  };

  return (
    <ScrollView style={scrollViewStyle} {...props}>
      {routes.map(routeName => (
        <Drawer.Item
          testID={`${routeName.toLowerCase()}-nav-button`}
          key={routeName}
          label={routeName}
          accessibilityLabel={routeName}
          icon={ICON_BY_ROUTE[routeName]}
          active={isActive(routeName)}
          onPress={() => handleNavigation(routeName)}
        />
      ))}
      {isLoggedIn && (
        <Drawer.Item
          testID="sign-out-button"
          label="Sign out"
          accessibilityLabel="Sign out"
          onPress={signOut}
        />
      )}
      {IS_WEB && (
        <View style={styles.appStoreButtonContainer}>
          <DownloadOnTheAppStoreButton />
        </View>
      )}
    </ScrollView>
  );
}

export default withTheme(CustomDrawerContent);

const styles = StyleSheet.create({
  appStoreButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});
