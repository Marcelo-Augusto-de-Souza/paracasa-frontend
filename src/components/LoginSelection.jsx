import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/LoginSelection.css";

const LoginSelection = () => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleDonate = () => {
    window.open("https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=SUA_PREFERENCE_ID", "_blank");
  };

  return (
    <motion.div
      className="login-selection-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1>Bem-vindo ao Sistema</h1>
      <h2>Escolha sua função</h2>

      <div className="buttons">
        <motion.button
          onClick={() => setUserType("tutor")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sou Tutor
        </motion.button>
        <motion.button
          onClick={() => setUserType("estudante")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sou Estudante
        </motion.button>
      </div>

      <motion.button
        className="buttons"
        style={{ backgroundColor: "#3498db", color: "#fff" }} // Cor de fundo e texto
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = "https://link.mercadopago.com.br/paracasa"}
      >
        Fazer Doação
      </motion.button>

      {userType && (
        <motion.div
          className="options"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate(`/login/${userType}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Fazer Login
          </motion.button>
          <motion.button
            onClick={() => navigate(`/cadastro/${userType}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Criar Conta
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoginSelection;
