import {Stack} from 'expo-router';

// Categories stack layout
export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Category', // Will be "Edit Category" or "New Category" in Phase 4
        }}
      />
    </Stack>
  );
}
