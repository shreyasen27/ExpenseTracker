import React, { useState } from "react";
import LoginForm from "../Components/LoginForm";
import RegisterForm from "../Components/RegisterForm";
import styled from "styled-components";
import authBackground from "../img/expense_tracker.jpeg"; // ✅ Import the background image

const AuthPage = ({ setIsAuthenticated }) => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthContainer bg={authBackground}>
      <Overlay />

      <Content>
        <InfoSection>
          <Title>Welcome to Expense Tracker</Title>
          <Subtitle>Track your finances effortlessly!</Subtitle>
          <Subtitle>Get started by signing in or signing up.</Subtitle>
        </InfoSection>

        <FormContainer>
          {showRegister ? (
            <RegisterForm setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <LoginForm setIsAuthenticated={setIsAuthenticated} />
          )}
          <SwitchButton onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </SwitchButton>
        </FormContainer>
      </Content>
    </AuthContainer>
  );
};

export default AuthPage;

const AuthContainer = styled.div`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${(props) => props.bg}) center/cover no-repeat;
  background-color: #c0392b; /* ✅ Fallback red shade */
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* ✅ Slightly darker overlay for readability */
  backdrop-filter: blur(6px);
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  z-index: 10;
  color: #ffe6c7; /* ✅ Soft cream shade for better contrast */
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* ✅ Subtle shadow for text readability */
`;

const InfoSection = styled.div`
  max-width: 450px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  margin-bottom: 5px;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.9); /* ✅ Light but slightly transparent for style */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 380px;
`;

const SwitchButton = styled.button`
  margin-top: 15px;
  background: transparent;
  border: none;
  color: #8b0000; /* ✅ Dark red for better contrast */
  font-size: 16px;
  font-weight: bold;
  padding: 8px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
