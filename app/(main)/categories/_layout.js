import {Stack} from 'expo-router';
import NavigationBar from '../../../src/components/NavigationBar';

export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <NavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Category',
        }}
      />
    </Stack>
  );
}
