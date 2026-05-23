import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
import '../styles.css';
import '../extra.css';
import { homeMarkup, idfyMarkup } from './pageMarkup.js';
import { initPortfolio } from './portfolioInteractions.js';

function CurrentPage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const isIdfyCaseStudy = path === '/idfy-360' || path === '/idfy-360.html';
  const markup = isIdfyCaseStudy ? idfyMarkup : homeMarkup;

  useEffect(() => {
    document.body.className = isIdfyCaseStudy ? 'case-page' : '';
    const cleanup = initPortfolio();
    return cleanup;
  }, [isIdfyCaseStudy]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      {import.meta.env.DEV && (
        <Agentation
          endpoint="http://localhost:4747"
          onSessionCreated={(sessionId) => {
            console.log('Agentation session started:', sessionId);
          }}
        />
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<CurrentPage />);
