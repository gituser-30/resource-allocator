// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import head from "../image/Head_logo.png";
// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const token = localStorage.getItem("token"); // ✅ check auth status

//   // hide navbar completely on login and register
//   const hideNavbarRoutes = ["/login", "/Register"];
//   if (hideNavbarRoutes.includes(location.pathname)) {
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // clear token
//     navigate("/login"); // redirect to login
//   };

//   return (
//     <nav
//       className="navbar navbar-expand-lg navbar-dark shadow-lg sticky-top"
//       style={{ backgroundColor: "black" }}
//     >
//       <div className="container-fluid">
//         {/* Brand */}
//         <NavLink
//           className="navbar-brand fs-3 text-light d-flex align-items-center"
//           to="/"
//         >
//           <img
//             src={head}
//             alt="Dbatu Scholar Hub Logo"
//             style={{
//               width: "60px",
//               height: "60px",
//               borderRadius: "50%",
//               objectFit: "contain",
//               marginRight: "12px",
//             }}
//           />
//           <span className="fw-bold " style={{ color: "#38bdf8" }}>
//             Dbatu Scholar Hub
//           </span>
//         </NavLink>

//         {/* Toggle Button */}
//         <button
//           className="navbar-toggler bg-light"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon text-dark"></span>
//         </button>

//         {/* Navbar Content */}
//         <div className="collapse navbar-collapse mx-2" id="navbarNav">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             {token ? (
//               <>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/home"
//                   >
//                     Home
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/Notes"
//                   >
//                     Study Material
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/About-us"
//                   >
//                     About Us
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/Contact"
//                   >
//                     Contact
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/Profile"
//                   >
//                     Profile
//                   </NavLink>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/login"
//                   >
//                     Login
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink
//                     className={({ isActive }) =>
//                       isActive
//                         ? "nav-link text-warning border-bottom border-2 border-warning"
//                         : "nav-link text-light"
//                     }
//                     to="/Register"
//                   >
//                     Register
//                   </NavLink>
//                 </li>
//               </>
//             )}
//           </ul>

//           {/* Right-side Logout Button */}
//           {token && (
//             <button className="btn btn-danger ms-auto" onClick={handleLogout}>
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import head from "../image/Head_logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const hideNavbarRoutes = ["/login", "/Register"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-black shadow-lg sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={head}
            alt="Dbatu Scholar Hub Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "contain",
              marginRight: "8px",
            }}
          />
          <span className="fw-bold text-info">Dbatu Scholar Hub</span>
        </NavLink>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            {(token ? [
              { to: "/home", label: "Home" },
              { to: "/Notes", label: "Study Material" },
              { to: "/About-us", label: "About Us" },
              { to: "/Contact", label: "Contact" },
              { to: "/Profile", label: "Profile" },
            ] : [
              { to: "/login", label: "Login" },
              { to: "/Register", label: "Register" },
            ]).map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link text-warning border-bottom border-2 border-warning"
                      : "nav-link text-light"
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout button */}
          {token && (
            <button className="btn btn-danger my-2 my-md-0" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

