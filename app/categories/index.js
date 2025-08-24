import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import CategoryList from '../../src/screens/CategoryList';

export default function CategoriesScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Categories',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <CategoryList />
    </>
  );
}
