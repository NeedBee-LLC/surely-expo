import {Stack} from 'expo-router';

// Main layout - contains logged-in routes (todos and categories)
// Drawer is now at root level
export default function MainLayout() {
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
