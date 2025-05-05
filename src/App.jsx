import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSelection from "./components/LoginSelection";
import TutorCadastro from "./pages/TutorCadastro";
import TutorLogin from "./pages/TutorLogin";
import TelaTutor from "./pages/TelaTutor";
import TelaAluno from "./pages/TelaAluno";
import SolicitacaoAula from "./pages/SolicitacaoAula";
import StudentCadastro from "./pages/StudentCadastro";
import StudentLogin from "./pages/StudentLogin";
import DuvidasTutor from "./pages/DuvidasTutor";
import AgendarAula from "./pages/AgendarAula";
import HistoricoQuestoes from "./pages/HistoricoQuestoes";
import Feedback from "./pages/Feed_back";
import AdminPage from "./pages/AdminPage";
import {ToastContainer} from 'react-toastify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelection />} />
        <Route path="/cadastro/tutor" element={<TutorCadastro />} />
        <Route path="/login/tutor" element={<TutorLogin />} />
        <Route path="/tutor-dashboard" element={<TelaTutor />} /> 
        <Route path="/tela-aluno" element={<TelaAluno />} />
        <Route path="/solicitar-aula" element={<SolicitacaoAula />} />
        <Route path="/cadastro/estudante" element={<StudentCadastro />} />
        <Route path="/login/estudante" element={<StudentLogin />} />
        <Route path="/duvidas-tutor" element={<DuvidasTutor />} />
        <Route path="/agendar-aula" element={<AgendarAula />} />
        <Route path="/historico-questoes" element={<HistoricoQuestoes />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <ToastContainer/>
    </Router>
  );
}

export default App;
