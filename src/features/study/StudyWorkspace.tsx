'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Image from 'next/image';

interface SuggestionCard {
  label: string;
  title: string;
  action: string;
}

interface SuggestionsState {
  legislation: SuggestionCard;
  institute: SuggestionCard;
  jurisprudence: SuggestionCard;
  doctrine: SuggestionCard;
}

interface StudySection {
  title: string;
  content: string;
  citations: string[];
  tags: string[];
}

interface StudyConnection {
  category: 'law' | 'doctrine' | 'case' | 'concept';
  label: string;
  title: string;
  summary: string;
  passageId?: string;
}

interface StudyData {
  title: string;
  subtitle: string;
  eyebrow: string;
  sections: StudySection[];
  investigationQuestion: {
    question: string;
    actionLabel: string;
  };
  connections: StudyConnection[];
}

export default function StudyWorkspace() {
  const [query, setQuery] = useState('liberdade de expressão');
  const [studying, setStudying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(393);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [objective, setObjective] = useState<'compreender' | 'comparar_doutrina' | 'aplicar'>('compreender');
  const [study, setStudy] = useState<StudyData | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<StudyConnection | null>(null);
  const [savedNotification, setSavedNotification] = useState('');

  // 4 cartões orbitais reativos para a tela inicial
  const [suggestions, setSuggestions] = useState<SuggestionsState>({
    legislation: { label: 'LEGISLAÇÃO', title: 'CF · art. 5º, IV e IX', action: 'Abrir dispositivo conectado ↗' },
    institute: { label: 'INSTITUTO CONECTADO', title: 'Direitos da personalidade', action: 'Explore a relação ↗' },
    jurisprudence: { label: 'JURISPRUDÊNCIA', title: 'Questões no STF e STJ', action: 'Conexões com fontes ↗' },
    doctrine: { label: 'DOUTRINA', title: 'Fundamentos e limites', action: 'Comparar posições ↗' }
  });

  // Atualiza sugestões em tempo real conforme digitação na home
  useEffect(() => {
    if (!studying && query.trim().length >= 2) {
      const timer = setTimeout(() => {
        fetch(`/api/connections/suggest?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.legislation) setSuggestions(data);
          })
          .catch(() => {});
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [query, studying]);

  async function handleSearch(e?: FormEvent, customQuery?: string, customObjective?: 'compreender' | 'comparar_doutrina' | 'aplicar') {
    if (e) e.preventDefault();
    const q = customQuery !== undefined ? customQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    const activeObj = customObjective || objective;

    try {
      const res = await fetch('/api/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, objective: activeObj })
      });

      if (!res.ok) throw new Error('Falha na resposta do servidor.');

      const data = await res.json();
      if (data && data.study) {
        setStudy(data.study);
        if (data.creditsRemaining !== undefined) {
          setCredits(data.creditsRemaining);
        }
        if (data.study.connections && data.study.connections.length > 0) {
          setSelectedConnection(data.study.connections[0]);
        }
        setStudying(true);
      }
    } catch (err: any) {
      console.error('Erro ao processar estudo:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveStudy() {
    setSavedNotification('Estudo salvo na biblioteca pessoal com sucesso!');
    setTimeout(() => setSavedNotification(''), 4000);
  }

  async function handlePurchasePlan(planId: string) {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userEmail: 'cliente@nexojuris.com.br' })
      });
      const data = await res.json();
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        alert(data.message || 'Pedido comercial gerado!');
      }
    } catch (e: any) {
      alert('Erro ao iniciar compra: ' + e.message);
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="app-layout">
      {/* 1. Header Oficial (Print 1 & 2) */}
      <header className="main-header">
        <button 
          className="brand-wrapper" 
          onClick={() => { setStudying(false); }}
          aria-label="NexoJuris, início"
        >
          <Image
            src="/brand/judge.png"
            alt="Logo NexoJuris"
            width={44}
            height={44}
            className="brand-icon"
            priority
          />
          <div className="brand-title">
            <strong>NexoJuris</strong>
            <small>Compreenda o Direito. Conecte ideias.</small>
          </div>
        </button>

        <nav className="header-nav" aria-label="Navegação secundária">
          <a href="#institutos" className="nav-link">Institutos</a>
          <a href="#estudos" className="nav-link" onClick={(e) => { e.preventDefault(); handleSaveStudy(); }}>Meus estudos</a>
          <button 
            type="button"
            className="credit-badge" 
            onClick={() => setShowPlansModal(true)}
            title="Clique para ver planos comerciais e recarregar créditos"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            <span>💳 {credits} créditos · Planos</span>
          </button>
        </nav>
      </header>

      {/* 2. Sub-header Contextual */}
      <div className="status-bar">
        <span>Prévia interativa · Constituição Federal</span>
        <span>{savedNotification || 'Conteúdo e créditos demonstrativos'}</span>
      </div>

      {/* ======================================================== */}
      {/* TELA 1: HOME COM BUSCA & CARTÕES ORBITAIS (Print 1)       */}
      {/* ======================================================== */}
      {!studying ? (
        <main className="home-container">
          <Image
            src="/brand/judge.png"
            alt=""
            width={520}
            height={520}
            className="hero-watermark"
            priority
          />

          {/* Cartões Orbitais Reativos */}
          <div className="orbital-card orbital-top-left">
            <span className="card-category-label">{suggestions.legislation.label}</span>
            <strong className="card-headline">{suggestions.legislation.title}</strong>
            <span className="card-action-link">{suggestions.legislation.action}</span>
          </div>

          <div className="orbital-card orbital-top-right">
            <span className="card-category-label">{suggestions.institute.label}</span>
            <strong className="card-headline">{suggestions.institute.title}</strong>
            <span className="card-action-link">{suggestions.institute.action}</span>
          </div>

          <div className="orbital-card orbital-bottom-left">
            <span className="card-category-label">{suggestions.jurisprudence.label}</span>
            <strong className="card-headline">{suggestions.jurisprudence.title}</strong>
            <span className="card-action-link">{suggestions.jurisprudence.action}</span>
          </div>

          <div className="orbital-card orbital-bottom-right">
            <span className="card-category-label">{suggestions.doctrine.label}</span>
            <strong className="card-headline">{suggestions.doctrine.title}</strong>
            <span className="card-action-link">{suggestions.doctrine.action}</span>
          </div>

          {/* Conteúdo Central do Hero */}
          <div className="hero-content">
            <p className="eyebrow-tag">ESTUDO JURÍDICO CONECTADO</p>
            <h1 className="hero-title">O que você quer<br />compreender?</h1>
            <p className="hero-subtitle">Doutrina, legislação e jurisprudência no mesmo raciocínio.</p>

            <form className="search-box-wrapper" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: liberdade de expressão, coisa julgada..."
                maxLength={200}
                aria-label="Pergunta ou instituto jurídico"
              />
              <button 
                type="submit" 
                className="search-submit-btn" 
                disabled={loading}
                aria-label="Pesquisar"
              >
                {loading ? <span className="loading-indicator" /> : '→'}
              </button>
            </form>

            <div className="model-selector-row">
              <span>Modelo de estudo</span>
              <select className="model-dropdown" aria-label="Seletor de Modelo">
                <option value="gemini">Gemini 2.5 Flash</option>
                <option value="sonnet">Sonnet 3.7</option>
              </select>
            </div>
            <p className="cost-hint">Gemini · explicação com acervo e ForgeLex: 3 créditos</p>

            <div className="pills-row">
              <button 
                type="button" 
                className="theme-pill"
                onClick={() => { setQuery('Coisa julgada'); handleSearch(undefined, 'Coisa julgada'); }}
              >
                Coisa julgada
              </button>
              <button 
                type="button" 
                className="theme-pill"
                onClick={() => { setQuery('Igualdade'); handleSearch(undefined, 'Igualdade'); }}
              >
                Igualdade
              </button>
              <button 
                type="button" 
                className="theme-pill"
                onClick={() => { setQuery('Liberdade de expressão'); handleSearch(undefined, 'Liberdade de expressão'); }}
              >
                Liberdade de expressão
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* ======================================================== */
        /* TELA 2: WORKSPACE DE LEITURA CONECTADA (Print 2)         */
        /* ======================================================== */
        <main className="workspace-container">
          <div className="workspace-top-bar">
            <button className="back-search-btn" onClick={() => setStudying(false)}>
              ← Nova pesquisa
            </button>
            <div className="top-bar-right">
              <span className="model-preview-tag">Gemini · prévia</span>
              <button className="save-study-btn" onClick={handleSaveStudy}>
                Salvar estudo
              </button>
            </div>
          </div>

          <div className="workspace-grid">
            {/* Coluna 1: Trilho de Conexões Esquerdo */}
            <aside className="rail-column" aria-label="Conexões contextuais do estudo">
              {study?.connections.map((conn, idx) => (
                <button
                  key={idx}
                  className="rail-card"
                  onClick={() => setSelectedConnection(conn)}
                  aria-pressed={selectedConnection?.title === conn.title}
                >
                  <span className="card-category-label">{conn.label}</span>
                  <strong>{conn.title}</strong>
                  <span className="card-action-link">Explore esta relação ↗</span>
                </button>
              ))}
            </aside>

            {/* Coluna 2: Leitura Integrada Central */}
            <article className="reading-column">
              <div className="study-title-header">
                <p className="eyebrow-tag">{study?.eyebrow || 'DIREITOS E GARANTIAS FUNDAMENTAIS'}</p>
                <h1>{study?.title || query}</h1>
                <p className="subtitle">{study?.subtitle || 'Fundamentos, conexões e aplicação'}</p>
              </div>

              {/* Abas de Modo (Compreender, Comparar, Aplicar) */}
              <div className="mode-tabs">
                <button
                  className={`tab-btn ${objective === 'compreender' ? 'active' : ''}`}
                  onClick={() => { setObjective('compreender'); handleSearch(undefined, query, 'compreender'); }}
                >
                  Compreender
                </button>
                <button
                  className={`tab-btn ${objective === 'comparar_doutrina' ? 'active' : ''}`}
                  onClick={() => { setObjective('comparar_doutrina'); handleSearch(undefined, query, 'comparar_doutrina'); }}
                >
                  Comparar
                </button>
                <button
                  className={`tab-btn ${objective === 'aplicar' ? 'active' : ''}`}
                  onClick={() => { setObjective('aplicar'); handleSearch(undefined, query, 'aplicar'); }}
                >
                  Aplicar
                </button>
              </div>

              {/* Seções de Texto com Citações Interativas */}
              {study?.sections.map((section, sIdx) => (
                <section key={sIdx} className="reading-section">
                  <h2>{section.title}</h2>
                  <p>
                    {section.content}
                  </p>
                  
                  {section.citations && section.citations.length > 0 && (
                    <p style={{ marginTop: '8px' }}>
                      Explore o dispositivo{' '}
                      {section.citations.map((cit, cIdx) => (
                        <button
                          key={cIdx}
                          className="citation-chip"
                          onClick={() => {
                            const match = study.connections.find(c => c.title.includes(cit) || cit.includes(c.title));
                            if (match) setSelectedConnection(match);
                          }}
                        >
                          {cit}
                        </button>
                      ))}
                      {' '}e suas conexões com a questão estudada.
                    </p>
                  )}

                  <div className="tags-row">
                    {section.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                </section>
              ))}

              {/* Bloco Investigativo */}
              {study?.investigationQuestion && (
                <div className="investigation-box">
                  <p>{study.investigationQuestion.question}</p>
                  <button 
                    className="action-pill-btn"
                    onClick={() => { setObjective('aplicar'); handleSearch(undefined, query, 'aplicar'); }}
                  >
                    {study.investigationQuestion.actionLabel}
                  </button>
                </div>
              )}

              <p className="reading-footer-note">
                Amostra de leitura. Citações doutrinárias e julgados apresentados a partir do acervo validado e do ForgeLex.
              </p>
            </article>

            {/* Coluna 3: Painel Lateral de Aprofundamento */}
            <aside className="detail-column" aria-label="Painel de detalhamento">
              <div className="detail-header">
                <span className="card-category-label">{selectedConnection?.label || 'INSTITUTO CONECTADO'}</span>
                <button 
                  className="detail-close-btn" 
                  onClick={() => setSelectedConnection(null)}
                  aria-label="Fechar painel"
                >
                  ×
                </button>
              </div>

              <h2 className="detail-title">{selectedConnection?.title || 'Selecione uma conexão'}</h2>
              <p className="detail-body">
                {selectedConnection?.summary || 'Clique em um cartão lateral ou em uma citação no texto para visualizar o detalhamento comprovado desta relação jurídica.'}
              </p>

              {selectedConnection && (
                <button 
                  className="deepen-action-btn"
                  onClick={() => handleSearch(undefined, selectedConnection.title)}
                >
                  Aprofundar relação
                </button>
              )}

              <div className="detail-footer-note">
                Conexão aberta · leitura preservada
              </div>
            </aside>
          </div>
        </main>
      )}

      {showPlansModal && (
        <div className="plans-modal-overlay" onClick={() => setShowPlansModal(false)}>
          <div className="plans-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="plans-close-btn" 
              onClick={() => setShowPlansModal(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="plans-header">
              <h2>Planos Comerciais NexoJuris</h2>
              <p>Adquira créditos de estudo para pesquisa jurídica integrada com Doutrina, CF/88 e Jurisprudência.</p>
            </div>

            <div className="plans-grid">
              <div className="plan-item">
                <div>
                  <h3 className="plan-title">Estudante & OAB</h3>
                  <div className="plan-price">R$ 29,90 <small>/pacote</small></div>
                  <p className="plan-desc">100 créditos de pesquisa. Ideal para revisão temática de disciplinas e exames.</p>
                </div>
                <button 
                  className="plan-buy-btn secondary"
                  disabled={checkoutLoading}
                  onClick={() => handlePurchasePlan('pack_100')}
                >
                  {checkoutLoading ? 'Processando...' : 'Comprar 100 créditos'}
                </button>
              </div>

              <div className="plan-item popular">
                <span className="plan-badge">Mais Escolhido</span>
                <div>
                  <h3 className="plan-title">Concurseiro Pro</h3>
                  <div className="plan-price">R$ 79,90 <small>/pacote</small></div>
                  <p className="plan-desc">500 créditos com alta prioridade de síntese no grafo jurídico e precedentes.</p>
                </div>
                <button 
                  className="plan-buy-btn"
                  disabled={checkoutLoading}
                  onClick={() => handlePurchasePlan('pack_500')}
                >
                  {checkoutLoading ? 'Processando...' : 'Comprar 500 créditos'}
                </button>
              </div>

              <div className="plan-item">
                <div>
                  <h3 className="plan-title">Escritório Ilimitado</h3>
                  <div className="plan-price">R$ 149,90 <small>/mês</small></div>
                  <p className="plan-desc">Acesso ilimitado a todas as conexões, teses jurisprudenciais e doutrina hermenêutica.</p>
                </div>
                <button 
                  className="plan-buy-btn secondary"
                  disabled={checkoutLoading}
                  onClick={() => handlePurchasePlan('pack_unlimited')}
                >
                  {checkoutLoading ? 'Processando...' : 'Assinar Ilimitado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
