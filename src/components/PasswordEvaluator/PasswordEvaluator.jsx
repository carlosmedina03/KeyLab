import { useState, useMemo } from 'react';
import { evaluatePassword } from '../../utils/passwordEngine';
import { useDebounce } from '../../hooks/useDebounce';
import './PasswordEvaluator.css';

const STRENGTH_LABELS = {
  0: { text: 'Sin evaluar', emoji: '⬜' },
  1: { text: 'Débil', emoji: '🔴' },
  2: { text: 'Media', emoji: '🟡' },
  3: { text: 'Buena', emoji: '🟢' },
  4: { text: 'Fuerte', emoji: '💎' },
};

export default function PasswordEvaluator() {
  const [inputValue, setInputValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Debounce at 150ms per NFR spec
  const debouncedValue = useDebounce(inputValue, 150);

  // Reactive evaluation
  const evaluation = useMemo(
    () => evaluatePassword(debouncedValue),
    [debouncedValue]
  );

  const strengthInfo = STRENGTH_LABELS[evaluation.score];
  const barWidthPercent = debouncedValue.length === 0 ? 0 : (evaluation.score / 4) * 100;

  return (
    <section className="evaluator-section" id="password-evaluator">
      <div className="section-header">
        <div className="section-icon evaluator-icon">🛡️</div>
        <div>
          <h2 className="section-title">Evaluador de Entropía</h2>
          <p className="section-subtitle">Validador de fortaleza de las contraseñas</p>
        </div>
      </div>

      <div className="evaluator-card glass-card">
        {/* Password Input */}
        <div className="eval-input-group">
          <div className="eval-input-wrapper">
            <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <input
              id="password-eval-input"
              type={showPassword ? 'text' : 'password'}
              className="text-input eval-input"
              placeholder="Escribe o pega una contraseña para evaluar..."
              value={inputValue}
              onInput={(e) => setInputValue(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              className="btn-toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Strength Bar */}
        <div className="strength-section">
          <div className="strength-header">
            <span className="strength-label">
              <span className="strength-emoji">{strengthInfo.emoji}</span>
              {strengthInfo.text}
            </span>
            <span className="strength-score">
              {evaluation.passedCount}/{evaluation.totalRules} criterios
            </span>
          </div>

          <div className="strength-bar-track">
            <div
              className={`strength-bar-fill ${evaluation.cssClass}`}
              style={{ width: `${barWidthPercent}%` }}
            />
          </div>

          <div className="strength-segments">
            <span className={`segment-label ${evaluation.score >= 1 ? 'active-weak' : ''}`}>Débil</span>
            <span className={`segment-label ${evaluation.score >= 2 ? 'active-medium' : ''}`}>Media</span>
            <span className={`segment-label ${evaluation.score >= 3 ? 'active-good' : ''}`}>Buena</span>
            <span className={`segment-label ${evaluation.score >= 4 ? 'active-strong' : ''}`}>Fuerte</span>
          </div>
        </div>

        {/* Regex Checklist */}
        <div className="checklist-section">
          <h3 className="checklist-title">Criterios de Validación</h3>
          <ul className="checklist" id="validation-checklist">
            {evaluation.results.map((rule) => (
              <li
                key={rule.id}
                className={`checklist-item ${rule.passed ? 'passed' : 'failed'} ${debouncedValue.length === 0 ? 'neutral' : ''}`}
              >
                <span className={`check-indicator ${rule.passed && debouncedValue.length > 0 ? 'show' : ''}`}>
                  {rule.passed && debouncedValue.length > 0 ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="check-icon">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : debouncedValue.length > 0 ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="x-icon">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="neutral-dot" />
                  )}
                </span>
                <span className="check-icon-emoji">{rule.icon}</span>
                <span className="check-label">{rule.label}</span>
                <span className="check-id">{rule.id}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Entropy details */}
        {debouncedValue.length > 0 && (
          <div className="entropy-details">
            <div className="entropy-stat">
              <span className="entropy-stat-label">Longitud</span>
              <span className="entropy-stat-value">{debouncedValue.length}</span>
            </div>
            <div className="entropy-stat">
              <span className="entropy-stat-label">Clases</span>
              <span className="entropy-stat-value">{evaluation.passedCount}/6</span>
            </div>
            <div className="entropy-stat">
              <span className="entropy-stat-label">Estado</span>
              <span className={`entropy-stat-value state-${evaluation.cssClass}`}>
                {evaluation.state}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
