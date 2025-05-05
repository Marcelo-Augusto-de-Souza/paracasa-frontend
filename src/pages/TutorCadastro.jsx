import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/TutorCadastro.css";

const TutorCadastro = () => {
    const [formData, setFormData] = useState({
        cpf: "",
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        whatsapp: "",
        matricula: "",
        instituicao: "",
        curso: "",
        cra: "",
        tipoIngresso: "",
        notaEnem: "",
        anoEnem: "",
        notaVestibular: "",
        anoVestibular: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    // Função para formatar o número de WhatsApp
    const formatarWhatsApp = (numero) => {
        const numeros = numero.replace(/\D/g, '');
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
        let { name, value } = e.target;

        // Formata o WhatsApp automaticamente
        if (name === "whatsapp") {
            value = formatarWhatsApp(value);
        }

        // Converte campos numéricos
        if (["cra", "notaEnem", "anoEnem", "notaVestibular", "anoVestibular"].includes(name)) {
            value = value ? Number(value) : null;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.senha !== formData.confirmarSenha) {
            setErrorMessage("As senhas não coincidem!");
            return;
        }

        setErrorMessage("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tutors/register`, formData);
            alert("Tutor cadastrado com sucesso!");
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao cadastrar tutor:", error.response?.data || error.message);
            alert(error.response?.data.message || "Erro ao cadastrar tutor");
        }
    };

    return (
        <motion.div
            className="tutor-cadastro-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Cadastro de Tutor</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} required />
                <input type="text" name="nome" placeholder="Nome Completo" onChange={handleChange} required />
                <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
                <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
                <input type="password" name="confirmarSenha" placeholder="Confirme sua Senha" onChange={handleChange} required />
                <input type="text" name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} required />
                <input type="text" name="matricula" placeholder="Matrícula" onChange={handleChange} required />
                <input type="text" name="instituicao" placeholder="Instituição" onChange={handleChange} required />
                <input type="text" name="curso" placeholder="Curso" onChange={handleChange} required />
                <input type="number" name="cra" placeholder="CRA" onChange={handleChange} min="0" max="100" required />

                <div className="radio-group">
                    <label>
                        <input type="radio" name="tipoIngresso" value="ENEM" onChange={handleChange} />
                        ENEM
                    </label>
                    <label>
                        <input type="radio" name="tipoIngresso" value="VESTIBULAR" onChange={handleChange} />
                        Vestibular
                    </label>
                </div>

                <AnimatePresence>
                    {formData.tipoIngresso === "ENEM" && (
                        <motion.div
                            className="conditional-fields"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <input type="number" name="notaEnem" placeholder="Nota ENEM" onChange={handleChange} min="0" max="1000" required />
                            <input type="number" name="anoEnem" placeholder="Ano ENEM" onChange={handleChange} min="1998" max="2025" required />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {formData.tipoIngresso === "VESTIBULAR" && (
                        <motion.div
                            className="conditional-fields"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <input type="number" name="notaVestibular" placeholder="Nota Vestibular" onChange={handleChange} min="0" max="1000" required />
                            <input type="number" name="anoVestibular" placeholder="Ano Vestibular" onChange={handleChange} min="1998" max="2025" required />
                        </motion.div>
                    )}
                </AnimatePresence>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit">Cadastrar</button>
            </form>
        </motion.div>
    );
};

export default TutorCadastro;