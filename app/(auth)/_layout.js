import {Redirect, Stack} from 'expo-router';
import {useToken} from '../../src/data/token';

export default function AuthLayout() {
  const {isTokenLoaded, isLoggedIn} = useToken();

  // Wait for token to load
  if (!isTokenLoaded) {
    return null;
  }

  // If already logged in, redirect to main app
  if (isLoggedIn) {
    return <Redirect href="/todos/available" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="signin"
        options={{
          title: 'Sign in',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign up',
        }}
      />
    </Stack>
  );
}
