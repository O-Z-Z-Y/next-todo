import { NextPage } from "next";
import TodoList from "../components/TodoList";
import { TodoType } from "../types/todo";
import { GetServerSideProps } from "next";
import { getTodosAPI } from "../lib/api/todo";
import { wrapper } from "../store";
import { todoActions } from "../store/todo";

interface IProps {
  todos: TodoType[];
}

const app: NextPage<IProps> = ({ todos }) => {
  return <TodoList todos={todos} />;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    console.log(store);
    try {
      const { data } = await getTodosAPI();
      store.dispatch(todoActions.setTodo(data));
      return { props: { todos: data } };
    } catch (e) {
      console.log(e);
      return { props: {} };
    }
  }
);

export default app;