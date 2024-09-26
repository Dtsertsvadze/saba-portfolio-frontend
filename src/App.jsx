import "./App.css";
import Admin from "./components/admin/Admin";
import Upload from "./components/admin/Upload";
import { Route, Routes } from "react-router-dom";
import EditItem from "./components/admin/EditItem";
import DeleteItem from "./components/admin/DeleteItem";
import Home from "./components/home/Home";
import ProjectDetails from "./components/home/ProjectDetails";
import NavBar from "./components/home/NavBar";
import About from "./components/about/About";
import Login from "./components/login/Login";

function App() {
  return (
    <div className="app-container">
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/upload" element={<Upload />} />
          <Route path="/admin/edit/:projectId" element={<EditItem />} />
          <Route path="/admin/delete/:projectId" element={<DeleteItem />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </div>
  );
}

export default App;
