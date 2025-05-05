import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/TelaAluno.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TelaAluno = () => {
  const [quantidadeProfessores, setQuantidadeProfessores] = useState(0);
  const [disciplinas, setDisciplinas] = useState([]);
  const [questionSent, setQuestionSent] = useState(() => {
    return localStorage.getItem('questionSent') === 'true';
  });
  const [nomeAluno, setNomeAluno] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) setNomeAluno(nome);
  }, []);

  // Busca número de professores online
  const fetchQuantidadeProfessores = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tutors/quantidade_tutores_disponiveis`);
      const data = await resp.json();
      if (resp.ok && data.quantidade_tutores !== undefined) {
        setQuantidadeProfessores(data.quantidade_tutores);
      }
    } catch (err) {
      console.error('Erro ao buscar professores disponíveis:', err);
    }
  };

  // Busca contagem de cada disciplina
  const fetchQuantidadeDisciplinas = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tutors/quantidade_disciplinas`);
      const data = await resp.json();
      if (resp.ok && data.quantidade_disciplinas !== undefined) {
        setDisciplinas(data.quantidade_disciplinas);
      }
    } catch (err) {
      console.error('Erro ao buscar disciplinas:', err);
    }
  };

  // initial fetch + polling both endpoints
  useEffect(() => {
    fetchQuantidadeProfessores();
    fetchQuantidadeDisciplinas();
    const intervalId = setInterval(() => {
      fetchQuantidadeProfessores();
      fetchQuantidadeDisciplinas();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const subjects = [
    { name: 'Matemática', icon: '📊' },
    { name: 'Ciências', icon: '🔬' },
    { name: 'Física', icon: '⚛️' },
    { name: 'Química', icon: '🧪' },
    { name: 'Português', icon: '📖' },
    { name: 'Inglês', icon: '🌐' },
    { name: 'História', icon: '🏛️' },
    { name: 'Geografia', icon: '🌍' }
  ];

  // monta array com contagens vindas da API
  const updatedSubjects = subjects.map(subj => {
    const disc = disciplinas.find(d => d._id === subj.name);
    return {
      ...subj,
      quantidade: disc ? disc.count : 0
    };
  });

  return (
    <div className="tela-aluno-container">
      <div className='container1'>
        <div className="logo-container">
          <img src="/path/logo" alt="ParaCasa Logo" className="logo" />
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
              onClick={() => {
                if (!questionSent) {
                  navigate("/agendar-aula");
                } else {
                  toast.warning(
                    'Você precisa enviar o feedback para sua última dúvida primeiro!',
                    { progressStyle: { background: '#6f42c1' }, autoClose: 5000 }
                  );
                }
              }}
            >
              Agendar uma aula
            </motion.button>
            <motion.button
              className="header-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/historico-questoes")}
            >
              Histórico
            </motion.button>
          </div>
        </motion.div>

        <div className="content-container">
          <div className="online-teachers-info">
            <span>Número de Professores Online: {quantidadeProfessores}</span>
          </div>

          <motion.div
            className="subjects-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {updatedSubjects.map((subject, index) => (
              <motion.div
                key={index}
                className="subject-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="subject-name">{subject.name}</span>
                <div className="subject-numbers">
                  <span>{subject.icon}</span>
                  <span>{subject.quantidade}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TelaAluno;
