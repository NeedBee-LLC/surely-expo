import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import nock from 'nock';
import {TokenProvider} from '../../data/token';
import TodoDetail from './index';
import {useLocalSearchParams, useRouter} from 'expo-router';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('TodoDetail', () => {
  function providers(children) {
    return <TokenProvider loadToken={false}>{children}</TokenProvider>;
  }

  describe('when there is an error loading the todo', () => {
    const todoId = '42';
    const todo = {
      id: 'abc123',
      type: 'todos',
      attributes: {
        name: 'My Available Todo',
        notes: 'Notes for the todo',
        'created-at': '2021-08-27T23:54:49.483Z',
        'updated-at': '2021-08-27T23:54:49.483Z',
        'deleted-at': null,
        'completed-at': null,
        'deferred-at': null,
        'deferred-until': null,
      },
      relationships: {
        category: {
          data: null,
        },
      },
    };

    it('shows an error message', async () => {
      nock('http://localhost:3000')
        .get(`/todos/${todoId}?include=category`)
        .reply(500, {});

      useLocalSearchParams.mockReturnValue({id: todoId});
      useRouter.mockReturnValue({
        back: jest.fn(),
        push: jest.fn(),
        replace: jest.fn(),
      });
      render(providers(<TodoDetail />));

      await screen.findByText('An error occurred loading the todo.');
    });

    it('clears the error upon successful retry', async () => {
      nock('http://localhost:3000')
        .get(`/todos/${todoId}?include=category`)
        .reply(500, {})
        .get(`/todos/${todoId}?include=category`)
        .reply(200, {data: todo});

      useLocalSearchParams.mockReturnValue({id: todoId});
      useRouter.mockReturnValue({
        back: jest.fn(),
        push: jest.fn(),
        replace: jest.fn(),
      });
      render(providers(<TodoDetail />));

      await screen.findByText('An error occurred loading the todo.');

      fireEvent.press(screen.getByRole('button', {name: 'Retry'}));

      await screen.findByText(todo.attributes.name);
      expect(
        screen.queryByText('An error occurred loading the todo.'),
      ).toBeNull();
    });
  });

  describe('when the todo is available', () => {
    const todo = {
      id: 'abc123',
      type: 'todos',
      attributes: {
        name: 'My Available Todo',
        notes: 'Notes for the todo',
        'created-at': '2021-08-27T23:54:49.483Z',
        'updated-at': '2021-08-27T23:54:49.483Z',
        'deleted-at': null,
        'completed-at': null,
        'deferred-at': null,
        'deferred-until': '2121-08-27T23:54:49.483Z',
      },
      relationships: {
        category: {
          data: null,
        },
      },
    };

    function setUp() {
      const mockServer = nock('http://localhost:3000')
        .get(`/todos/${todo.id}?include=category`)
        .reply(200, {data: todo});

      const router = {back: jest.fn(), push: jest.fn(), replace: jest.fn()};
      useLocalSearchParams.mockReturnValue({id: todo.id});
      useRouter.mockReturnValue(router);

      render(providers(<TodoDetail />));

      return {mockServer, router};
    }

    it('displays the todo content', async () => {
      setUp();

      await screen.findByText(todo.attributes.name);
      expect(screen.getByText(todo.attributes.notes)).toBeTruthy();
      expect(screen.getByText('Created 08/27/2021')).toBeTruthy();
      expect(screen.getByText('Deferred until 08/27/2121')).toBeTruthy();
    });

    describe('completing the todo', () => {
      it('allows completing the todo', async () => {
        const {mockServer, router} = setUp();

        mockServer
          .patch(
            `/todos/${todo.id}?`,
            body =>
              body.data.id === todo.id &&
              body.data.attributes['completed-at'] !== null,
          )
          .reply(200, {data: {}});

        fireEvent.press(await screen.findByRole('button', {name: 'Complete'}));

        await waitFor(() => expect(router.back).toHaveBeenCalled());
        mockServer.done();
      });

      it('shows a message when there is an error completing the todo', async () => {
        const {mockServer, router} = setUp();

        mockServer.patch(`/todos/${todo.id}?`).reply(500, {});

        fireEvent.press(await screen.findByRole('button', {name: 'Complete'}));

        await screen.findByText('An error occurred marking the todo complete.');
        expect(router.back).not.toHaveBeenCalled();
      });
    });

    describe('deleting the todo', () => {
      it('allows deleting the todo', async () => {
        const {mockServer, router} = setUp();

        mockServer
          .patch(
            `/todos/${todo.id}?`,
            body =>
              body.data.id === todo.id &&
              body.data.attributes['deleted-at'] !== null,
          )
          .reply(200, {data: {}});

        fireEvent.press(await screen.findByRole('button', {name: 'Delete'}));

        await waitFor(() => expect(router.back).toHaveBeenCalled());
      });

      it('shows a message when there is an error deleting the todo', async () => {
        const {mockServer, router} = setUp();

        mockServer.patch(`/todos/${todo.id}?`).reply(500, {});

        fireEvent.press(await screen.findByRole('button', {name: 'Delete'}));

        await screen.findByText('An error occurred deleting the todo.');
        expect(router.back).not.toHaveBeenCalled();
      });
    });

    describe('deferring the todo', () => {
      it('allows deferring the todo', async () => {
        const {mockServer, router} = setUp();

        mockServer
          .patch(
            `/todos/${todo.id}?`,
            body =>
              body.data.id === todo.id &&
              body.data.attributes['deferred-until'] !== null,
          )
          .reply(200, {data: todo});

        fireEvent.press(await screen.findByRole('button', {name: 'Defer'}));
        fireEvent.press(await screen.findByRole('button', {name: /1 Day/i}));

        await waitFor(() => expect(router.back).toHaveBeenCalled());
      });

      it('shows a message when an error occurs deferring the todo', async () => {
        const {mockServer, router} = setUp();

        mockServer.patch(`/todos/${todo.id}?`).reply(500, {});

        fireEvent.press(await screen.findByRole('button', {name: 'Defer'}));
        fireEvent.press(await screen.findByRole('button', {name: /1 Day/i}));

        await screen.findByText('An error occurred deferring the todo.');
        expect(router.back).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the todo is completed', () => {
    const todo = {
      id: 'abc123',
      type: 'todos',
      attributes: {
        name: 'My Available Todo',
        notes: 'Notes for the todo',
        'created-at': '2021-08-27T23:54:49.483Z',
        'updated-at': '2021-08-27T23:54:49.483Z',
        'deleted-at': null,
        'completed-at': '2021-08-27T23:54:49.483Z',
        'deferred-at': null,
        'deferred-until': null,
      },
      relationships: {
        category: {
          data: null,
        },
      },
    };

    function setUp() {
      const mockServer = nock('http://localhost:3000')
        .get(`/todos/${todo.id}?include=category`)
        .reply(200, {data: todo});

      const router = {back: jest.fn(), push: jest.fn(), replace: jest.fn()};
      useLocalSearchParams.mockReturnValue({id: todo.id});
      useRouter.mockReturnValue(router);

      render(providers(<TodoDetail />));

      return {mockServer, router};
    }

    it('displays the completion date', async () => {
      setUp();

      await screen.findByText('Completed 08/27/2021');
    });

    it('allows uncompleting the todo', async () => {
      const {mockServer, router} = setUp();

      mockServer
        .patch(
          `/todos/${todo.id}?`,
          body =>
            body.data.id === todo.id &&
            body.data.attributes['completed-at'] === null,
        )
        .reply(200, {data: todo});

      fireEvent.press(await screen.findByRole('button', {name: 'Uncomplete'}));

      await waitFor(() => expect(mockServer.isDone()).toBe(true));
      expect(router.back).not.toHaveBeenCalled();
    });

    it('shows a message when there is an error uncompleting the todo', async () => {
      const {mockServer} = setUp();

      mockServer.patch(`/todos/${todo.id}?`).reply(500, {});

      fireEvent.press(await screen.findByRole('button', {name: 'Uncomplete'}));

      await screen.findByText('An error occurred marking the todo incomplete.');
    });
  });

  describe('when the todo is deleted', () => {
    const todo = {
      id: 'abc123',
      type: 'todos',
      attributes: {
        name: 'My Available Todo',
        notes: 'Notes for the todo',
        'created-at': '2021-08-27T23:54:49.483Z',
        'updated-at': '2021-08-27T23:54:49.483Z',
        'deleted-at': '2021-08-29T23:54:49.483Z',
        'completed-at': '2021-08-28T23:54:49.483Z',
        'deferred-at': null,
        'deferred-until': null,
      },
      relationships: {
        category: {
          data: null,
        },
      },
    };

    function setUp() {
      const mockServer = nock('http://localhost:3000')
        .get(`/todos/${todo.id}?include=category`)
        .reply(200, {data: todo});

      const router = {back: jest.fn(), push: jest.fn(), replace: jest.fn()};
      useLocalSearchParams.mockReturnValue({id: todo.id});
      useRouter.mockReturnValue(router);

      render(providers(<TodoDetail />));

      return {mockServer, router};
    }

    it('displays the todo dates', async () => {
      setUp();

      await screen.findByText('Completed 08/28/2021');
      expect(screen.getByText('Deleted 08/29/2021')).toBeTruthy();
    });

    it('allows undeleting the todo', async () => {
      const {mockServer, router} = setUp();

      mockServer
        .patch(
          `/todos/${todo.id}?`,
          body =>
            body.data.id === todo.id &&
            body.data.attributes['deleted-at'] === null,
        )
        .reply(200, {data: todo});

      fireEvent.press(await screen.findByRole('button', {name: 'Undelete'}));

      await waitFor(() => expect(mockServer.isDone()).toBe(true));
      expect(router.back).not.toHaveBeenCalled();
    });

    it('shows a message when there is an error undeleting the todo', async () => {
      const {mockServer} = setUp();

      mockServer.patch(`/todos/${todo.id}?`).reply(500, {});

      fireEvent.press(await screen.findByRole('button', {name: 'Undelete'}));

      await screen.findByText('An error occurred undeleting the todo.');
    });
  });
});
