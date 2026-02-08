import {Stack} from 'expo-router';

// About stack layout - accessible regardless of auth state
export default function AboutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
