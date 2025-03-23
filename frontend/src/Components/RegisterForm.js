import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const RegisterForm = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const API_URL=process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        '${API_URL}/api/v1/auth/register',
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
      <Input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
      <Input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />

      {/* ✅ Gender dropdown */}
      <Select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="" disabled>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </Select>

      <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

      <Button type="submit">Register</Button>
    </FormContainer>
  );
};

export default RegisterForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 350px; /* Slightly bigger form */
  margin: auto;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

/* ✅ Styled select dropdown */
const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background: white;
  cursor: pointer;
`;

const Button = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s ease-in-out;

  &:hover {
    background: #218838;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;
