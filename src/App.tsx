import { ToastContainer } from "react-toastify";
import "./App.css";
import { useAuth } from "./context/AuthProvider";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import { Register } from "./components/Register";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useAuth();

  return (
    <>
      <ToastContainer />
      {user && <Header />}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
