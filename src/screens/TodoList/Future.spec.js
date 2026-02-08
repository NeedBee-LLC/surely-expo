import {useRouter} from 'expo-router';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import nock from 'nock';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TokenProvider} from '../../data/token';
import {mockUseFocusEffect, safeAreaMetrics} from '../../testUtils';
import Future from './Future';

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  useRouter: jest.fn(),
}));

describe('Future', () => {
  const todo = {
    id: 'abc123',
    type: 'todos',
    attributes: {
      name: 'Todo 1',
      'deferred-until': '2121-08-28T23:54:49.483Z',
    },
  };

  function providers(children) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <TokenProvider loadToken={false}>{children}</TokenProvider>
      </SafeAreaProvider>
    );
  }

  beforeEach(() => {
    mockUseFocusEffect();
  });

  describe('when there are no available todos', () => {
    it('shows a message', async () => {
      const response = {data: []};

      nock('http://localhost:3000')
        .get('/todos?filter[status]=future&filter[search]=&sort=name')
        .reply(200, response);

      render(providers(<Future />));

      await screen.findByText('You have no future todos. Nice work!');
    });
  });

  describe('when there are future todos', () => {
    const response = {data: [todo]};

    function renderComponent() {
      const mockedServer = nock('http://localhost:3000')
        .get('/todos?filter[status]=future&filter[search]=&sort=name')
        .reply(200, response);

      render(providers(<Future />));

      return {
        mockedServer,
      };
    }

    it('displays future todos from the server', async () => {
      renderComponent();

      await screen.findByText(todo.attributes.name);
      expect(screen.getByText('08/28/2121 (1)')).toBeTruthy();
    });

    it('allows navigating to a todo detail', async () => {
      const linkTo = jest.fn().mockName('linkTo');
      useRouter.mockReturnValue(mockRouter);

      renderComponent();

      fireEvent.press(await screen.findByText('Todo 1'));

      expect(router.push).toHaveBeenCalledWith('/todos/future/abc123');
    });

    it('allows searching for todos', async () => {
      const searchText = 'MySearchText';
      const {mockedServer} = renderComponent();

      mockedServer
        .get(
          `/todos?filter[status]=future&filter[search]=${searchText}&sort=name`,
        )
        .reply(200, response);

      await screen.findByText('Todo 1');

      const searchField = screen.getByLabelText('search');
      fireEvent.changeText(searchField, searchText);
      fireEvent(searchField, 'submitEditing');

      await waitFor(() => expect(mockedServer.isDone()).toBe(true));
    });
  });
});
