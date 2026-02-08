import {Stack} from 'expo-router';

// Tomorrow todos stack layout
export default function TomorrowLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tomorrow',
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
