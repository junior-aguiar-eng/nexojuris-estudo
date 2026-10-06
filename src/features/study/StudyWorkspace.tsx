'use client';
import { useState, type FormEvent } from 'react';
import { initialNavigation, openConnection, goBack, type ConnectionRef } from './navigation';

const connections: { ref: ConnectionRef; label: string; title: string; text: string }[] = [
  { ref: { id: 'cf-art5-xxxvi', kind: 'law', passageId: 'protecao' }, label: 'Legislação', title: 'CF · art. 5º, XXXVI', text: 'A lei não prejudicará o direito adquirido, o ato jurídico perfeito e a coisa julgada.' },
  { ref: { id: 'doutrina', kind: 'doctrine', passageId: 'limites' }, label: 'Doutrina', title: 'Fundamentos e limites', text: 'As passagens autorizadas do acervo serão apresentadas aqui, com autoria e localizador. Esta amostra não atribui posições a autores.' },
  { ref: { id: 'casos', kind: 'case', passageId: 'limites' }, label: 'Jurisprudência', title: 'STF e STJ', text: 'Os vínculos oficiais e a pesquisa ForgeLex serão conectados após integração. Nenhum processo fictício é apresentado.' },
];

export default function StudyWorkspace() {
  const [query, setQuery] = useState('');
  const [studying, setStudying] = useState(false);
  const [nav, setNav] = useState(initialNavigation);
  const [message, setMessage] = useState('');
  const selected = connections.find(c => c.ref.id === nav.selected?.id);
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) { setMessage('Digite um instituto para pesquisar.'); return; }
    setNav(initialNavigation); setStudying(true); setMessage('Amostra de coisa julgada. A pesquisa no acervo real ainda será integrada.');
  }
  function select(ref: ConnectionRef) { setNav(current => openConnection(current, ref)); }
  return <main className="app">
    <header className="header">
      <button className="brand" onClick={() => { setStudying(false); setMessage(''); }} aria-label="NexoJuris, início">
        <img src="/brand/judge.png" alt="" width="64" height="64" />
        <span><strong>NexoJuris</strong><small>Compreenda direito. Conecte ideias.</small></span>
      </button>
      <nav aria-label="Navegação principal"><a href="/prototipo/index.html">Protótipo completo</a><a href="https://github.com/junior-aguiar-eng/nexojuris-estudo">Projeto</a></nav>
    </header>
    <div className="development">Fundação do projeto · conteúdo demonstrativo · sem cobrança ou chamadas de IA</div>
    <p className="status" role="status">{message}</p>
    {!studying ? <section className="home">
      <img className="watermark" src="/brand/judge.png" alt="" />
      <div className="hero"><p className="eyebrow">ESTUDO JURÍDICO CONECTADO</p><h1>O que você quer<br />compreender?</h1><p>Doutrina, legislação e jurisprudência no mesmo raciocínio.</p>
        <form className="search" onSubmit={search}><input value={query} onChange={e => setQuery(e.target.value)} maxLength={240} aria-label="Instituto ou questão jurídica" placeholder="Ex.: coisa julgada" /><button aria-label="Pesquisar">→</button></form>
        <button className="pill" onClick={() => setQuery('Coisa julgada')}>Coisa julgada</button>
      </div>
      <div className={'suggestions' + (query.trim().length >= 3 ? ' visible' : '')} aria-hidden={query.trim().length < 3}>
        {connections.map(c => <div className="connection" key={c.ref.id}><small>{c.label}</small><strong>{c.title}</strong><span>Conexão demonstrativa</span></div>)}
      </div>
    </section> : <section className="workspace">
      <aside className="rail" aria-label="Conexões da leitura">{connections.map(c => <button className="connection" key={c.ref.id} onClick={() => select(c.ref)} aria-pressed={selected?.ref.id === c.ref.id}><small>{c.label}</small><strong>{c.title}</strong><span>Abrir conexão →</span></button>)}</aside>
      <article className="reading"><p className="eyebrow">DIREITOS E GARANTIAS FUNDAMENTAIS</p><h1>Coisa julgada</h1><p className="muted">Amostra de leitura — integração do acervo pendente.</p>
        <section className={nav.passageId === 'protecao' ? 'highlight' : ''}><h2>Proteção constitucional</h2><p>O estudo parte da proteção constitucional da coisa julgada e de suas relações com a segurança jurídica. Abra o dispositivo <button className="citation" onClick={() => select(connections[0].ref)}>CF · art. 5º, XXXVI</button> para acompanhar a conexão.</p></section>
        <section className={nav.passageId === 'limites' ? 'highlight' : ''}><h2>Fundamentos e contexto</h2><p>Doutrina e jurisprudência serão relacionadas à questão jurídica delimitada, com passagens verificáveis. Cada conexão mantém sua origem e seu motivo.</p></section>
        <button className="pill" onClick={() => { setStudying(false); setMessage(''); }}>Nova pesquisa</button>
      </article>
      <aside className="detail" aria-label="Conexão selecionada" aria-live="polite">{selected ? <><button className="back" onClick={() => setNav(goBack)}>← Voltar</button><small className="eyebrow">{selected.label}</small><h2>{selected.title}</h2><p>{selected.text}</p><p className="muted">A geração de explicações será habilitada após integrar fontes, modelo e orçamento.</p></> : <><h2>Explore uma conexão</h2><p>Selecione um bloco ou uma referência no texto. Ambos compartilham o mesmo destino.</p></>}</aside>
    </section>}
  </main>;
}
