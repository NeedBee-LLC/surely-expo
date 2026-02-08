import {Stack} from 'expo-router';
import NavigationBar from '../../../src/components/NavigationBarExpoRouter';

// Categories stack layout
export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({options, route, navigation}) => (
          <NavigationBar
            title={options.title || route.name}
            canGoBack={navigation.canGoBack()}
          />
        ),
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
          title: 'Category', // Will be "Edit Category" or "New Category" based on id
        }}
      />
    </Stack>
  );
}
