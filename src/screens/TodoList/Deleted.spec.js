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
import Deleted from './Deleted';

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  useRouter: jest.fn(),
}));

describe('Deleted', () => {
  const todo = {
    id: 'abc123',
    type: 'todos',
    attributes: {
      name: 'Todo 1',
      'deleted-at': '2021-08-28T23:54:49.483Z',
    },
  };
  const todo2 = {
    id: 'abc123',
    type: 'todos',
    attributes: {
      name: 'Todo 2',
      'deleted-at': '2021-08-28T23:54:49.483Z',
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

  describe('when there are no deleted todos', () => {
    it('shows a message', async () => {
      const response = {data: []};

      nock('http://localhost:3000')
        .get(
          '/todos?filter[status]=deleted&filter[search]=&sort=-deletedAt&page[number]=1',
        )
        .reply(200, response);

      render(providers(<Deleted />));

      await screen.findByText(
        "You have no deleted todos. Don't be afraid to give up!",
      );
    });
  });

  describe('when there are deleted todos', () => {
    const response = {data: [todo]};

    function renderComponent() {
      const mockedServer = nock('http://localhost:3000')
        .get(
          '/todos?filter[status]=deleted&filter[search]=&sort=-deletedAt&page[number]=1',
        )
        .reply(200, response);

      render(providers(<Deleted />));

      return {
        mockedServer,
      };
    }

    it('displays deleted todos from the server', async () => {
      renderComponent();

      await screen.findByText(todo.attributes.name);
      expect(screen.getByText('08/28/2021 (1)')).toBeTruthy();
    });

    it('allows pagination', async () => {
      const {mockedServer} = renderComponent();

      mockedServer
        .get(
          '/todos?filter[status]=deleted&filter[search]=&sort=-deletedAt&page[number]=2',
        )
        .reply(200, {data: [todo2]})
        .get(
          '/todos?filter[status]=deleted&filter[search]=&sort=-deletedAt&page[number]=1',
        )
        .reply(200, {data: [todo]});

      await screen.findByText(todo.attributes.name);

      fireEvent.press(screen.getByLabelText('Go to next page'));
      await screen.findByText(todo2.attributes.name);

      fireEvent.press(screen.getByLabelText('Go to previous page'));
      await screen.findByText(todo.attributes.name);
    });

    it('allows navigating to a todo detail', async () => {
      const router = {push: jest.fn()};
      useRouter.mockReturnValue(router);

      renderComponent();

      fireEvent.press(await screen.findByText('Todo 1'));

      expect(router.push).toHaveBeenCalledWith('/todos/deleted/abc123');
    });

    describe('searching', () => {
      const searchText = 'MySearchText';

      it('allows searching for todos', async () => {
        const {mockedServer} = renderComponent();

        mockedServer
          .get(
            `/todos?filter[status]=deleted&filter[search]=${searchText}&sort=-deletedAt&page[number]=1`,
          )
          .reply(200, response);

        await screen.findByText('Todo 1');

        const searchField = screen.getByLabelText('search');
        fireEvent.changeText(searchField, searchText);
        fireEvent(searchField, 'submitEditing');

        await waitFor(() => expect(mockedServer.isDone()).toBe(true));
      });

      it('shows a message when no search results returned', async () => {
        const {mockedServer} = renderComponent();

        mockedServer
          .get(
            `/todos?filter[status]=deleted&filter[search]=${searchText}&sort=-deletedAt&page[number]=1`,
          )
          .reply(200, {data: []});

        await screen.findByText('Todo 1');

        const searchField = screen.getByLabelText('search');
        fireEvent.changeText(searchField, searchText);
        fireEvent(searchField, 'submitEditing');

        await screen.findByText('No deleted todos matched your search');
      });
    });
  });
});
