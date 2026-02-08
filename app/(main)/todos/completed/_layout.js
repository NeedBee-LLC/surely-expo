import {Stack} from 'expo-router';

// Completed todos stack layout
export default function CompletedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Completed',
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
