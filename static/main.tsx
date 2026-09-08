import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CourseCatalog from '@/app/page';
import AgentHistory from '@/components/agent-history';
import '@/app/globals.css';
import '@/app/history.css';

const chapterPage = document.body.dataset.page === 'agent-history';

createRoot(document.getElementById('root')!).render(
  <StrictMode>{chapterPage ? <AgentHistory /> : <CourseCatalog />}</StrictMode>,
);
