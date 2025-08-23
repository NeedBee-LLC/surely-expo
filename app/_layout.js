import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {en, registerTranslation} from 'react-native-paper-dates';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {Platform} from 'react-native';
import {Drawer} from 'expo-router/drawer';
import {useToken, TokenProvider} from '../src/data/token';
import useTheme from '../src/useTheme';
import ScreenBackground from '../src/components/ScreenBackground';
import TokenLoadBuffer from '../src/components/TokenLoadBuffer';
import CustomNavigationDrawer from '../src/components/NavigationDrawer';
import {large, useBreakpoint} from '../src/breakpoints';
import iconFont from '../assets/MaterialCommunityIcons.ttf';

if (Platform.OS === 'web') {
  // hook up font for web
  // Generate the required CSS
  const iconFontStyles = `@font-face {
    src: url(${iconFont});
    font-family: MaterialCommunityIcons;
  }`;

  // Create a stylesheet
  const style = document.createElement('style');
  style.type = 'text/css';

  // Append the iconFontStyles to the stylesheet
  if (style.styleSheet) {
    style.styleSheet.cssText = iconFontStyles;
  } else {
    style.appendChild(document.createTextNode(iconFontStyles));
  }

  // Inject the stylesheet into the document head
  document.head.appendChild(style);
}

registerTranslation('en', en);

const ICON_BY_ROUTE = {
  todos: 'clock-outline',
  categories: 'tag',
  signin: 'account',
  signup: 'account-plus',
  about: 'information',
};

const getDrawerTypeForBreakpoint = breakpoint =>
  breakpoint === large ? 'permanent' : 'back';

function DrawerLayout() {
  const {isLoggedIn} = useToken();
  const breakpoint = useBreakpoint();
  const drawerType = getDrawerTypeForBreakpoint(breakpoint);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType,
        drawerStyle: {width: 220},
      }}
      drawerContent={props => (
        <CustomNavigationDrawer iconByRoute={ICON_BY_ROUTE} {...props} />
      )}
    />
  );
}

export default function RootLayout() {
  const theme = useTheme();

  return (
    <TokenProvider>
      <TokenLoadBuffer>
        <PaperProvider theme={theme}>
          <StatusBar style="auto" />
          <SafeAreaProvider>
            <ScreenBackground>
              <GestureHandlerRootView style={{flex: 1}}>
                <DrawerLayout />
              </GestureHandlerRootView>
            </ScreenBackground>
          </SafeAreaProvider>
        </PaperProvider>
      </TokenLoadBuffer>
    </TokenProvider>
  );
}
