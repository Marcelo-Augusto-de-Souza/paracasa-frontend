import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/StudentCadastro.css";

const StudentCadastro = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cpf: "",
        nome: "",
        email: "",
        senha: "",
        whatsapp: "",
        instituicao: "",
    });

    // Função para formatar o número de WhatsApp
    const formatarWhatsApp = (numero) => {
        // Remove todos os caracteres não numéricos
        const numeros = numero.replace(/\D/g, '');

        // Aplica a formatação conforme o usuário digita
        if (numeros.length <= 2) {
            return `+${numeros}`;
        } else if (numeros.length <= 4) {
            return `+${numeros.slice(0, 2)} ${numeros.slice(2)}`;
        } else if (numeros.length <= 9) {
            return `+${numeros.slice(0, 2)} ${numeros.slice(2, 4)} ${numeros.slice(4)}`;
        } else {
            return `+${numeros.slice(0, 2)} ${numeros.slice(2, 4)} ${numeros.slice(4, 9)}-${numeros.slice(9, 13)}`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Aplica a formatação apenas para o campo "whatsapp"
        if (name === "whatsapp") {
            const formattedValue = formatarWhatsApp(value);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/students/register`,
            formData
          );
          alert("Cadastro realizado com sucesso!");
          navigate("/tela-aluno");
        } catch (error) {
          alert(error.response?.data.error || "Erro ao cadastrar");
        }
      };
      
    return (
        <div className="student-cadastro-container">
            <div className="cadastro-box">
                <h2>Cadastro de Estudante</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} required />
                    <input type="text" name="nome" placeholder="Nome Completo" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
                    <input
                        type="text"
                        name="whatsapp"
                        placeholder="WhatsApp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                    />
                    <input type="text" name="instituicao" placeholder="Instituição (Escola)" onChange={handleChange} required />
                    <button type="submit">Cadastrar</button>
                </form>
                <p className="login-link">
                    Já tem uma conta? <a href="/login/estudante">Faça login</a>
                </p>
            </div>
        </div>
    );
};

export default StudentCadastro;