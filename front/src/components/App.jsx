import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdicionarGasto from "./AdicionarGasto";
import ListaGastos from "./ListaGastos";
import GraficoGastos from "./GraficoGastos";
import "./styles.css"; // 🔥 Importação do CSS
import Login from "./Login";

const App = () => {
  return (
    <Router>
      <nav  className="navbar">
        <Link className="navbar_button" to="/">Login</Link>
        <Link className="navbar_button" to="/adicionaGastos">Adicionar Gasto</Link>
        <Link className="navbar_button" to="/lista">Lista de Gastos</Link>
        <Link className="navbar_button" to="/graficos">Gráficos</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/adicionaGastos" element={<AdicionarGasto />} />
          <Route path="/lista" element={<ListaGastos />} />
          <Route path="/graficos" element={<GraficoGastos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;