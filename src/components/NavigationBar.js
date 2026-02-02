import {useNavigation, useRouter} from 'expo-router';
import {useColorScheme} from 'react-native';
import {Appbar} from 'react-native-paper';
import {large, useBreakpoint} from '../breakpoints';
import {SURELY_GREEN} from '../useTheme';

const showDrawerToggleForBreakpoint = breakpoint => breakpoint !== large;

export default function NavigationBar({navigation, options, back}) {
  const router = useRouter();
  const nav = useNavigation();
  const breakpoint = useBreakpoint();
  const showDrawerToggle = showDrawerToggleForBreakpoint(breakpoint);
  const colorScheme = useColorScheme() ?? 'light';

  const lightHeaderStyle = {
    backgroundColor: SURELY_GREEN,
  };
  const headerStyle = colorScheme === 'light' ? lightHeaderStyle : null;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleToggleDrawer = () => {
    // For Expo Router drawer, use the navigation object from the drawer
    if (nav?.toggleDrawer) {
      nav.toggleDrawer();
    }
  };

  return (
    <Appbar.Header style={headerStyle}>
      {back ? (
        <Appbar.BackAction
          testID="back-button"
          onPress={handleBack}
          accessibilityLabel="Back"
        />
      ) : null}
      <Appbar.Content title={options.title} />
      {showDrawerToggle && (
        <Appbar.Action
          testID="toggle-navigation-button"
          accessibilityLabel="Menu"
          icon="menu"
          onPress={handleToggleDrawer}
        />
      )}
    </Appbar.Header>
  );
}
