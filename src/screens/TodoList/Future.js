import {useRouter} from 'expo-router';
import {useCallback} from 'react';
import {useTodos} from '../../data/todos';
import {groupByDate} from '../../utils/grouping';
import TodoListScreen from './TodoListScreen';

export default function FutureTodos() {
  const todoClient = useTodos();
  const router = useRouter();

  const loadFutureTodos = useCallback(
    ({searchText}) =>
      todoClient
        .where({
          filter: {status: 'future', search: searchText},
          options: {sort: 'name'},
        })
        .then(todoResponse => ({
          todoGroups: groupByDate({
            todos: todoResponse.data,
            attribute: 'deferred-until',
          }),
        })),
    [todoClient],
  );

  const goToFutureTodo = todo => router.push(`/todos/future/${todo.id}`);

  return (
    <TodoListScreen
      search
      onLoadTodos={loadFutureTodos}
      onPressTodo={goToFutureTodo}
      noTodosMessage="You have no future todos. Nice work!"
      noSearchResultsMessage="No future todos matched your search"
    />
  );
}
