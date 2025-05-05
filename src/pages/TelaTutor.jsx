import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/TelaTutor.css';
import { useNavigate } from 'react-router-dom';
import socket, { joinTutorRoom, leaveTutorRoom } from '../socket';
import { toast } from 'react-toastify';

const TelaTutor = () => {
  const [quantidadeProfessores, setQuantidadeProfessores] = useState(0);
  const [disciplinas, setDisciplinas] = useState([]);
  const subjects = [
    { name: 'Matemática', icon: '📊', area: 'Exatas' },
    { name: 'Ciências', icon: '🔬', area: 'Ciências da Natureza' },
    { name: 'Física', icon: '⚛️', area: 'Ciências da Natureza' },
    { name: 'Química', icon: '🧪', area: 'Ciências da Natureza' },
    { name: 'Português', icon: '📖', area: 'Humanas' },
    { name: 'Inglês', icon: '🌐', area: 'Humanas' },
    { name: 'História', icon: '🏛️', area: 'Humanas' },
    { name: 'Geografia', icon: '🌍', area: 'Humanas' }
  ];

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isAvailable, setIsAvailable] = useState(() => {
    const saved = localStorage.getItem('tutorAvailability');
    return saved ? JSON.parse(saved) : false;
  });
  const [nomeTutor, setNomeTutor] = useState("Nome do Tutor");
  const [menuOpen, setMenuOpen] = useState(false);
  const [materias, setMaterias] = useState(subjects);
  const [filterArea, setFilterArea] = useState("Todas");
  const navigate = useNavigate();
  const [monitoringLinkSent, setMonitoringLinkSent] = useState(() => {
    return localStorage.getItem('monitoringLinkSent') === 'true';
  });
  const email = localStorage.getItem("email");

  // monta updatedSubjects com contagens da API
  const updatedSubjects = subjects.map(subject => {
    const disc = disciplinas.find(d => d._id === subject.name);
    return {
      ...subject,
      quantidade: disc ? disc.count : 0
    };
  });

  // aplica filtro de área
  const displayedSubjects = filterArea === "Todas"
    ? updatedSubjects
    : updatedSubjects.filter(s => s.area === filterArea);

  useEffect(() => {
    const nome = localStorage.getItem("nome");
    if (nome) setNomeTutor(nome);
  }, []);

  const fetchQuantidadeProfessores = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tutors/quantidade_tutores_disponiveis`);
      const data = await resp.json();
      if (resp.ok && data.quantidade_tutores !== undefined) {
        setQuantidadeProfessores(data.quantidade_tutores);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuantidadeDisciplinas = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tutors/quantidade_disciplinas`);
      const data = await resp.json();
      if (resp.ok && data.quantidade_disciplinas !== undefined) {
        setDisciplinas(data.quantidade_disciplinas);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchQuantidadeProfessores();
    fetchQuantidadeDisciplinas();
    // polling both every 5s
    const id = setInterval(() => {
      fetchQuantidadeProfessores();
      fetchQuantidadeDisciplinas();
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!email) return;
    socket.connect();
    joinTutorRoom(email);
    socket.on('new_doubt', data => {
      toast.success(`Nova dúvida em ${data.subject}`, { progressStyle: { background: '#6f42c1' } });
      setIsAvailable(false);
      localStorage.setItem('tutorAvailability', 'false');
      localStorage.setItem('monitoringLinkSent', 'false');
      setTimeout(() => {
        setIsAvailable(true);
        localStorage.setItem('tutorAvailability', 'true');
      }, 300000);
    });
    return () => {
      leaveTutorRoom(email);
      socket.off('new_doubt');
      socket.disconnect();
    };
  }, [email]);

  const toggleSubjectSelection = (materia) => {
    setSelectedSubjects(prev => {
      const updated = prev.includes(materia.name)
        ? prev.filter(n => n !== materia.name)
        : [...prev, materia.name];

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/tutors/disponibilidade`, {
          email,
          whatsapp: localStorage.getItem("whatsapp"),
          materias: updated,
          tempo_minutos: 30
      }).catch(console.error);
      return updated;
    });
  };

  const handleAvailabilityChange = (e) => {
    const want = e.target.checked;
    if (want && !monitoringLinkSent) {
      toast.warning('Você precisa enviar o link da monitoria primeiro!', { autoClose: 5000 });
      return;
    }
    setIsAvailable(want);
    localStorage.setItem('tutorAvailability', JSON.stringify(want));
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/tutors/disponibilidade`, {
      email,
      whatsapp: localStorage.getItem("whatsapp"),
      disponivel: want,
      materias: selectedSubjects,
      tempo_minutos: 30
    }).catch(console.error);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/tutor");
  };

  return (
    <div className="tela-tutor-container">
      <div className={`menu-lateral ${menuOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>×</button>
        <ul>
          <li onClick={handleLogout}>Sair</li>
        </ul>
      </div>
      <div className="menu-icon" onClick={() => setMenuOpen(open => !open)}>☰</div>

      <div className="container1">
        <div className="logo-container">
          <img src="/path/to/logo" alt="ParaCasa Logo" className="logo" />
        </div>

        <motion.div className="tutor-header" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div className="tutor-name-circle" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {nomeTutor}
          </motion.div>
          <div className="header-content">
            <div className="availability-toggle">
              <span>Disponível para dar aula</span>
              <motion.label className="switch" whileTap={{ scale: 0.95 }}>
                <input type="checkbox" checked={isAvailable} onChange={handleAvailabilityChange}/>
                <span className="slider round"></span>
              </motion.label>
            </div>
            <div className="header-buttons">
              <motion.button className="header-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/duvidas-tutor")}>
                Dúvidas
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="content-container">
          <div className="section-header">
            <span>Marque as matérias que deseja auxiliar:</span>
            <div className="online-teachers-info">
              <span>Número de Professores Online: {quantidadeProfessores}</span>
            </div>
          </div>

          <div className="filter-area">
            <label>Filtrar por área:</label>
            <select value={filterArea} onChange={e => setFilterArea(e.target.value)}>
              <option value="Todas">Todas</option>
              <option value="Humanas">Humanas</option>
              <option value="Exatas">Exatas</option>
              <option value="Ciências da Natureza">Ciências da Natureza</option>
            </select>
          </div>

          <motion.div className="subjects-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
            {displayedSubjects.map((subject, idx) => (
              <motion.div key={idx} className="subject-card" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => toggleSubjectSelection(subject)}>
                <span className="subject-name">{subject.name}</span>
                <div className="checkbox-wrapper">
                  {selectedSubjects.includes(subject.name) && <span className="checkmark">✓</span>}
                </div>
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

export default TelaTutor;
