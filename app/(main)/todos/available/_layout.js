import {Stack} from 'expo-router';
import NavigationBar from '../../../../src/components/NavigationBarExpoRouter';

// Available todos stack layout
export default function AvailableLayout() {
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
          title: 'Available',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Todo', // Will be made dynamic in screen component
        }}
      />
    </Stack>
  );
}
