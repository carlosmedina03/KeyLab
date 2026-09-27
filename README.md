# 🔐 KeyLab

**🔗 URL en vivo:** [https://keylab-8qtg.onrender.com/](https://keylab-8qtg.onrender.com/)

**KeyLab** es un generador algorítmico de contraseñas basado en Leet Speak y un evaluador de entropía reactivo en tiempo real. Construido con React y Vite, esta herramienta te ayuda a crear y validar contraseñas seguras mitigando vectores de ataque por fuerza bruta y diccionarios, cumpliendo con los estándares de ciberseguridad (OWASP).

## Características Principales

*   **Motor de Generación Leet Speak**:
    *   Genera 3 niveles de contraseñas a partir de una frase base.
    *   **Estándar (Leet V1)**: Sustitución estricta de caracteres y sufijo numérico. (Mínimo 12 caracteres).
    *   **Passphrase (Leet V2)**: Separación por delimitadores, sustitución y sufijo de símbolos. (Mínimo 14 caracteres).
    *   **Alta Entropía (Leet V3)**: Intercalado de mayúsculas/minúsculas, sustitución y prefijo/sufijo alfanumérico generado de forma segura. (Mínimo 16 caracteres).
*   **Evaluador de Entropía Reactivo (Semáforo)**:
    *   Evalúa la fortaleza de una contraseña al instante (con un *debounce* de 150ms para un rendimiento óptimo).
    *   Indica visualmente la fortaleza con estados de color (Débil, Media, Buena, Fuerte).
    *   Incluye un **checklist en vivo** que verifica 6 criterios específicos usando Expresiones Regulares (Longitud, Mayúsculas, Minúsculas, Números, Símbolos, y Caracteres Leet).
*   **Privacidad Total (Client-Side)**:
    *   Todo el procesamiento de contraseñas ocurre en la memoria del navegador. No se envía ningún dato a servidores externos.
*   **Interfaz Premium UI/UX**:
    *   Diseño moderno utilizando Glassmorphism, tonos azul oscuro (Navy/Electric Blue) y tipografías modernas.

## Tecnologías

*   **Frontend Framework**: React 19
*   **Build Tool**: Vite
*   **Estilizado**: Vanilla CSS con Custom Properties (Variables)
*   **Tipografía**: Inter y JetBrains Mono (Google Fonts)

## Seguridad y Consideraciones

*   La generación de fragmentos aleatorios utiliza la API criptográfica nativa del navegador (`crypto.getRandomValues`).
*   Implementa un *fallback* seguro en caso de que los permisos para copiar al portapapeles (`navigator.clipboard`) sean denegados por el navegador del cliente.

---
*Desarrollado para proveer herramientas de seguridad modernas y confiables.*
