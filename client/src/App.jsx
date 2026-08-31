import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import MySubmissions from "./pages/MySubmissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

// function Home(){
//   return <h1>Welcome to CodeArena 🚀</h1>
// }
// function Problems(){
//   return <h1>Problems Page</h1>
// }
// function Login() {
//   return <h1>Login Page</h1>;
// }
// function Register() {
//   return <h1>Register Page</h1>;
// }

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "15px 30px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        gap: "25px",
        alignItems: "center",
      }}
    >
      <Link to="/">
        <strong>CodeArena 🚀</strong>
      </Link>

      <Link to="/problems">Problems</Link>

      {token ? (
        <>
          <Link to="/submissions">My Submissions</Link>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      {/* Routes */}
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
