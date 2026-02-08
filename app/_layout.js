import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Drawer} from 'expo-router/drawer';
import {StatusBar} from 'expo-status-bar';
// for some reason PaperProvider errors without the React import
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Platform} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {en, registerTranslation} from 'react-native-paper-dates';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import iconFont from '../assets/MaterialCommunityIcons.ttf';
import {large, useBreakpoint} from '../src/breakpoints';
import CustomDrawerContent from '../src/components/CustomDrawerContent';
import ScreenBackground from '../src/components/ScreenBackground';
import TokenLoadBuffer from '../src/components/TokenLoadBuffer';
import {TokenProvider} from '../src/data/token';
import useTheme from '../src/useTheme';

const queryClient = new QueryClient();

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

const getDrawerTypeForBreakpoint = breakpoint =>
  breakpoint === large ? 'permanent' : 'back';

// Root layout with providers and drawer navigation
function RootLayoutNav() {
  const breakpoint = useBreakpoint();
  const drawerType = getDrawerTypeForBreakpoint(breakpoint);

  return (
    <Drawer
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType,
        drawerStyle: {width: 220},
      }}>
      <Drawer.Screen name="index" options={{drawerItemStyle: {display: 'none'}}} />
      <Drawer.Screen name="(auth)" options={{drawerItemStyle: {display: 'none'}}} />
      <Drawer.Screen name="(main)" options={{drawerItemStyle: {display: 'none'}}} />
      <Drawer.Screen name="about" options={{drawerItemStyle: {display: 'none'}}} />
    </Drawer>
  );
}

export default function RootLayout() {
  const theme = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <TokenProvider>
        <TokenLoadBuffer>
          <PaperProvider theme={theme}>
            <StatusBar style="auto" />
            <SafeAreaProvider>
              <ScreenBackground>
                <RootLayoutNav />
              </ScreenBackground>
            </SafeAreaProvider>
          </PaperProvider>
        </TokenLoadBuffer>
      </TokenProvider>
    </QueryClientProvider>
  );
}
