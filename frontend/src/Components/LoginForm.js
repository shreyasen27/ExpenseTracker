import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const LoginForm = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
      }
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <Button type="submit">Login</Button>
    </FormContainer>
  );
};

export default LoginForm;


const FormContainer = styled.form`
  display:flex;
flex-direction: column;
  gap: 20px;
  
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
  width: 420px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  
background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  

  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
  
  &:hover {
    background: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;
