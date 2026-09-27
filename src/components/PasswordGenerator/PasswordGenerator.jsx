import { useState } from 'react';
import { generateAllPasswords, copyToClipboard } from '../../utils/passwordEngine';
import './PasswordGenerator.css';

const ALGO_LABELS = [
  {
    name: 'Estándar',
    tag: 'Leet V1',
    description: 'Sustitución Leet + sufijo numérico',
    icon: '🔑',
  },
  {
    name: 'Passphrase',
    tag: 'Leet V2',
    description: 'Delimitadores + Leet + símbolos',
    icon: '🔐',
  },
  {
    name: 'Alta Entropía',
    tag: 'Leet V3',
    description: 'Intercalado + Leet + CSPRNG',
    icon: '🛡️',
  },
];

export default function PasswordGenerator() {
  const [basePhrase, setBasePhrase] = useState('');
  const [generatedPasswords, setGeneratedPasswords] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!basePhrase.trim()) {
      setError('Ingresa una frase base para generar contraseñas');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      const passwords = await generateAllPasswords(basePhrase);
      setGeneratedPasswords(passwords);
    } catch {
      setError('Error al generar las contraseñas. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy(index) {
    const success = await copyToClipboard(generatedPasswords[index]);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 2000);
    } else {
      setError('Error: Permiso de portapapeles denegado');
      setTimeout(() => setError(''), 3000);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  }

  return (
    <section className="generator-section" id="password-generator">
      <div className="section-header">
        <div className="section-icon">⚡</div>
        <div>
          <h2 className="section-title">Generador de Contraseñas</h2>
          <p className="section-subtitle">Utiliza el Evaluador de Entropía para revizar la fortaleza de tus contraseñas.</p>
        </div>
      </div>

      <div className="generator-card glass-card">
        {/* Input area */}
        <div className="input-group">
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              id="base-phrase-input"
              type="text"
              className="text-input"
              placeholder="Ingresa tu frase base (ej. Hacker Mentor)..."
              value={basePhrase}
              onChange={(e) => {
                setBasePhrase(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <button
            id="btn-generate-pass"
            className={`btn-generate ${isGenerating ? 'generating' : ''}`}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                Generando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Generar
              </>
            )}
          </button>
        </div>

        {/* Error toast */}
        {error && (
          <div className="error-toast">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Generated passwords */}
        {generatedPasswords.length > 0 && (
          <div className="passwords-grid">
            {generatedPasswords.map((password, index) => (
              <div
                key={index}
                className="password-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="password-card-header">
                  <div className="algo-info">
                    <span className="algo-icon">{ALGO_LABELS[index].icon}</span>
                    <div>
                      <span className="algo-name">{ALGO_LABELS[index].name}</span>
                      <span className="algo-tag">{ALGO_LABELS[index].tag}</span>
                    </div>
                  </div>
                  <span className="password-length">{password.length} chars</span>
                </div>

                <div className="password-display">
                  <code className="password-text">{password}</code>
                </div>

                <div className="password-card-footer">
                  <span className="algo-description">{ALGO_LABELS[index].description}</span>
                  <button
                    id={`copy-btn-${index}`}
                    className={`btn-copy ${copiedIndex === index ? 'copied' : ''}`}
                    onClick={() => handleCopy(index)}
                  >
                    {copiedIndex === index ? (
                      <>
                        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {generatedPasswords.length === 0 && !isGenerating && (
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <p className="empty-text">
              Ingresa una frase y presiona <strong>Generar</strong> para crear 3 contraseñas seguras
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
