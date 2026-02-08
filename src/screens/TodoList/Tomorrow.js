import {addDays, startOfDay} from 'date-fns';
import {useRouter} from 'expo-router';
import {useCallback} from 'react';
import {useTodos} from '../../data/todos';
import {groupByCategory} from '../../utils/grouping';
import TodoListScreen from './TodoListScreen';

const today = now => startOfDay(new Date());
const tomorrow = now => addDays(today(now), 1);

export default function AvailableTodos() {
  const todoClient = useTodos();
  const router = useRouter();

  const loadTomorrowTodos = useCallback(
    () =>
      todoClient
        .where({
          filter: {status: 'tomorrow'},
          options: {include: 'category'},
        })
        .then(todoResponse => ({todoGroups: groupByCategory(todoResponse)})),
    [todoClient],
  );
  const createTomorrowTodo = name =>
    todoClient.create({
      attributes: {name, 'deferred-until': tomorrow(new Date())},
    });

  const goToTomorrowTodo = todo => router.push(`/todos/tomorrow/${todo.id}`);

  return (
    <TodoListScreen
      onLoadTodos={loadTomorrowTodos}
      onCreateTodo={createTomorrowTodo}
      onPressTodo={goToTomorrowTodo}
      noTodosMessage="You have no todos for tomorrow. Nice work!"
    />
  );
}
