import {useNavigation, useRouter} from 'expo-router';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {large, medium, useBreakpoint} from '../breakpoints';
import NavigationBar from './NavigationBar';

jest.mock('../breakpoints');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useNavigation: jest.fn(),
}));

describe('NavigationBar', () => {
  function wrapper(children) {
    return (
      <SafeAreaProvider
        initialMetrics={{
          frame: {x: 0, y: 0, width: 1000, height: 1000},
          insets: {top: 0, left: 0, right: 0, bottom: 0},
        }}
      >
        {children}
      </SafeAreaProvider>
    );
  }

  describe('back button', () => {
    describe('when React Nav provides a truthy back prop', () => {
      it('renders a button that allows you to go back', () => {
        const options = {};
        const back = jest.fn().mockName('router.back');
        const canGoBack = jest.fn().mockReturnValue(true);
        useRouter.mockReturnValue({back, canGoBack});
        useNavigation.mockReturnValue({});

        render(
          wrapper(
            <NavigationBar back options={options} />,
          ),
        );

        fireEvent.press(screen.getByLabelText('Back'));

        expect(back).toHaveBeenCalledWith();
      });
    });

    describe('when React Nav provides a falsy back prop', () => {
      it('does not render a back button', () => {
        const options = {};
        useRouter.mockReturnValue({back: jest.fn(), canGoBack: jest.fn()});
        useNavigation.mockReturnValue({});

        render(
          wrapper(
            <NavigationBar
              back={false}
              options={options}
            />,
          ),
        );

        expect(screen.queryByLabelText('Back')).toBeNull();
      });
    });
  });

  describe('menu button', () => {
    describe('when on a viewport that is not large', () => {
      it('render a button that allows toggling the drawer', () => {
        useBreakpoint.mockReturnValue(large);
        useRouter.mockReturnValue({back: jest.fn(), canGoBack: jest.fn()});
        useNavigation.mockReturnValue({});

        const options = {};

        render(
          wrapper(<NavigationBar options={options} />),
        );

        expect(screen.queryByLabelText('Menu')).toBeNull();
      });
    });

    describe('when on a large viewport', () => {
      it('does not render a menu button', () => {
        useBreakpoint.mockReturnValue(medium);
        useRouter.mockReturnValue({back: jest.fn(), canGoBack: jest.fn()});
        const toggleDrawer = jest.fn().mockName('navigation.toggleDrawer');
        useNavigation.mockReturnValue({toggleDrawer});

        const options = {};

        render(
          wrapper(<NavigationBar options={options} />),
        );

        fireEvent.press(screen.getByLabelText('Menu'));

        expect(toggleDrawer).toHaveBeenCalledWith();
      });
    });
  });
});
