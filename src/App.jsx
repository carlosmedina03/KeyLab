import Header from './components/Header/Header';
import PasswordGenerator from './components/PasswordGenerator/PasswordGenerator';
import PasswordEvaluator from './components/PasswordEvaluator/PasswordEvaluator';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="background-effects">
        <div className="glow-sphere left" />
        <div className="glow-sphere right" />
      </div>

      <Header />
      
      <main className="main-content">
        <div className="grid-container">
          <PasswordGenerator />
          <PasswordEvaluator />
        </div>
      </main>

      <footer className="footer">
        <p>KeyLab &copy; {new Date().getFullYear()} - Herramienta de Seguridad de Contraseñas</p>
      </footer>
    </div>
  );
}

export default App;
