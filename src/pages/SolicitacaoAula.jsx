import React, { useState } from "react";
import axios from "axios";
import "../styles/SolicitacaoAula.css";

const SolicitacaoAula = () => {
    const [formData, setFormData] = useState({ whatsapp_estudante: "", disciplina: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/students/solicitar_aula`, 
                formData
            );
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data.error || "Erro ao solicitar aula");
        }
    };
    

    return (
        <div className="solicitacao-container">
            <h2>Solicitar Aula</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="whatsapp_estudante" placeholder="Seu WhatsApp" onChange={handleChange} required />
                <input type="text" name="disciplina" placeholder="Disciplina desejada" onChange={handleChange} required />
                <button type="submit">Solicitar Aula</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SolicitacaoAula;
