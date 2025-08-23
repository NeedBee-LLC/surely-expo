import {Redirect, Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import {useToken} from '../../src/data/token';

export default function CategoriesLayout() {
  const {isLoggedIn} = useToken();
  if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  }
  return (
    <Stack
      screenOptions={{
        header: props => <CustomNavigationBar {...props} />,
      }}
    />
  );
}
