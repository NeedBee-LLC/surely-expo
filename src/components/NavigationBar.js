import {UNSTABLE_CornerInset} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {Appbar} from 'react-native-paper';
import {large, useBreakpoint} from '../breakpoints';
import {SURELY_GREEN} from '../useTheme';

const showDrawerToggleForBreakpoint = breakpoint => breakpoint !== large;

export default function NavigationBar({navigation, options, back}) {
  const breakpoint = useBreakpoint();
  const showDrawerToggle = showDrawerToggleForBreakpoint(breakpoint);
  const colorScheme = useColorScheme() ?? 'light';

  const lightHeaderStyle = {
    backgroundColor: SURELY_GREEN,
  };
  const headerStyle = colorScheme === 'light' ? lightHeaderStyle : null;

  return (
    <Appbar.Header style={headerStyle}>
      {showDrawerToggle && (
        <UNSTABLE_CornerInset direction="horizontal" edge="left" />
      )}
      {back ? (
        <Appbar.BackAction
          testID="back-button"
          onPress={navigation.goBack}
          accessibilityLabel="Back"
        />
      ) : null}
      <Appbar.Content title={options.title} />
      {showDrawerToggle && (
        <Appbar.Action
          testID="toggle-navigation-button"
          accessibilityLabel="Menu"
          icon="menu"
          onPress={navigation.toggleDrawer}
        />
      )}
    </Appbar.Header>
  );
}
