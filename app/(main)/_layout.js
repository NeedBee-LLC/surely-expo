import {Redirect, Stack} from 'expo-router';
import {useToken} from '../../src/data/token';

// Main layout - contains logged-in routes (todos and categories)
// Redirects to signin if not authenticated
export default function MainLayout() {
  const {token} = useToken();

  // Auth guard: redirect to signin if not logged in
  if (!token) {
    return <Redirect href="/signin" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="todos" />
      <Stack.Screen name="categories" />
    </Stack>
  );
}
