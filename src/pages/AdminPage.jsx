import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [userType, setUserType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [cities, setCities] = useState([]);
  
  // Stats tab state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [classStats, setClassStats] = useState(null);
  const [banProfessorName, setBanProfessorName] = useState('');
  const [banProfessorUniversity, setBanProfessorUniversity] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, these would come from API calls
    const mockUsers = [
      {
        id: 1, 
        type: 'tutor', 
        nome: 'CARLOS LIMA', 
        universidade: 'UFU', 
        curso: 'ENGENHARIA DE COMPUTAÇÃO', 
        disciplinas: ['MATEMÁTICA', 'FÍSICA'], 
        status: 'ATIVO',
        cidade: 'UBERLÂNDIA'
      },
      {
        id: 2, 
        type: 'tutor', 
        nome: 'MARIA SANTOS', 
        universidade: 'UNESP', 
        curso: 'CIÊNCIAS DA COMPUTAÇÃO', 
        disciplinas: ['QUÍMICA', 'BIOLOGIA'], 
        status: 'ATIVO',
        cidade: 'SÃO PAULO'
      },
      {
        id: 3, 
        type: 'student', 
        nome: 'JOÃO SILVA', 
        whatsapp: '+55 11 99999-9999', 
        estado: 'MG', 
        cidade: 'UBERLÂNDIA', 
        escola: 'ESCOLA MUNICIPAL DR. JOEL CUPERTINO', 
        serie_ano: '6o'
      },
      {
        id: 4, 
        type: 'student', 
        nome: 'ANA OLIVEIRA', 
        whatsapp: '+55 11 88888-8888', 
        estado: 'SP', 
        cidade: 'SÃO PAULO', 
        escola: 'COLÉGIO ESTADUAL ANÍSIO TEIXEIRA', 
        serie_ano: '9o'
      }
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    
    // Extract unique cities
    const uniqueCities = [...new Set(mockUsers.map(user => user.cidade))];
    setCities(uniqueCities);
  }, []);

  // Filter users based on search term, city, and type
  useEffect(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (cityFilter) {
      filtered = filtered.filter(user => user.cidade === cityFilter);
    }
    
    if (userType !== 'all') {
      filtered = filtered.filter(user => user.type === userType);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, cityFilter, userType, users]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const fetchClassStats = () => {
    // In a real app, this would be an API call
    setClassStats({
      totalClasses: 132,
      totalProfessors: 45,
      totalStudents: 267
    });
  };

  const handleBanProfessor = () => {
    if (banProfessorName && banProfessorUniversity) {
      // In a real app, this would be an API call
      alert(`Professor ${banProfessorName} from ${banProfessorUniversity} has been banned.`);
      setBanProfessorName('');
      setBanProfessorUniversity('');
    }
  };

  return (
        <div className="admin-page-container">
        <div className="logo-container">
            <img src="/path-to-paracasa-logo.png" alt="ParaCasa Logo" className="logo" />
        </div>
        
        <motion.div 
            className="admin-header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="admin-circle-container">
                <motion.div 
                    className="admin-name-circle"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Admin
                </motion.div>
            
                <div className="action-buttons">
                    <motion.button
                    className="bg-red-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                    Sair
                    </motion.button>
                    <motion.button
                    className="bg-blue-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    >
                    Informações
                    </motion.button>
                </div>
            </div>
            
            
        </motion.div>
        <div className="tabs-container">
                <div className="os-style-tabs">
                    <motion.div 
                    className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
                    style={{ 
                        backgroundColor: activeTab === 'users' ? '#6f42c1' : 'white',
                        color: activeTab === 'users' ? 'white' : '#6f42c1',
                        fontWeight: activeTab === 'users' ? 'bold' : 'normal'
                    }}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveTab('users')}
                    >
                    Usuários
                    </motion.div>
                    <motion.div 
                    className={`tab-item ${activeTab === 'stats' ? 'active' : ''}`}
                    style={{ 
                        backgroundColor: activeTab === 'stats' ? '#6f42c1' : 'white',
                        color: activeTab === 'stats' ? 'white' : '#6f42c1',
                        fontWeight: activeTab === 'stats' ? 'bold' : 'normal',
                        marginLeft: '4px'
                    }}
                    whileHover={{ y: -2 }}
                    onClick={() => setActiveTab('stats')}
                    >
                    Configurações
                    </motion.div>
                </div>
                
                <div className="tab-indicators">
                    <div style={{ backgroundColor: activeTab === 'users' ? '#6f42c1' : 'transparent' }}></div>
                    <div style={{ backgroundColor: activeTab === 'stats' ? '#6f42c1' : 'transparent' }}></div>
                </div>
            </div>

        {activeTab === 'users' && (
            <div className="users-tab">
            <div className="search-filters">
                <div style={{ flex: 1, minWidth: '256px' }}>
                <input 
                    type="text" 
                    placeholder="Buscar por nome..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                <div style={{ minWidth: '128px' }}>
                <select 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                >
                    <option value="">Todas as cidades</option>
                    {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                </div>
                <div style={{ minWidth: '144px' }}>
                <select 
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                >
                    <option value="all">Todos</option>
                    <option value="tutor">Tutores</option>
                    <option value="student">Estudantes</option>
                </select>
                </div>
            </div>

            <div className="user-content">
                <div className="users-list-container" style={{ maxWidth: '400px' }}>
                <div className="users-list">
                    {filteredUsers.map(user => (
                    <motion.div
                        key={user.id}
                        className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                        style={{
                        backgroundColor: selectedUser?.id === user.id ? '#f0e6ff' : '#f8f8f8',
                        border: selectedUser?.id === user.id ? '2px solid #6f42c1' : '1px solid #e2e2e2'
                        }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => handleUserClick(user)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            backgroundColor: user.type === 'tutor' ? '#6f42c1' : '#3182ce',
                            color: 'white'
                        }}>
                            {user.type === 'tutor' ? 'Tutor' : 'Estudante'}
                        </span>
                        {user.type === 'tutor' && (
                            <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            backgroundColor: user.status === 'ATIVO' ? '#38a169' : '#e53e3e',
                            color: 'white'
                            }}>
                            {user.status}
                            </span>
                        )}
                        </div>
                        <h3 style={{ fontWeight: '600' }}>{user.nome}</h3>
                        <p style={{ color: '#4a5568', fontSize: '14px' }}>
                        {user.type === 'tutor' ? user.universidade : user.escola}
                        </p>
                        <p style={{ color: '#4a5568', fontSize: '14px' }}>
                        {user.cidade}
                        </p>
                    </motion.div>
                    ))}
                </div>
                </div>

                {selectedUser && (
                <motion.div 
                    className="user-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 style={{ fontSize: '20px', color: '#6f42c1', fontWeight: '700', marginBottom: '16px' }}>
                    {selectedUser.nome}
                    </h2>
                    
                    {selectedUser.type === 'tutor' ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <p style={{ fontWeight: '600' }}>Universidade:</p>
                            <p>{selectedUser.universidade}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Curso:</p>
                            <p>{selectedUser.curso}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Disciplinas:</p>
                            <p>{selectedUser.disciplinas.join(', ')}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Status:</p>
                            <p>{selectedUser.status}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Cidade:</p>
                            <p>{selectedUser.cidade}</p>
                        </div>
                        </div>
                    </div>
                    ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <p style={{ fontWeight: '600' }}>WhatsApp:</p>
                            <p>{selectedUser.whatsapp}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Estado:</p>
                            <p>{selectedUser.estado}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Cidade:</p>
                            <p>{selectedUser.cidade}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Escola:</p>
                            <p>{selectedUser.escola}</p>
                        </div>
                        <div>
                            <p style={{ fontWeight: '600' }}>Série/Ano:</p>
                            <p>{selectedUser.serie_ano}</p>
                        </div>
                        </div>
                    </div>
                    )}
                </motion.div>
                )}
            </div>
            </div>
        )}

        {activeTab === 'stats' && (
            <div className="stats-tab">
            <div className="stats-section">
                <h2>Período de Aulas</h2>
                <div className="search-filters">
                <div style={{ flex: 1, minWidth: '192px' }}>
                    <label>Data Inicial:</label>
                    <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '192px' }}>
                    <label>Data Final:</label>
                    <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchClassStats}
                    >
                    Buscar
                    </motion.button>
                </div>
                </div>

                {classStats && (
                <div className="stats-display">
                    <div style={{ backgroundColor: '#f8f0ff' }}>
                    <h3 style={{ color: '#6f42c1' }}>Total de Aulas</h3>
                    <p>{classStats.totalClasses}</p>
                    </div>
                    <div style={{ backgroundColor: '#ebf8ff' }}>
                    <h3 style={{ color: '#3182ce' }}>Total de Professores</h3>
                    <p>{classStats.totalProfessors}</p>
                    </div>
                    <div style={{ backgroundColor: '#f0fff4' }}>
                    <h3 style={{ color: '#38a169' }}>Total de Estudantes</h3>
                    <p>{classStats.totalStudents}</p>
                    </div>
                </div>
                )}
            </div>

            <div className="ban-section">
                <h2>Banir Professor</h2>
                <div className="search-filters">
                <div style={{ flex: 1, minWidth: '192px' }}>
                    <label>Nome:</label>
                    <input 
                    type="text" 
                    placeholder="Nome do Professor" 
                    value={banProfessorName}
                    onChange={(e) => setBanProfessorName(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '192px' }}>
                    <label>Universidade:</label>
                    <input 
                    type="text" 
                    placeholder="Universidade" 
                    value={banProfessorUniversity}
                    onChange={(e) => setBanProfessorUniversity(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <motion.button 
                    className="bg-red-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBanProfessor}
                    >
                    Banir
                    </motion.button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
  );
};

export default AdminPage;