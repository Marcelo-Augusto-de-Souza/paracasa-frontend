import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { loginUser } from "../api/auth"; // Função que chama o backend

const LoginPage = () => {
  const { userType } = useParams(); // Captura se é "tutor" ou "estudante"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(userType, email, password);
      alert("Login realizado com sucesso!");
    } catch (err) {
      setError("Erro no login. Verifique seus dados.");
    }
  };

  return (
    <div className="login-page">
      <h1>Login - {userType.charAt(0).toUpperCase() + userType.slice(1)}</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;
