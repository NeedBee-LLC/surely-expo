import {Stack} from 'expo-router';

// Future todos stack layout
export default function FutureLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Future',
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
