import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {large, useBreakpoint} from './breakpoints';
import CustomNavigationBar from './components/NavigationBar';
import CustomNavigationDrawer from './components/NavigationDrawer';
import {useToken} from './data/token';
import AboutScreen from './screens/About/AboutScreen';
import PrivacyScreen from './screens/About/PrivacyScreen';
import SupportScreen from './screens/About/SupportScreen';
import ThanksScreen from './screens/About/ThanksScreen';
import CategoryDetail from './screens/CategoryDetail';
import CategoryList from './screens/CategoryList';
import SignInForm from './screens/Login/SignInForm';
import SignUpForm from './screens/Login/SignUpForm';
import TodoDetail from './screens/TodoDetail';
import AvailableTodos from './screens/TodoList/Available';
import CompletedTodos from './screens/TodoList/Completed';
import DeletedTodos from './screens/TodoList/Deleted';
import FutureTodos from './screens/TodoList/Future';
import TomorrowTodos from './screens/TodoList/Tomorrow';

const linking = {
  config: {
    screens: {
      Available: {
        path: '/todos/available',
        initialRouteName: 'AvailableTodos',
        screens: {
          AvailableTodos: '',
          AvailableTodoDetail: ':id',
        },
      },
      Tomorrow: {
        path: '/todos/tomorrow',
        initialRouteName: 'TomorrowTodos',
        screens: {
          TomorrowTodos: '',
          TomorrowTodoDetail: ':id',
        },
      },
      Future: {
        path: '/todos/future',
        initialRouteName: 'FutureTodos',
        screens: {
          FutureTodos: '',
          FutureTodoDetail: ':id',
        },
      },
      Completed: {
        path: '/todos/completed',
        initialRouteName: 'CompletedTodos',
        screens: {
          CompletedTodos: '',
          CompletedTodoDetail: ':id',
        },
      },
      Deleted: {
        path: '/todos/deleted',
        initialRouteName: 'DeletedTodos',
        screens: {
          DeletedTodos: '',
          DeletedTodoDetail: ':id',
        },
      },
      Categories: {
        path: '/categories',
        initialRouteName: 'CategoryList',
        screens: {
          CategoryList: '',
          CategoryDetail: ':id',
        },
      },
      About: {
        path: '/about',
        initialRouteName: 'AboutScreen',
        screens: {
          AboutScreen: '',
          SupportScreen: 'support',
          PrivacyScreen: 'privacy',
          ThanksScreen: 'say-thanks',
        },
      },
      'Sign in': {
        screens: {
          SignInScreen: '/signin',
        },
      },
      'Sign up': {
        screens: {
          SignUpScreen: '/signup',
        },
      },
    },
  },
};

const Drawer = createDrawerNavigator();

const AvailableStack = createNativeStackNavigator();
const Available = () => (
  <AvailableStack.Navigator
    initialRouteName="AvailableTodos"
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <AvailableStack.Screen
      name="AvailableTodos"
      component={AvailableTodos}
      options={{title: 'Available'}}
    />
    <AvailableStack.Screen
      name="AvailableTodoDetail"
      component={TodoDetail}
      options={{title: 'Todo'}}
    />
  </AvailableStack.Navigator>
);

const TomorrowStack = createNativeStackNavigator();
const Tomorrow = () => (
  <TomorrowStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <TomorrowStack.Screen
      name="TomorrowTodos"
      component={TomorrowTodos}
      options={{title: 'Tomorrow'}}
    />
    <TomorrowStack.Screen
      name="TomorrowTodoDetail"
      component={TodoDetail}
      options={{title: 'Todo'}}
    />
  </TomorrowStack.Navigator>
);

const FutureStack = createNativeStackNavigator();
const Future = () => (
  <FutureStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <FutureStack.Screen
      name="FutureTodos"
      component={FutureTodos}
      options={{title: 'Future'}}
    />
    <FutureStack.Screen
      name="FutureTodoDetail"
      component={TodoDetail}
      options={{title: 'Todo'}}
    />
  </FutureStack.Navigator>
);

