import {useLinkTo} from '@react-navigation/native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useToken} from '../data/token';
import {safeAreaMetrics} from '../testUtils';
import NavigationDrawer from './NavigationDrawer';

jest.mock('../data/token', () => ({useToken: jest.fn()}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useLinkTo: jest.fn(),
}));

describe('NavigationDrawer', () => {
  const ICON_BY_ROUTE = {};

  it('allows navigating to the passed-in routes', () => {
    const linkTo = jest.fn().mockName('linkTo');
    useLinkTo.mockReturnValue(linkTo);
    
    const route = {
      name: 'Available',
      key: '123',
    };
    const state = {
      routes: [route],
    };
    useToken.mockReturnValue({
      isLoggedIn: false,
    });

    render(
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <NavigationDrawer
          iconByRoute={ICON_BY_ROUTE}
          state={state}
        />
      </SafeAreaProvider>,
    );

    fireEvent.press(screen.getByText(route.name));

    expect(linkTo).toHaveBeenCalledWith('/todos/available');
  });

  describe('when signed in', () => {
    it('allows signing out', async () => {
      const linkTo = jest.fn().mockName('linkTo');
      useLinkTo.mockReturnValue(linkTo);
      
      const state = {
        routes: [],
      };
      const clearToken = jest.fn().mockName('clearToken');
      useToken.mockReturnValue({
        isLoggedIn: true,
        clearToken,
      });

      render(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <NavigationDrawer
            iconByRoute={ICON_BY_ROUTE}
            state={state}
          />
        </SafeAreaProvider>,
      );

      fireEvent.press(screen.getByText('Sign out'));

      expect(clearToken).toHaveBeenCalledWith();

      await waitFor(() =>
        expect(linkTo).toHaveBeenCalledWith('/signin'),
      );
    });
  });
});
