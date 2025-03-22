import React, { useState, useEffect } from "react";
import styled from "styled-components";
import avatarMale from "../../img/avatar.png";
import avatarFemale from "../../img/avatar_female.jpg";
import defaultAvatar from "../../img/default_avatar.jpg"; // New default avatar
import { signout } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";

function Navigation({ active, setActive, setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🔄 Fetching latest user data...");
  
        // Clear localStorage before fetching new data
        localStorage.removeItem("user");
  
        const response = await fetch("http://localhost:5000/api/v1/user/me", {
          credentials: "include",
        });
  
        if (!response.ok) {
          console.error(`❌ API Error: ${response.status} ${response.statusText}`);
          return;
        }
  
        const data = await response.json();
        console.log("✅ Fetched User Data:", data);
  
        if (data && data.firstName) {
          setUser(data); // Set new user state
          localStorage.setItem("user", JSON.stringify(data)); // Save latest data
          console.log("🚀 Updated LocalStorage:", localStorage.getItem("user"));
        }
      } catch (error) {
        console.error("⚠️ Fetch Error:", error);
      }
    };
  
    fetchUser();
  }, []); // Runs only once on mount

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  console.log("📌 User in State:", user);

  // Function to determine avatar based on gender
  const getAvatar = () => {
    const gender = user?.gender?.toLowerCase(); // Convert gender to lowercase
    if (gender === "female") return avatarFemale;
    if (gender === "male") return avatarMale;
    return defaultAvatar; // Fallback avatar if gender is missing or invalid
  };

  return (
    <NavStyled>
      <div className="user-con">
        <AvatarImage src={getAvatar()} alt="User Avatar" />
        <div className="text">
          <h2>{user ? `${user.firstName} ${user.lastName}` : "Loading..."}</h2>
          <p>Your Money</p>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      </div>

      <ul className="menu-items">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={active === item.id ? "active" : ""}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>

      <div className="bottom-nav">
        <li onClick={handleLogout} className="logout">
          {signout} Sign Out
        </li>
      </div>
    </NavStyled>
  );
}

// Styled Components
const NavStyled = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  max-width: 100%;

  .user-con {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .text {
    h2 {
      font-size: 16px;
      margin: 0;
    }

    p {
      font-size: 12px;
      color: gray;
    }
  }

  .menu-items {
    width: 100%;
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #f1f1f1;
        border-radius: 5px;
      }

      &.active {
        background: #007bff;
        color: white;
        border-radius: 5px;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .bottom-nav {
    margin-top: auto;
    
    .logout {
      color: red;
      cursor: pointer;
      padding: 10px;
      font-weight: bold;
      transition: 0.3s;

      &:hover {
        background: #f8d7da;
        border-radius: 5px;
      }
    }
  }
`;

const AvatarImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

export default Navigation;
