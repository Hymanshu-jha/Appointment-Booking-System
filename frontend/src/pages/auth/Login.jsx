import React, { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = window.location.origin;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { email, password };

    fetch(`${apiUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result?.success) {
          // Redirect or handle success
          window.location.href = `${baseUrl}/services`;
        } else {
          setErrorMsg(result?.message || 'Login failed.');
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg('An error occurred during login.');
      });
  };



  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-950 px-4">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-100 p-10 rounded-lg shadow-2xl w-full max-w-4xl">
        
        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-purple-800 text-center mb-2">
            Log In
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-400 p-2 rounded focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-400 p-2 rounded focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button
            type="submit"
            className="bg-purple-800 text-white py-2 rounded hover:bg-purple-900 transition-colors"
          >
            Log In
          </button>

          {errorMsg && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {errorMsg}
            </p>
          )}
        </form>

        {/* Divider Line */}
        <div className="hidden md:block w-px h-full bg-gray-400"></div>

        {/* Google Login Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-gray-800 text-lg mb-4">Or Log in using</h1>
         <a
  href={`${apiUrl}/oauth/auth/google`}
  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded transition text-center block"
>
  Google
</a>

        </div>
      </div>
    </div>
  );
};

export default Login;
