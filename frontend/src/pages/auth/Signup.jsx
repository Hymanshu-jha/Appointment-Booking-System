import React, { useState } from 'react';

export const Signup = () => {

  const [errorMsg, setErrorMsg] = useState('');

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      setPasswordMatch(false);
      setErrorMsg("Passwords do not match.");
      return;
    } else {
      setPasswordMatch(true);
      setErrorMsg(""); // clear any previous error
    }

    const data = { userName, email, phone, password };

    fetch('http://localhost:5001/api/v1/user/signup', {
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
        if(result.type !== 'success') {
          setErrorMsg(result.message || "An error occurred.");
        } else {
          setErrorMsg("");
          // Optionally redirect user on successful signup
          // e.g. navigate("/login");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Network error. Please try again.");
      });
  };

  const handleClickUsingGmail = (e) => {
    e.preventDefault();

    fetch('http://localhost:5001/api/v1/oauth/auth/google', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.url) {
          window.location.href = data.url;
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to initiate Google login.");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-950 px-4">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-100 p-10 rounded-lg shadow-2xl w-full max-w-4xl">
        {/* Sign Up Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-purple-800 text-center mb-2">
            Sign Up
          </h2>

          <input
            type="text"
            name="userName"
            placeholder="Name"
            className="border border-gray-400 p-2 rounded focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
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
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            className="border border-gray-400 p-2 rounded focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setPassword2(e.target.value)}
            value={password2}
          />
          <input
            type="text"
            name="phone"
            placeholder="Contact"
            className="border border-gray-400 p-2 rounded focus:ring-2 focus:ring-purple-600"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
          <button
            type="submit"
            className="bg-purple-800 text-white py-2 rounded hover:bg-purple-900 transition-colors"
          >
            Sign Up
          </button>

          {!passwordMatch && (
            <p className="text-red-600 text-sm mt-2 text-center">
              Passwords don't match.
            </p>
          )}

          {errorMsg && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {errorMsg}
            </p>
          )}
        </form>

        {/* Divider Line */}
        <div className="hidden md:block w-px h-full bg-gray-400"></div>

        {/* Google Signup Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-gray-800 text-lg mb-4">Or Sign up using</h1>
          <button
            onClick={handleClickUsingGmail}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded transition"
          >
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
