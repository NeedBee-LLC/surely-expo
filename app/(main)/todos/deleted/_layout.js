import {Stack} from 'expo-router';

// Deleted todos stack layout
export default function DeletedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Deleted',
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
