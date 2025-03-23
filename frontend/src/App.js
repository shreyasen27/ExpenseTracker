import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import AuthPage from "./pages/AuthPage";  // ✅ Import AuthPage
import { useGlobalContext } from "./context/globalContext.js";
import axios from "axios";

const API_URL=process.env.REACT_APP_API_URL;
function App() {
  const { isAuthenticated, setIsAuthenticated, logout, setUser } = useGlobalContext();
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const checkAuth = async () => {
      try {  
        const res = await axios.get("${API_URL}/api/v1/user/me", {
          withCredentials: true,
        });
        if (res.data) {
          setIsAuthenticated(true);
          setUser(res.data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("❌ Authentication Error:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated, setUser]);

  const orbMemo = useMemo(() => <Orb />, []);

  if (loading) {
    return <LoadingScreen>Loading...</LoadingScreen>;
  }

  return (
    <AppStyled bg={bg}>
      {orbMemo}

      {!isAuthenticated ? (
        <AuthPage setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <MainLayout>
          <Navigation
            active={active}
            setActive={setActive}
            setIsAuthenticated={setIsAuthenticated}
            logout={logout}
          />
          <main>
            {active === 1 ? <Dashboard /> : active === 3 ? <Income /> : <Expenses />}
          </main>
        </MainLayout>
      )}
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  overflow: hidden;
`;

const LoadingScreen = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
`;

export default App;
