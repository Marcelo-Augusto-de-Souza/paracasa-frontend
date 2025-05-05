import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Feed_back.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Feedback = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { question } = useLocation().state;
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      const feedbackData = {
        id_pergunta: question.id,
        whatsapp_aluno: question.whatsapp_aluno,
        whatsapp_tutor: question.whatsapp_tutor,
        feedback: feedback,
        nota: rating,
        duracao_aula: 60,
        data_aula: new Date().toISOString()
      };

      fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit question");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Question submitted successfully:", data);
          setSubmitted(true); // Set submitted to true

          // Clear the questionSent state after feedback is submitted
          localStorage.removeItem('questionSent');
          localStorage.removeItem('questionId');
        })
        .catch((error) => {
          console.error("Error submitting question:", error);
        });
      
      console.log(feedbackData);

      const mappedQuestion = {
        whatsapp_aluno: localStorage.getItem("whatsapp"),
        whatsapp_tutor: question.whatsapp_tutor,
        pergunta: question.subject,
        materia: question.text,
        status: "Finalizada",
        monitoringLink: question.monitoringLink || '',
      };

      const response = fetch(`http://localhost:5000/tutors/questions/${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedQuestion), // Send the entire question object
      });
      
      console.log(response.ok);

      if (!response.ok) {
        throw new Error("Failed to update question status");
      }

      

    }
  };

  return (
    <motion.div 
      className="feedback-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="logo-container">
        <img src="/path-to-paracasa-logo.png" alt="ParaCasa Logo" className="logo" />
      </div>

      <motion.div 
        className="student-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="student-name-circle"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Nome do Aluno
        </motion.div>

        <div className="header-buttons">
          <motion.button 
            className="header-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tela-aluno")}
          >
            Voltar
          </motion.button>
        </div>
      </motion.div>

      {submitted ?(
        <div className="feedback-success">
          <h2>Feedback Enviado!</h2>
          <p>Obrigado por seu feedback. Volte sempre!</p>
        </div>
      ):(
        <div className="feedback-content">
          <h2>O que achou da Tutoria?</h2>
          
          <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              className={`star ${star <= rating ? 'active' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea 
          className="feedback-textarea"
          placeholder="Compartilhe sua experiência (opcional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
        />

        <motion.button 
          className="submit-feedback-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSubmit()}
          disabled={rating === 0}
        >
          Enviar
        </motion.button>
      </div>
      )}
    </motion.div>
  );
};

export default Feedback;