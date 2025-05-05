import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import '../styles/DuvidasTutor.css';

const DuvidasTutor = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const subjects = ['Matemática', 'Ciências', 'Física', 'Química', 'Português', 'Inglês', 'História', 'Geografia'];
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [monitoringLink1, setMonitoringLink1] = useState('');
  const [monitoringLinkSent, setMonitoringLinkSent] = useState(false);
  const whatsapp_tutor = localStorage.getItem("whatsapp");
  const [nomeTutor, setNomeTutor] = useState("Nome do Tutor");

  // Navegação para outra página
  const navigate = useNavigate(); // Hook para navegação programática

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("Fetching questions...", whatsapp_tutor);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tutors/questions/${whatsapp_tutor}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
        const data = await response.json(); // Supondo que você espere uma resposta JSON
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Map API response to component state structure
        const mappedQuestions = data.map(item => ({
          id: item.id,
          whatsapp_aluno: item.whatsapp_aluno,
          whatsapp_tutor: item.whatsapp_tutor,
          subject: item.materia,
          text: item.pergunta,
          answered: item.status === "Respondida",
          monitoringLink: item.monitoringLink || ''
        }));
        
        setQuestions(mappedQuestions);
        
        // Apply current subject filter
        const filtered = selectedSubject 
          ? mappedQuestions.filter(q => q.subject === selectedSubject)
          : mappedQuestions;
        
        setFilteredQuestions(filtered);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    const intervalId = setInterval(fetchQuestions, 15000);
    return () => clearInterval(intervalId);
  }, [selectedSubject]);

  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) {
      setNomeTutor(nome);
    }
  }, []);

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    console.log(filteredQuestions);
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setMonitoringLink1(question.monitoringLink);
    console.log("Selected question:", question);
    console.log("Monitoring link:", monitoringLink1);
  };

  const handleAnswerQuestion = () => {
    if (selectedQuestion) {
      const updatedQuestion = {
        whatsapp_aluno: selectedQuestion.whatsapp_aluno,
        whatsapp_tutor: localStorage.getItem("whatsapp"),
        materia: selectedQuestion.subject,
        pergunta: selectedQuestion.text,
        status: "Respondida",
        monitoringLink: monitoringLink1
      };
  
      const updatedQuestions = questions.map(q => 
        q.id === selectedQuestion.id ? updatedQuestion : q
      );
      
      updateQuestionStatus(selectedQuestion.id, updatedQuestion);
      
      setQuestions(updatedQuestions);
      setFilteredQuestions(
        selectedSubject 
          ? updatedQuestions.filter(q => q.subject === selectedSubject)
          : updatedQuestions
      );
      setSelectedQuestion(null);

      localStorage.setItem('monitoringLinkSent', 'true');
      setMonitoringLinkSent(true);
    }
  };

  const updateQuestionStatus = async (questionId, updatedQuestion) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tutors/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestion),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update question status");
      }
    } catch (error) {
      console.error("Error updating question status:", error);
    }
  };

  return (
    <div className="duvidas-tutor-container">
      <div className="logo-container">
        <img src="/path/logo" alt="ParaCasa Logo" className="logo" />
      </div>
      
      <motion.div 
        className="tutor-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <motion.div 
        className="tutor-name-circle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {nomeTutor}
      </motion.div>
        {/* 
        <div className="header-content">
          <div className="availability-toggle">
            <span>Disponível para dar aula</span>
            <motion.label 
              className="switch"
              whileTap={{ scale: 0.95 }}
            >
              <input type="checkbox" />
              <span className="slider round"></span>
            </motion.label>
          </div>
          */}
          <div className="header-buttons">
            <motion.button 
              className="header-button active"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dúvidas
            </motion.button>
            <motion.button 
              className="header-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/tutor-dashboard')} // Usando o navigate
            >
              Voltar
            </motion.button>
            {/*
            </motion.button>
            <motion.button 
              className="header-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
              Relatório
            </motion.button>
            <motion.button 
              className="header-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Histórico
            */}

        </div>
      </motion.div>
      
      <div className="filter-section">
        <select 
          onChange={(e) => handleSubjectChange(e.target.value)} 
          value={selectedSubject}
          className="subject-filter"
        >
          <option value="">Todas as Matérias</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className="questions-container">
        {filteredQuestions.map((question) => (
          <motion.div 
            key={question.id}
            className={`question-card ${selectedQuestion?.id === question.id ? 'selected' : ''} ${question.answered ? 'answered' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleQuestionSelect(question)}
          >
            <div className="question-header">
              <span className="subject-tag">{question.subject}</span>
              {question.answered && <span className="answered-tag">Respondida</span>}
              {!question.answered && <span className="pending-tag">Pendente</span>}
            </div>
            <p className="question-text">{question.text}</p>
          </motion.div>
        ))}

        {selectedQuestion && !selectedQuestion.answered && (
          <motion.div 
            className="answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="input-container">
              <input 
                type="text" 
                placeholder="Link da Monitoria" 
                className="monitoring-input"
                value={monitoringLink1}
                onChange={(e) => setMonitoringLink1(e.target.value)}
              />
              <motion.button 
                className="send-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnswerQuestion}
              >
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DuvidasTutor;
