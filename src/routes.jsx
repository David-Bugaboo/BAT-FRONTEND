import { Routes, Route } from "react-router-dom";
import { TodoList } from "./pages/TodoList";
import { Home } from "./pages/Home";


export const RoutesComponent = () => {
    return (
        <Routes>
            <Route path="/todolist" element={<TodoList />} />
            <Route path="/" element={<Home />} />
        </Routes>
    );
};