import {Redirect, Stack} from 'expo-router';
import NavigationBar from '../../src/components/NavigationBarExpoRouter';
import {useToken} from '../../src/data/token';

// Auth stack layout - Sign In is initial route (no back button)
// Redirects to /todos/available if already logged in
export default function AuthLayout() {
  const {token} = useToken();

  // If already logged in, redirect to available todos
  if (token) {
    return <Redirect href="/todos/available" />;
  }

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
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
        }}
      />
    </Stack>
  );
}
