import {Routes, Route, Link, Navigate, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./navbar/Navbar";
import BottomNavbar from "./navbar/BottomNavbar";
import Alerts from "./components/alerts/Alert";
import LiveChat from "./pages/LiveChat";
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
          <Route path='/' element={<Home />} />
            <Route path='/live' element={<LiveChat />} />
        </Routes>
        <BottomNavbar/>
      </div>
  );
}

export default App;
