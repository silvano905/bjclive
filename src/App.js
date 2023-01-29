import {Routes, Route, Link, Navigate, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./navbar/Navbar";
import BottomNavbar from "./navbar/BottomNavbar";
import Alerts from "./components/alerts/Alert";
import LiveChat from "./pages/LiveChat";
import JumpByID from "./pages/JumpByID";
import Main from "./pages/Main";
import Jumps from "./pages/admin/Jumps";
function App() {

  const ProtectedRoute = ({
                            user,
                            redirectPath = '/login',
                            children,
                          }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
  };

  return (
      <div>
        <Navbar/>
        <Alerts/>
        <Routes>
          <Route path='/' element={<Main />} />
            <Route path='/admin' element={<Jumps />} />
            <Route path='/live' element={<LiveChat />} />
            <Route path='/jump/:id' element={<JumpByID />} />
        </Routes>
        <BottomNavbar/>
      </div>
  );
}

export default App;
