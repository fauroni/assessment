import React from 'react';
import { useJwt } from './UserStore';

// Inside the UserLogin component

function UserLogin() {

  const { setJwt } = useJwt();

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/users/login', values);
      console.log('Login successful:', response.data);
      setJwt(response.data.token); // Store the JWT
      actions.setSubmitting(false);
      showMessage('Login successful!', 'success');
      setLocation('/');
    } catch (error) {
      // Error handling code remains the same
    }
  }
  
  return (
    <div>
      <h2>Login</h2>
      {/* Add login form here */}
    </div>
  );


}

export default UserLogin;

