import {useNavigation} from 'expo-router';
import {useColorScheme} from 'react-native';
import {Appbar} from 'react-native-paper';
import {large, useBreakpoint} from '../breakpoints';
import {SURELY_GREEN} from '../useTheme';

const showDrawerToggleForBreakpoint = breakpoint => breakpoint !== large;

// NavigationBar component for Expo Router
// Props:
// - title: string - The title to display
// - canGoBack: boolean - Whether to show the back button
export default function NavigationBar({title, canGoBack}) {
  const navigation = useNavigation();
  const breakpoint = useBreakpoint();
  const showDrawerToggle = showDrawerToggleForBreakpoint(breakpoint);
  const colorScheme = useColorScheme() ?? 'light';

  const lightHeaderStyle = {
    backgroundColor: SURELY_GREEN,
  };
  const headerStyle = colorScheme === 'light' ? lightHeaderStyle : null;

  // Access drawer toggle from navigation
  const toggleDrawer = () => {
    if (navigation.toggleDrawer) {
      navigation.toggleDrawer();
    } else if (navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Appbar.Header style={headerStyle}>
      {canGoBack ? (
        <Appbar.BackAction
          testID="back-button"
          onPress={goBack}
          accessibilityLabel="Back"
        />
      ) : null}
      <Appbar.Content title={title} />
      {showDrawerToggle && (
        <Appbar.Action
          testID="toggle-navigation-button"
          accessibilityLabel="Menu"
          icon="menu"
          onPress={toggleDrawer}
        />
      )}
    </Appbar.Header>
  );
}
