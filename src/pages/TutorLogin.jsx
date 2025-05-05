import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/TutorLogin.css";

const TutorLogin = () => {
    const [formData, setFormData] = useState({ email: "", senha: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tutors/login`, formData);
            localStorage.setItem("token", response.data.token); // Salva o token
            localStorage.setItem("nome", response.data.nome); // Salva o nome do tutor
            localStorage.setItem("email", response.data.email); // Salva o email do tutor
            localStorage.setItem("whatsapp", response.data.whatsapp); // Salva o whatsapp do tutor
            localStorage.setItem('monitoringLinkSent', 'true')
            localStorage.removeItem('questionSent');
            localStorage.removeItem('questionId');
            console.log(response.data)
            alert("Login realizado com sucesso!");
            navigate("/tutor-dashboard"); // Redireciona para o dashboard do tutor
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Erro ao fazer login");
        }
    };

    return (
        <motion.div
            className="tutor-login-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Login do Tutor</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
                <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
                <button type="submit">Entrar</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p className="cadastro-link">
                Não tem uma conta? <a href="/cadastro/tutor">Cadastre-se</a>
            </p>
        </motion.div>
    );
};

export default TutorLogin;

TutorLogin.css