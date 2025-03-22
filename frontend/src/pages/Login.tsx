import React from 'react';
import LoginForm from '../Components/LoginForm';
import styled from "styled-components";
const LoginPage = ({ setIsAuthenticated }) => {
  return (
    
  
    <LoginContainer>
  
      <LoginForm setIsAuthenticated={setIsAuthenticated} />
      </LoginContainer>
    
  );
};

export default LoginPage;
  
const LoginContainer = styled.div`
  
  display: flex;
  margin:10px;
  
  padding:0;
  border:border-box;
  justify-content: center;
  align-items: center;
  gap:10px;
`;