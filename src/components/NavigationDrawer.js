import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useRouter} from 'expo-router';
import {Platform, StyleSheet, View} from 'react-native';
import {Drawer, withTheme} from 'react-native-paper';
import {useToken} from '../data/token';
import DownloadOnTheAppStoreButton from './DownloadOnTheAppStoreButton';

const IS_WEB = Platform.OS === 'web';

function CustomNavigationDrawer({theme, iconByRoute, ...navProps}) {
  const {isLoggedIn, clearToken} = useToken();
  const router = useRouter();

  const scrollViewStyle = {
    backgroundColor: theme.colors.background,
  };

  async function signOut() {
    await clearToken();
    router.replace('/signin');
  }

  // Custom drawer items for todo sections
  const todoSections = [
    {name: 'Available', path: '/todos/available', icon: 'clock-outline'},
    {name: 'Tomorrow', path: '/todos/tomorrow', icon: 'weather-night'},
    {name: 'Future', path: '/todos/future', icon: 'calendar-blank'},
    {name: 'Completed', path: '/todos/completed', icon: 'checkbox-marked'},
    {name: 'Deleted', path: '/todos/deleted', icon: 'delete'},
  ];

  const getCurrentPath = () => {
    // Simple way to detect current path - in a real app you'd use usePathname or similar
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  };

  const currentPath = getCurrentPath();

  return (
    <DrawerContentScrollView style={scrollViewStyle} {...navProps}>
      {isLoggedIn ? (
        <>
          {todoSections.map(section => (
            <Drawer.Item
              testID={`${section.name.toLowerCase()}-nav-button`}
              key={section.path}
              label={section.name}
              accessibilityLabel={section.name}
              icon={section.icon}
              active={currentPath === section.path}
              onPress={() => router.push(section.path)}
            />
          ))}
          <Drawer.Item
            testID="categories-nav-button"
            label="Categories"
            accessibilityLabel="Categories"
            icon="tag"
            active={currentPath.startsWith('/categories')}
            onPress={() => router.push('/categories')}
          />
        </>
      ) : (
        <>
          <Drawer.Item
            testID="sign-in-nav-button"
            label="Sign in"
            accessibilityLabel="Sign in"
            icon="account"
            active={currentPath === '/signin'}
            onPress={() => router.push('/signin')}
          />
          <Drawer.Item
            testID="sign-up-nav-button"
            label="Sign up"
            accessibilityLabel="Sign up"
            icon="account-plus"
            active={currentPath === '/signup'}
            onPress={() => router.push('/signup')}
          />
        </>
      )}
      <Drawer.Item
        testID="about-nav-button"
        label="About"
        accessibilityLabel="About"
        icon="information"
        active={currentPath.startsWith('/about')}
        onPress={() => router.push('/about')}
      />
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
