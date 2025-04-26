import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import Logo from '../assets/logo.jpg';
import { 
  FaCoins, 
  FaWallet, 
  FaChevronDown, 
  FaMapMarkedAlt, 
  FaHome, 
  FaUser, 
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaPlane
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={Logo} alt="SafeTrail Logo" className="logo-image" />
          <motion.span 
            className="logo-text"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            SafeTrail
          </motion.span>
        </Link>
      </div>
      
      <div className="navbar-main">
        <ul className="navbar-links">
          <li>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/">
                <FaHome className="nav-icon" /> Home
              </Link>
            </motion.div>
          </li>
          <li>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/itinerary-planner">
                <FaMapMarkedAlt className="nav-icon" /> Itinerary
              </Link>
            </motion.div>
          </li>
          <li>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link to="/book-ticket">
                <FaPlane className="nav-icon" /> Book Tickets
              </Link>
            </motion.div>
          </li>
          
          {currentUser ? (
            <>
              <li className="wallet-dropdown">
                <motion.button 
                  className="wallet-toggle"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaWallet className="nav-icon" />
                  <span>Wallet</span>
                  <FaChevronDown className="chevron" />
                </motion.button>
                <ul className="wallet-submenu">
                  <motion.li whileHover={{ x: 5 }}>
                    <Link to="/wallet"><FaCoins /> Coin Wallet</Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <Link to="/crypto-wallet"><FaCoins /> Crypto Wallet</Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <Link to="/add-coins"><FaCoins /> Add Coins</Link>
                  </motion.li>
                </ul>
              </li>
              
              <li className="user-dropdown">
                <motion.button 
                  className="user-toggle"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaUserCircle className="nav-icon" />
                  <span>{currentUser.username}</span>
                  <FaChevronDown className="chevron" />
                </motion.button>
                <ul className="user-submenu">
                  <motion.li whileHover={{ x: 5 }}>
                    <Link to="/profile"><FaUser /> Profile</Link>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <button onClick={logout} className="logout-btn">
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/login">
                    <FaUser className="nav-icon" /> Login
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/signup">
                    <FaUserPlus className="nav-icon" /> Sign Up
                  </Link>
                </motion.div>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;