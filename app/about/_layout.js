import {Stack} from 'expo-router';
import NavigationBar from '../../src/components/NavigationBar';

export default function AboutLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <NavigationBar {...props} />,
      }}
    >
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
