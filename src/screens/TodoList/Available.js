import {useRouter} from 'expo-router';
import {useCallback} from 'react';
import {useTodos} from '../../data/todos';
import {groupByCategory} from '../../utils/grouping';
import TodoListScreen from './TodoListScreen';

export default function AvailableTodos() {
  const todoClient = useTodos();
  const router = useRouter();
  const loadAvailableTodos = useCallback(
    () =>
      todoClient
        .where({
          filter: {status: 'available'},
          options: {include: 'category'},
        })
        .then(todoResponse => ({todoGroups: groupByCategory(todoResponse)})),
    [todoClient],
  );

  const createAvailableTodo = name => todoClient.create({attributes: {name}});

  const goToAvailableTodo = todo => router.push(`/todos/available/${todo.id}`);

  return (
    <TodoListScreen
      onLoadTodos={loadAvailableTodos}
      onCreateTodo={createAvailableTodo}
      onPressTodo={goToAvailableTodo}
      noTodosMessage="You have no available todos. Nice work!"
    />
  );
}
