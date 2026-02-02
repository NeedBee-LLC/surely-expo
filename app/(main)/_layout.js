import {Drawer} from 'expo-router/drawer';
import {Redirect} from 'expo-router';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Drawer as PaperDrawer, withTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {large, useBreakpoint} from '../../src/breakpoints';
import {useToken} from '../../src/data/token';
import DownloadOnTheAppStoreButton from '../../src/components/DownloadOnTheAppStoreButton';

const IS_WEB = Platform.OS === 'web';

const ICON_BY_ROUTE = {
  'todos/available': 'clock-outline',
  'todos/tomorrow': 'weather-night',
  'todos/future': 'calendar-blank',
  'todos/completed': 'checkbox-marked',
  'todos/deleted': 'delete',
  categories: 'tag',
};

const ROUTE_LABELS = {
  'todos/available': 'Available',
  'todos/tomorrow': 'Tomorrow',
  'todos/future': 'Future',
  'todos/completed': 'Completed',
  'todos/deleted': 'Deleted',
  categories: 'Categories',
};

function CustomDrawerContent(props) {
  const {theme, state, navigation} = props;
  const {clearToken} = useToken();

  const containerStyle = {
    backgroundColor: theme.colors.background,
    flex: 1,
  };

  async function signOut() {
    await clearToken();
    navigation.navigate('/(auth)/signin');
  }

  // Get the currently active route
  const activeRouteName = state.routeNames[state.index];

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'left', 'right']}>
      <ScrollView>
        {state.routes.map((route, index) => {
          const routeName = route.name;
          const label = ROUTE_LABELS[routeName] || routeName;
          const icon = ICON_BY_ROUTE[routeName];
          const isActive = index === state.index;

          return (
            <PaperDrawer.Item
              testID={`${label.toLowerCase()}-nav-button`}
              key={route.key}
              label={label}
              accessibilityLabel={label}
              icon={icon}
              active={isActive}
              onPress={() => {
                navigation.navigate(routeName);
              }}
            />
          );
        })}
        <PaperDrawer.Item
          testID="sign-out-button"
          label="Sign out"
          onPress={signOut}
        />
        {IS_WEB && (
          <View style={styles.appStoreButtonContainer}>
            <DownloadOnTheAppStoreButton />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ThemedDrawerContent = withTheme(CustomDrawerContent);

export default function MainLayout() {
  const {isTokenLoaded, isLoggedIn} = useToken();
  const breakpoint = useBreakpoint();
  const drawerType = breakpoint === large ? 'permanent' : 'back';

  // Wait for token to load
  if (!isTokenLoaded) {
    return null;
  }

  // Redirect to signin if not logged in
  if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  }

  return (
    <Drawer
      drawerContent={props => <ThemedDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType,
        drawerStyle: {width: 220},
      }}
    >
      <Drawer.Screen
        name="todos/available"
        options={{
          drawerLabel: 'Available',
        }}
      />
      <Drawer.Screen
        name="todos/tomorrow"
        options={{
          drawerLabel: 'Tomorrow',
        }}
      />
      <Drawer.Screen
        name="todos/future"
        options={{
          drawerLabel: 'Future',
        }}
      />
      <Drawer.Screen
        name="todos/completed"
        options={{
          drawerLabel: 'Completed',
        }}
      />
      <Drawer.Screen
        name="todos/deleted"
        options={{
          drawerLabel: 'Deleted',
        }}
      />
      <Drawer.Screen
        name="categories"
        options={{
          drawerLabel: 'Categories',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  appStoreButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});
