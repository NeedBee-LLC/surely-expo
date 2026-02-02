import {Drawer} from 'expo-router/drawer';
import {Redirect} from 'expo-router';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Drawer as PaperDrawer, withTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {large, useBreakpoint} from '../../src/breakpoints';
import {useToken} from '../../src/data/token';
import NavigationBar from '../../src/components/NavigationBar';
import DownloadOnTheAppStoreButton from '../../src/components/DownloadOnTheAppStoreButton';

const IS_WEB = Platform.OS === 'web';

function CustomDrawerContent(props) {
  const {theme, state, navigation} = props;

  const containerStyle = {
    backgroundColor: theme.colors.background,
    flex: 1,
  };

  return (
    <SafeAreaView style={containerStyle} edges={['top', 'left', 'right']}>
      <ScrollView>
        {state.routes.map((route, index) => {
          const routeName = route.name;
          let label = routeName;
          if (routeName === 'signin') label = 'Sign in';
          if (routeName === 'signup') label = 'Sign up';
          
          const isActive = index === state.index;

          return (
            <PaperDrawer.Item
              testID={`${label.toLowerCase()}-nav-button`}
              key={route.key}
              label={label}
              accessibilityLabel={label}
              active={isActive}
              onPress={() => {
                navigation.navigate(routeName);
              }}
            />
          );
        })}
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

export default function AuthLayout() {
  const {isTokenLoaded, isLoggedIn} = useToken();
  const breakpoint = useBreakpoint();
  const drawerType = breakpoint === large ? 'permanent' : 'back';

  // Wait for token to load
  if (!isTokenLoaded) {
    return null;
  }

  // If already logged in, redirect to main app
  if (isLoggedIn) {
    return <Redirect href="/todos/available" />;
  }

  return (
    <Drawer
      drawerContent={props => <ThemedDrawerContent {...props} />}
      screenOptions={{
        header: props => <NavigationBar {...props} />,
        drawerType,
        drawerStyle: {width: 220},
      }}
    >
      <Drawer.Screen
        name="signin"
        options={{
          title: 'Sign in',
          drawerLabel: 'Sign in',
        }}
      />
      <Drawer.Screen
        name="signup"
        options={{
          title: 'Sign up',
          drawerLabel: 'Sign up',
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
