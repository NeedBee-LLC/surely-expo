import {UNSTABLE_CornerInset} from '@react-navigation/native';
import {StyleSheet, useColorScheme, View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {large, useBreakpoint} from '../breakpoints';
import {SURELY_GREEN} from '../useTheme';

const showDrawerToggleForBreakpoint = breakpoint => breakpoint !== large;

export default function NavigationBar({navigation, options, back}) {
  const breakpoint = useBreakpoint();
  const showDrawerToggle = showDrawerToggleForBreakpoint(breakpoint);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = useTheme();

  const lightHeaderStyle = {
    backgroundColor: SURELY_GREEN,
  };
  const headerStyle = colorScheme === 'light' ? lightHeaderStyle : null;

  // The corner inset has to sit outside Appbar.Header. Paper's Appbar renders
  // Appbar.BackAction in a dedicated first pass (renderOnly: ['Appbar.BackAction'])
  // before everything else, so no child of the Appbar can be placed ahead of the
  // back button. Instead we lay the inset beside the whole Appbar in a row, and
  // paint the row the same color so the reserved area matches the bar.
  const barColor =
    colorScheme === 'light' ? SURELY_GREEN : theme.colors.surface;

  return (
    <View style={[styles.row, {backgroundColor: barColor}]}>
      {showDrawerToggle && (
        <UNSTABLE_CornerInset direction="horizontal" edge="left" />
      )}
      <Appbar.Header style={[headerStyle, styles.bar]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  bar: {
    flex: 1,
  },
});