const CompletedStack = createNativeStackNavigator();
const Completed = () => (
  <CompletedStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <CompletedStack.Screen
      name="CompletedTodos"
      component={CompletedTodos}
      options={{title: 'Completed'}}
    />
    <CompletedStack.Screen
      name="CompletedTodoDetail"
      component={TodoDetail}
      options={{title: 'Todo'}}
    />
  </CompletedStack.Navigator>
);

const DeletedStack = createNativeStackNavigator();
const Deleted = () => (
  <DeletedStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <DeletedStack.Screen
      name="DeletedTodos"
      component={DeletedTodos}
      options={{title: 'Deleted'}}
    />
    <DeletedStack.Screen
      name="DeletedTodoDetail"
      component={TodoDetail}
      options={{title: 'Todo'}}
    />
  </DeletedStack.Navigator>
);

const CategoryStack = createNativeStackNavigator();
const Categories = () => (
  <CategoryStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <CategoryStack.Screen
      name="CategoryList"
      component={CategoryList}
      options={{title: 'Categories'}}
    />
    <CategoryStack.Screen
      name="CategoryDetail"
      component={CategoryDetail}
      options={{title: 'Category'}}
    />
  </CategoryStack.Navigator>
);

const SignInStack = createNativeStackNavigator();
const SignIn = () => (
  <SignInStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <SignInStack.Screen
      name="SignInScreen"
      component={SignInForm}
      options={{title: 'Sign in'}}
    />
  </SignInStack.Navigator>
);

const SignUpStack = createNativeStackNavigator();
const SignUp = () => (
  <SignUpStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <SignUpStack.Screen
      name="SignUpScreen"
      component={SignUpForm}
      options={{title: 'Sign up'}}
    />
  </SignUpStack.Navigator>
);

const AboutStack = createNativeStackNavigator();
const About = () => (
  <AboutStack.Navigator
    screenOptions={{
      header: props => <CustomNavigationBar {...props} />,
    }}
  >
    <AboutStack.Screen
      name="AboutScreen"
      component={AboutScreen}
      options={{title: 'About'}}
    />
    <AboutStack.Screen
      name="SupportScreen"
      component={SupportScreen}
      options={{title: 'Support'}}
    />
    <AboutStack.Screen
      name="PrivacyScreen"
      component={PrivacyScreen}
      options={{title: 'Privacy Policy'}}
    />
    <AboutStack.Screen
      name="ThanksScreen"
      component={ThanksScreen}
      options={{title: 'Ways to Say Thanks'}}
    />
  </AboutStack.Navigator>
);

const getDrawerTypeForBreakpoint = breakpoint =>
  breakpoint === large ? 'permanent' : 'back';

const ICON_BY_ROUTE = {
  Available: 'clock-outline',
  Tomorrow: 'weather-night',
  Future: 'calendar-blank',
  Completed: 'checkbox-marked',
  Deleted: 'delete',
  Categories: 'tag',
};

function NavigationContents() {
  const {isLoggedIn} = useToken();
  const breakpoint = useBreakpoint();
  const drawerType = getDrawerTypeForBreakpoint(breakpoint);

  // IMPORTANT: NavigationContainer must not rerender too often because
  // it calls the history API, and Safari and Firefox place limits on
  // the frequency of history API calls. (Safari: 100 times in 30
  // seconds).
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType,
        drawerStyle: {width: 220},
      }}
      drawerContent={props => (
        <CustomNavigationDrawer iconByRoute={ICON_BY_ROUTE} {...props} />
      )}
    >
      {isLoggedIn ? (
        <>
          <Drawer.Screen name="Available" component={Available} />
          <Drawer.Screen name="Tomorrow" component={Tomorrow} />
          <Drawer.Screen name="Future" component={Future} />
          <Drawer.Screen name="Completed" component={Completed} />
          <Drawer.Screen name="Deleted" component={Deleted} />
          <Drawer.Screen name="Categories" component={Categories} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Sign in" component={SignIn} />
          <Drawer.Screen name="Sign up" component={SignUp} />
        </>
      )}
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  // IMPORTANT: NavigationContainer needs to not rerender too often or
  // else Safari and Firefox error on too many history API calls. Put
  // any hooks in NavigationContents so this parent doesn't rerender.
  return (
    <NavigationContainer linking={linking}>
      <NavigationContents />
    </NavigationContainer>
  );
}
