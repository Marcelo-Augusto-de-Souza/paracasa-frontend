import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/StudentLogin.css";

const StudentLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        senha: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/students/login`, formData);
            localStorage.setItem("nome", response.data.estudante.nome);
            localStorage.setItem("email", response.data.estudante.email);
            localStorage.setItem("id", response.data.estudante.id);
            localStorage.setItem("whatsapp", response.data.estudante.whatsapp);
            localStorage.setItem("questionSent", 'false');
            console.log(response.data.estudante);
            alert("Login bem-sucedido!");
            navigate("/tela-aluno");
        } catch (error) {
            alert(error.response?.data.error || "Erro ao fazer login");
        }
    };

    return (
        <div className="student-login-container">
            <div className="login-box">
                <h2>Login do Estudante</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
                    <button type="submit">Entrar</button>
                </form>
                <p className="cadastro-link">
                    Não tem uma conta? <a href="/cadastro/estudante">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
};

export default StudentLogin;