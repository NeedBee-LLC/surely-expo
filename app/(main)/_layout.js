import {Stack} from 'expo-router';

// Main layout - will be converted to Drawer in Phase 3
// For now using Stack as placeholder
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
