import React from 'react';
import RegisterForm from '../Components/RegisterForm';

const RegisterPage = ({ setIsAuthenticated }) => {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm setIsAuthenticated={setIsAuthenticated} />
    </div>
  );
};

export default RegisterPage;
