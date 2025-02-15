import "./App.css";
import URLShortener from "./pages/homePage";
import AuthForms from "./pages/loginAndSignup";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "./shared/routerManger";
import { UnProtectedRoutes } from "./shared/routerManger";

function App() {
  return (
    <Routes>
      <Route element={<UnProtectedRoutes />}>
        <Route path="/" element={<AuthForms />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" index element={<URLShortener />} />
      </Route>
    </Routes>
  );
}

export default App;
