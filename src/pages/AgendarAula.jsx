import React, { useState, useEffect  } from 'react';
import { motion } from 'framer-motion';
import '../styles/AgendarAula.css';
import { useNavigate } from 'react-router-dom';


const subjects = [
  'Matemática', 'Ciências', 'Física', 'Química', 
  'Português', 'Inglês', 'História', 'Geografia'
];

const AgendarAula = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [fileAttached, setFileAttached] = useState(null);
  const [shareWithColleagues, setShareWithColleagues] = useState(false);
  const navigate = useNavigate();
  const [nomeAluno, setNomeAluno] = useState("");
  
  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) {
      setNomeAluno(nome);
    }
  }, []);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileAttached(file);
  };

  const handleSubmitQuestion = () => {
    if (!selectedSubject || !questionText) {
      alert('Por favor, selecione uma matéria e escreva sua dúvida.');
      return;
    }

    // Here you would typically send the question to your backend
    const questionData = {
      subject: selectedSubject,
      question: questionText,
      file: fileAttached,
      shareWithColleagues: shareWithColleagues
    };

    const formData = {
      whatsapp_aluno: localStorage.getItem('whatsapp'), // Replace with actual student ID
      whatsapp_tutor: "", // Replace with actual tutor ID
      materia: selectedSubject,
      pergunta: questionText,
      status: "Pendente", // or any default status you want
      monitoringLink: ""
    };

  // Send the question to the backend
  fetch(`${import.meta.env.VITE_BACKEND_URL}/students/solicitar_aula`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to submit question");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Question submitted successfully:", data);
      
      // Store that a question has been sent
      localStorage.setItem('questionSent', 'true');
      localStorage.setItem('questionId', data.id); // Store the question ID
    })
    .catch((error) => {
      console.error("Error submitting question:", error);
    });

    console.log('Pergunta enviada:', formData);

    // Reset form
    setSelectedSubject('');
    setQuestionText('');
    setFileAttached(null);
    setShareWithColleagues(false);
    navigate("/tela-aluno");
  };

  return (
    <div className="agendar-aula-container">
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
          {nomeAluno || "Nome do Aluno"}
        </motion.div>


        <div className="header-buttons">
          <motion.button 
            className="header-button active"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Agendar uma aula
          </motion.button>
          {/*
          <motion.button 
            className="header-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Relatório
          
          </motion.button>
          */}
          <motion.button 
            className="header-button"
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
      

      <motion.div 
        className="question-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-header">
          <h2>Tire sua dúvida escolar</h2>
          <button className="close-button">×</button>
        </div>

        <div className="subject-select">
          <label>Matéria</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Selecione uma matéria</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="file-upload">
          <label 
            htmlFor="file-upload" 
            className="file-upload-button"
          >
            📎 ADICIONAR ARQUIVO
          </label>
          <input 
            id="file-upload"
            type="file" 
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {fileAttached && (
            <span className="file-name">{fileAttached.name}</span>
          )}
        </div>

        <div className="question-input">
          <textarea 
            placeholder="Escreve aqui sua dúvida. Adicione fotos e formulas para entendermos sua dúvida ainda melhor e conseguir uma ótima resposta :)"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          ></textarea>
        </div>

        <div className="share-option">
          <input 
            type="checkbox"
            id="share-colleagues"
            checked={shareWithColleagues}
            onChange={() => setShareWithColleagues(!shareWithColleagues)}
          />
          <label htmlFor="share-colleagues">
            Compartilhar pergunta com meus colegas
          </label>
        </div>

        <motion.button 
          className="submit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmitQuestion}
        >
          ENVIAR PERGUNTA
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AgendarAula;