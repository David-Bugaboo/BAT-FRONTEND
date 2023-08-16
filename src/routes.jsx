import { Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";


export const RoutesComponent = () => {
    return (
        <Routes>
            
            <Route path="/" element={<Home />} />
        </Routes>
    );
};