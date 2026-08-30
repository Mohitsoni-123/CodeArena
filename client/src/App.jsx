import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import MySubmissions from "./pages/MySubmissions";
import SubmissionDetail from "./pages/SubmissionDetail";

// function Home(){
//   return <h1>Welcome to CodeArena 🚀</h1>
// }
// function Problems(){
//   return <h1>Problems Page</h1>
// }
function Login() {
  return <h1>Login Page</h1>;
}
function Register() {
  return <h1>Register Page</h1>;
}
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submissions" element={<MySubmissions />} />
        <Route path="/submissions/:id" element={<SubmissionDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
