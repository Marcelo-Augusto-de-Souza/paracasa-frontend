import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/HistoricoQuestoes.css';
import { useNavigate } from 'react-router-dom';

const HistoricoQuestoes = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [nomeAluno, setNomeAluno] = useState("");
  
  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) {
      setNomeAluno(nome);
    }
  }, []);

  const [filters, setFilters] = useState({
    subject: '',
    status: ''
  });

  const filteredQuestions = questions.filter(question => {
    const subjectMatch = !filters.subject || question.subject === filters.subject;
    const statusMatch = !filters.status || 
      (filters.status === 'answered' && question.answered) ||
      (filters.status === 'pending' && !question.answered);
    
    return subjectMatch && statusMatch;
  });

  const EnviarFeedback = (question) => {
    console.log("Enviando feedback para a pergunta:", question);
    navigate('/feedback', { state: { question } });
  };

  const subjects = [...new Set(questions.map(q => q.subject))];

  useEffect(() => {
    const fetchQuestions = async () => {
        const whatsapp_aluno = localStorage.getItem("whatsapp"); // Replace with the actual student ID logic
        console.log(whatsapp_aluno);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/students/duvidas/${whatsapp_aluno}`);
        const data = await response.json();

        const mappedQuestions = data.map(item => ({
          id: item.id,
          whatsapp_aluno: item.whatsapp_aluno,
          whatsapp_tutor: item.whatsapp_tutor,
          subject: item.materia,
          text: item.pergunta,
          answered: item.status === "Respondida",
          monitoringLink: item.monitoringLink || '',
          createdAt: '2025-03-20'
        }));

        setQuestions(mappedQuestions);
    };
    fetchQuestions();

    // Set up periodic fetching every 5 seconds
    const intervalId = setInterval(fetchQuestions, 15000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="historico-questoes-container">
      <div className="logo-container">
        <img src="path/logo" alt="ParaCasa Logo" className="logo" />
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
          {nomeAluno || "Nome do Aluno"}
        </motion.div>

        <div className="header-buttons">
          <motion.button 
            className="header-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/agendar-aula')} 
          >
            Agendar uma aula
          </motion.button>
          <motion.button 
            className="header-button active"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/historico-questoes')} 
          >
            Histórico
          </motion.button>
          <motion.button 
            className="header-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/tela-aluno')}
          >
            Página Inicial
          </motion.button>
        </div>
      </motion.div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Matéria</label>
          <select 
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
          >
            <option value="">Todas</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">Todos</option>
            <option value="answered">Respondidos</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </div>

      <div className="questions-list">
        {filteredQuestions.map(question => (
          <motion.div 
            key={question.id}
            className="question-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="question-header">
              <span className="subject-tag">{question.subject}</span>
              {question.answered ? (
                <span className="answered-tag">Respondido</span>
              ) : (
                <span className="pending-tag">Pendente</span>
              )}
            </div>
            <p className="question-text">{question.text}</p>
            <div className="question-footer">
              <span className="date">{question.createdAt}</span>
              {question.monitoringLink && (
                <a href={question.monitoringLink} target="_blank" rel="noopener noreferrer" className="monitoring-link">
                  Link da Monitoria
                </a>
              )}
              {question.answered && (
                <motion.button 
                  className="send-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => EnviarFeedback(question)}
                >
                  Enviar Feedback ➤
                </motion.button>
              )}
              
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoricoQuestoes;