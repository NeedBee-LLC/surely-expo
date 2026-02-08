import {Stack} from 'expo-router';

// Available todos stack layout
export default function AvailableLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Available',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Todo', // Will be dynamic in Phase 4
        }}
      />
    </Stack>
  );
}
