import {Stack} from 'expo-router';
import NavigationBar from '../../src/components/NavigationBarExpoRouter';

// About stack layout - accessible regardless of auth state
export default function AboutLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({options, route, navigation}) => (
          <NavigationBar
            title={options.title || route.name}
            canGoBack={navigation.canGoBack()}
          />
        ),
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'About',
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Support',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy Policy',
        }}
      />
      <Stack.Screen
        name="say-thanks"
        options={{
          title: 'Ways to Say Thanks',
        }}
      />
    </Stack>
  );
}
