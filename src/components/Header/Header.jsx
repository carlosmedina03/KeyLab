import './Header.css';

export default function Header() {
  return (
    <header className="header" id="header">
      <div className="header-inner">
        <div className="header-logo">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="key-icon"
            >
              <path
                d="M12 2C9.24 2 7 4.24 7 7C7 8.8 7.87 10.39 9.22 11.34L4 21H8L9.5 18H14.5L16 21H20L14.78 11.34C16.13 10.39 17 8.8 17 7C17 4.24 14.76 2 12 2ZM10.5 15L12 12.18L13.5 15H10.5ZM12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9Z"
                fill="url(#keyGradient)"
              />
              <defs>
                <linearGradient id="keyGradient" x1="4" y1="2" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="logo-text">
            <span className="logo-key">Key</span>
            <span className="logo-lab">Lab</span>
          </h1>
        </div>
        <p className="header-tagline">
          Generador Algorítmico & Evaluador de Entropía Reactivo
        </p>
      </div>
      <div className="header-glow" />
    </header>
  );
}
