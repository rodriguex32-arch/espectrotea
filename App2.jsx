import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────
const DIMENSIONS = [
  { id:'social',    name:'Comunicação Social',           short:'Social',    desc:'Avalia padrões de interação, compreensão de subentendidos e funcionamento em contextos sociais.',                                                               color:'#7c6dcc' },
  { id:'patterns',  name:'Padrões & Interesses',          short:'Padrões',   desc:'Explora comportamentos repetitivos, interesses intensos e necessidade de rotina e previsibilidade.',                                                             color:'#4ab8b8' },
  { id:'sensory',   name:'Processamento Sensorial',       short:'Sensorial', desc:'Investiga respostas atípicas a estímulos sensoriais — hipersensibilidade, hipossensibilidade e busca sensorial.',                                               color:'#e05555' },
  { id:'cognition', name:'Cognição & Função Executiva',   short:'Cognição',  desc:'Avalia flexibilidade cognitiva, planejamento, memória de trabalho e pensamento detalhista.',                                                                    color:'#5aad80' },
  { id:'masking',   name:'Masking & Camuflagem',          short:'Masking',   desc:'Detecta estratégias conscientes e inconscientes de supressão ou imitação de comportamentos para parecer neurotípico.', color:'#d4a843', isMasking:true },
];

const QUESTIONS = [
  // Social (10)
  { dim:'social',    text:'Tenho dificuldade em entender o que as pessoas querem dizer além do que dizem literalmente.', sub:'Ex.: sarcasmo, ironia, indiretas ou "nas entrelinhas"', dir:'direct' },
  { dim:'social',    text:'Acho difícil iniciar conversas, especialmente com pessoas que não conheço bem.', dir:'direct' },
  { dim:'social',    text:'Em grupos, tenho dificuldade para seguir múltiplas conversas ou entender quando é minha vez de falar.', dir:'direct' },
  { dim:'social',    text:'Ao terminar uma conversa, frequentemente fico sem saber se a outra pessoa saiu satisfeita ou aborrecida.', dir:'direct' },
  { dim:'social',    text:'Tenho ou já tive dificuldade em entender expressões faciais ou linguagem corporal das pessoas.', dir:'direct' },
  { dim:'social',    text:'Acho mais fácil se comunicar por escrito do que verbalmente.', dir:'direct' },
  { dim:'social',    text:'Às vezes falo muito sobre um assunto que me interessa sem perceber que a outra pessoa perdeu o interesse.', dir:'direct' },
  { dim:'social',    text:'Amizades íntimas me parecem naturais e fáceis de manter.', dir:'inverse' },
  { dim:'social',    text:'Fico confuso(a) com convenções sociais como cumprimentar, abraçar ou quanto contato visual manter.', dir:'direct' },
  { dim:'social',    text:'Preciso de tempo a sós para recuperar energia após situações sociais, mesmo quando as aproveitei.', dir:'direct' },
  // Patterns (10)
  { dim:'patterns',  text:'Tenho um ou mais interesses pelos quais me aprofundo muito mais do que a maioria das pessoas.', sub:'Ex.: coletar, memorizar, dominar completamente um assunto', dir:'direct' },
  { dim:'patterns',  text:'Mudanças inesperadas em planos ou rotinas me geram desconforto desproporcional.', dir:'direct' },
  { dim:'patterns',  text:'Tenho rituais ou sequências específicas que sigo com regularidade — e me incomoda quando não consigo segui-las.', dir:'direct' },
  { dim:'patterns',  text:'Tenho facilidade para perceber padrões, regras ou estruturas em sistemas complexos (matemática, linguagem, música).', dir:'direct' },
  { dim:'patterns',  text:'Repito movimentos, sons ou frases de forma inconsciente — às vezes como forma de regular minhas emoções.', sub:'Ex.: balançar o corpo, estalar os dedos, repetir palavras', dir:'direct' },
  { dim:'patterns',  text:'Sinto necessidade de completar tarefas ou coleções — deixar algo pela metade me causa desconforto.', dir:'direct' },
  { dim:'patterns',  text:'Adapto-me facilmente a ambientes novos e imprevisíveis sem dificuldade.', dir:'inverse' },
  { dim:'patterns',  text:'Tenho pensamentos que ficam circulando repetidamente na minha mente sem que eu consiga desligar facilmente.', dir:'direct' },
  { dim:'patterns',  text:'Costumo notar detalhes específicos em ambientes ou situações que outras pessoas parecem ignorar.', dir:'direct' },
  { dim:'patterns',  text:'Tenho dificuldade para "mudar de marcha" mentalmente — sair de um pensamento ou tarefa para outro.', dir:'direct' },
  // Sensory (10)
  { dim:'sensory',   text:'Sons específicos (ex.: chiado, mastigação, tique-taque) me perturbam de forma intensa e difícil de ignorar.', dir:'direct' },
  { dim:'sensory',   text:'Certas texturas de tecido ou etiquetas de roupas me causam desconforto físico ou irritação.', dir:'direct' },
  { dim:'sensory',   text:'Ambientes com muita estimulação (luz forte, barulho, multidão) me esgotam ou sobrecarregam.', dir:'direct' },
  { dim:'sensory',   text:'Já fui criticado(a) por ser "sensível demais" a estímulos físicos que os outros não parecem notar.', dir:'direct' },
  { dim:'sensory',   text:'Tenho dificuldade com certos sabores, cheiros ou texturas de alimentos — a ponto de limitar minha alimentação.', dir:'direct' },
  { dim:'sensory',   text:'Busco ativamente certas sensações físicas que me acalmam ou estimulam.', sub:'Ex.: pressão, movimento rítmico, determinadas texturas', dir:'direct' },
  { dim:'sensory',   text:'Processo informações mais lentamente em ambientes com muito estímulo simultâneo.', dir:'direct' },
  { dim:'sensory',   text:'Tenho percepções sensoriais que parecem mais intensas do que as de outras pessoas (luz, dor, temperatura).', dir:'direct' },
  { dim:'sensory',   text:'Sou indiferente(a) a estímulos físicos normalmente incômodos para outros.', sub:'Ex.: não perceber fome, temperatura extrema, dor', dir:'direct' },
  { dim:'sensory',   text:'Ambientes com cheiro forte ou iluminação fluorescente me causam dificuldade de concentração.', dir:'direct' },
  // Cognition (10)
  { dim:'cognition', text:'Tenho dificuldade para começar tarefas mesmo quando sei exatamente o que precisa ser feito.', sub:'Especialmente tarefas longas, complexas ou sem prazo imediato', dir:'direct' },
  { dim:'cognition', text:'Minha memória é inconsistente — às vezes retenho detalhes extraordinários, outras esqueço coisas simples.', dir:'direct' },
  { dim:'cognition', text:'Tenho pensamento muito detalhista, mas às vezes perco o "quadro geral" ou o objetivo principal.', dir:'direct' },
  { dim:'cognition', text:'Costumo processar informações de forma visual, em imagens ou padrões — mais do que em palavras.', dir:'direct' },
  { dim:'cognition', text:'Tenho dificuldade para priorizar tarefas quando há várias pendentes ao mesmo tempo.', dir:'direct' },
  { dim:'cognition', text:'Minha produtividade é muito melhor quando estou hiperfocado(a) em algo do meu interesse.', dir:'direct' },
  { dim:'cognition', text:'Organizo meus pensamentos ou memórias de forma sistemática, em listas, categorias ou sistemas lógicos.', dir:'direct' },
  { dim:'cognition', text:'Tenho dificuldade para articular verbalmente pensamentos complexos em tempo real.', dir:'direct' },
  { dim:'cognition', text:'Costumo subestimar o tempo que algo vai demorar — ou perder a noção do tempo quando focado(a).', dir:'direct' },
  { dim:'cognition', text:'Processo melhor informações quando tenho tempo para refletir do que quando preciso responder imediatamente.', dir:'direct' },
  // Masking (10)
  { dim:'masking',   text:'Aprendi a observar e imitar o comportamento de outras pessoas para parecer mais "normal" em situações sociais.', dir:'direct', masking:true },
  { dim:'masking',   text:'Ensaio mentalmente conversas antes de tê-las, ou analiso depois o que "deveria" ter dito.', dir:'direct', masking:true },
  { dim:'masking',   text:'Na presença de outros, suprimo comportamentos (como movimentos repetitivos) que faria naturalmente quando sozinho(a).', dir:'direct', masking:true },
  { dim:'masking',   text:'Sinto que tenho uma "versão pública" e uma "versão privada" de mim — e que poucas pessoas conhecem a real.', dir:'direct', masking:true },
  { dim:'masking',   text:'Me sinto completamente esgotado(a) depois de interações sociais — mesmo as que pareceram bem-sucedidas.', dir:'direct', masking:true },
  { dim:'masking',   text:'Já fui descrito(a) como "muito social" ou "articulado(a)" em contextos que, na verdade, me custam grande esforço.', dir:'direct', masking:true },
  { dim:'masking',   text:'Já me perguntei se tenho alguma condição neurodivergente, mas profissionais ou pessoas próximas descartaram porque você "não parece".', dir:'direct', masking:true },
  { dim:'masking',   text:'Levei anos para reconhecer em mim mesmo(a) dificuldades que, ao olhar para trás, sempre estiveram presentes.', dir:'direct', masking:true },
  { dim:'masking',   text:'Tenho dificuldade para identificar e nomear minhas próprias emoções — mesmo depois de um evento importante.', sub:'Relacionado à alexitimia, frequente no TEA com masking elevado', dir:'direct', masking:true },
  { dim:'masking',   text:'Sinto que minhas dificuldades passaram despercebidas porque desenvolvi estratégias compensatórias muito eficientes.', dir:'direct', masking:true },
];

const LIKERT = [
  { label:'Nunca ou quase nunca se aplica a mim', val:0 },
  { label:'Raramente se aplica', val:1 },
  { label:'Às vezes se aplica', val:2 },
  { label:'Frequentemente se aplica', val:3 },
  { label:'Sempre ou quase sempre se aplica a mim', val:4 },
];

// ── SCORING ───────────────────────────────────────────────────────────
function calcScores(answers) {
  const ds = {};
  DIMENSIONS.forEach(d => { ds[d.id] = { raw:0, max:0 }; });
  QUESTIONS.forEach((q,i) => {
    const ans = answers[i] ?? 0;
    const scored = q.dir === 'inverse' ? (4 - ans) : ans;
    ds[q.dim].raw += scored;
    ds[q.dim].max += 4;
  });
  const result = {};
  Object.keys(ds).forEach(k => { result[k] = Math.round((ds[k].raw / ds[k].max) * 100); });
  const totalRaw = Object.values(ds).reduce((a,b)=>a+b.raw,0);
  const totalMax = Object.values(ds).reduce((a,b)=>a+b.max,0);
  result.total = Math.round((totalRaw/totalMax)*100);
  return result;
}

function getRisk(pct) {
  if (pct < 30) return { level:'low',       label:'Baixo risco',          color:'#5aad80' };
  if (pct < 50) return { level:'medium',    label:'Risco moderado',       color:'#d4a843' };
  if (pct < 70) return { level:'high',      label:'Risco elevado',        color:'#b8a9ff' };
  return             { level:'very-high',  label:'Risco muito elevado',  color:'#e05555' };
}

// ── STYLES ────────────────────────────────────────────────────────────
const G = {
  bg:'#0a0a0f', surface:'#111118', surface2:'#16161e',
  border:'#252530', border2:'#2e2e3d',
  text:'#f0ece4', text2:'#c8c4d4', text3:'#8a86a0',
  accent:'#b8a9ff', accent2:'#7c6dcc', accent3:'#4a3d99',
  gold:'#d4a843', gold2:'#f0cc7a', red:'#e05555', green:'#5aad80',
};

const base = {
  fontFamily:"'Syne', 'Segoe UI', sans-serif",
  background: G.bg,
  color: G.text,
  minHeight:'100vh',
  fontSize:14,
};

// ── COMPONENTS ────────────────────────────────────────────────────────

function Tag({ children, color=G.accent, bg }) {
  return (
    <span style={{
      fontFamily:"'JetBrains Mono', monospace",
      fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase',
      padding:'3px 8px', borderRadius:2,
      background: bg || `${color}18`,
      border:`1px solid ${color}44`,
      color,
    }}>{children}</span>
  );
}

function MonoLabel({ children, color=G.text3 }) {
  return <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color }}>{children}</span>;
}

// ── SCREEN 1: LANDING ─────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background: G.bg,
      backgroundImage:`radial-gradient(ellipse 60% 50% at 80% 20%, ${G.accent2}1a 0%, transparent 60%),
                       radial-gradient(ellipse 40% 40% at 20% 80%, #4ab8b81a 0%, transparent 60%)`,
    }}>
      <div style={{ maxWidth:880, margin:'0 auto', padding:'56px 28px 72px', display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* eyebrow */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:40 }}>
          <div style={{ width:32, height:1, background:G.accent }} />
          <MonoLabel color={G.accent}>Triagem Clínica para Adultos</MonoLabel>
        </div>

        {/* hero */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', paddingBottom:40 }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(52px,8vw,88px)', fontWeight:300, lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:28, color:G.text }}>
            <span style={{ color:G.accent, fontStyle:'italic' }}>Espectro</span>
            <br/>
            <span style={{ color:G.text2, marginLeft:60 }}>Autista</span>
          </h1>

          <p style={{ maxWidth:500, fontSize:14, lineHeight:1.8, color:G.text, marginBottom:40 }}>
            Avaliação aprofundada para adultos — incluindo detecção de <em style={{color:G.gold}}>masking</em> e perfil multidimensional. Baseada nos principais instrumentos clínicos validados para diagnóstico tardio de TEA.
          </p>

          {/* meta */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:24, alignItems:'center', marginBottom:48 }}>
            {[['50','Perguntas'],['5','Dimensões'],['~15','Minutos'],['18+','Anos']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:500, lineHeight:1 }}>{v}</div>
                <MonoLabel>{l}</MonoLabel>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <button onClick={onStart} style={{
              padding:'15px 40px', background:G.accent, color:G.bg,
              border:'none', borderRadius:3, cursor:'pointer',
              fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight:700,
              letterSpacing:'0.08em', textTransform:'uppercase',
              boxShadow:`0 0 0 0 ${G.accent}`,
              transition:'all 0.2s',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 32px ${G.accent}44`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              Iniciar avaliação →
            </button>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:G.text3, lineHeight:1.6 }}>
              Responda com base em como você é<br/>ao longo da vida, não apenas agora.
            </span>
          </div>
        </div>

        {/* dimension cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, background:G.border, border:`1px solid ${G.border}`, borderRadius:8, overflow:'hidden' }}>
          {DIMENSIONS.map((d,i) => (
            <div key={d.id} style={{ background:G.surface, padding:'18px 14px' }}>
              <MonoLabel>{String(i+1).padStart(2,'0')}</MonoLabel>
              <div style={{ fontSize:11, fontWeight:600, color:G.text, marginTop:6, marginBottom:3, lineHeight:1.3 }}>{d.name}</div>
              <MonoLabel>10 itens</MonoLabel>
            </div>
          ))}
        </div>

        {/* disclaimer */}
        <div style={{ marginTop:20, padding:'12px 16px', background:'#1a1500', border:`1px solid ${G.gold}33`, borderRadius:6 }}>
          <MonoLabel color={G.gold}>⚠ Aviso clínico — </MonoLabel>
          <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:9, color:G.text3 }}>
            Este instrumento é de rastreamento, não diagnóstico. Pontuações elevadas devem ser encaminhadas para avaliação presencial por especialista.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 2: QUIZ ────────────────────────────────────────────────────
function Quiz({ onFinish }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(new Array(QUESTIONS.length).fill(null));
  const [dimShown, setDimShown] = useState(null);
  const bodyRef = useRef(null);

  const q = QUESTIONS[idx];
  const dim = DIMENSIONS.find(d => d.id === q.dim);
  const pct = Math.round(((idx+1)/QUESTIONS.length)*100);
  const showDimHeader = q.dim !== dimShown;

  useEffect(() => {
    if (showDimHeader) setDimShown(q.dim);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [idx]);

  const select = (val) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
  };

  const goNext = () => {
    if (idx < QUESTIONS.length - 1) setIdx(idx+1);
    else onFinish(answers);
  };

  const goPrev = () => { if (idx > 0) setIdx(idx-1); };

  return (
    <div style={{ minHeight:'100vh', background:G.bg, display:'flex', flexDirection:'column' }}>
      {/* topbar */}
      <div style={{
        position:'sticky', top:0, zIndex:50,
        background:'rgba(10,10,15,0.92)', backdropFilter:'blur(16px)',
        borderBottom:`1px solid ${G.border}`,
        padding:'0 28px', height:54,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <MonoLabel color={G.accent}>ESPECTRO</MonoLabel>
        <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, maxWidth:360, margin:'0 32px' }}>
          <div style={{ flex:1, height:2, background:G.border2, borderRadius:1, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${G.accent2},${G.accent})`, borderRadius:1, transition:'width 0.5s ease' }} />
          </div>
          <MonoLabel>{pct}%</MonoLabel>
        </div>
        <MonoLabel>{dim.short}</MonoLabel>
      </div>

      {/* body */}
      <div ref={bodyRef} style={{ flex:1, overflowY:'auto', padding:'32px 28px 100px', maxWidth:700, margin:'0 auto', width:'100%' }}>

        {/* dim header */}
        {showDimHeader && (
          <div style={{ paddingBottom:28, marginBottom:32, borderBottom:`1px solid ${G.border}` }}>
            <MonoLabel color={dim.color}>Dimensão {String(DIMENSIONS.findIndex(d=>d.id===q.dim)+1).padStart(2,'0')} / 05</MonoLabel>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:400, marginTop:6, marginBottom:6, color:G.text }}>{dim.name}</div>
            <div style={{ fontSize:12, color:G.text2, lineHeight:1.65 }}>{dim.desc}</div>
          </div>
        )}

        {/* question */}
        <div key={idx}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <MonoLabel>Q{String(idx+1).padStart(2,'0')}</MonoLabel>
            {q.masking
              ? <Tag color={G.gold}>◆ Masking</Tag>
              : <Tag color={dim.color}>{dim.short}</Tag>
            }
          </div>

          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(18px,3vw,24px)', fontWeight:400, lineHeight:1.45, marginBottom:6, color:G.text }}>
            {q.text}
          </div>
          {q.sub && <div style={{ fontSize:12, color:G.text2, lineHeight:1.6, marginBottom:24 }}>{q.sub}</div>}
          {!q.sub && <div style={{ marginBottom:24 }} />}

          {/* likert */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {LIKERT.map(opt => {
              const sel = answers[idx] === opt.val;
              return (
                <div key={opt.val} onClick={() => select(opt.val)} style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'13px 18px',
                  border:`1px solid ${sel ? G.accent2 : G.border}`,
                  borderRadius:6, cursor:'pointer',
                  background: sel ? `${G.accent3}20` : G.surface,
                  transition:'all 0.15s',
                  borderLeft: sel ? `3px solid ${G.accent}` : `1px solid ${G.border}`,
                }}
                  onMouseEnter={e=>{ if (!sel) e.currentTarget.style.borderColor=G.border2; }}
                  onMouseLeave={e=>{ if (!sel) e.currentTarget.style.borderColor=G.border; }}
                >
                  <div style={{
                    width:15, height:15, borderRadius:'50%', flexShrink:0,
                    border:`1.5px solid ${sel ? G.accent : G.border2}`,
                    background: sel ? G.accent : 'transparent',
                    boxShadow: sel ? `0 0 8px ${G.accent}66` : 'none',
                    transition:'all 0.15s',
                  }} />
                  <span style={{ fontSize:13, color: sel ? G.text : G.text, transition:'color 0.15s' }}>{opt.label}</span>
                  <span style={{ marginLeft:'auto', fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:G.text3 }}>{opt.val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* nav */}
      <div style={{
        position:'sticky', bottom:0,
        background:'rgba(10,10,15,0.95)', backdropFilter:'blur(16px)',
        borderTop:`1px solid ${G.border}`,
        padding:'14px 28px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        maxWidth:700, margin:'0 auto', width:'100%',
      }}>
        <button onClick={goPrev} disabled={idx===0} style={{
          padding:'11px 24px', border:`1.5px solid ${idx===0?G.border:G.border2}`,
          borderRadius:4, background:'transparent',
          color: idx===0 ? G.text3 : G.text2,
          cursor: idx===0 ? 'not-allowed' : 'pointer',
          fontFamily:"'Syne', sans-serif", fontSize:12, fontWeight:600,
          letterSpacing:'0.08em', textTransform:'uppercase',
        }}>← Anterior</button>

        <button onClick={goNext} disabled={answers[idx]===null} style={{
          padding:'11px 28px',
          border:`1.5px solid ${answers[idx]===null ? G.border2 : G.accent}`,
          borderRadius:4,
          background: answers[idx]===null ? G.border2 : G.accent,
          color: answers[idx]===null ? G.text3 : G.bg,
          cursor: answers[idx]===null ? 'not-allowed' : 'pointer',
          fontFamily:"'Syne', sans-serif", fontSize:12, fontWeight:700,
          letterSpacing:'0.08em', textTransform:'uppercase',
          transition:'all 0.15s',
        }}>
          {idx === QUESTIONS.length-1 ? 'Ver resultado →' : 'Próxima →'}
        </button>
      </div>
    </div>
  );
}

// ── SCREEN 3: RESULT ──────────────────────────────────────────────────
function DimBar({ dim, pct }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(()=>setWidth(pct),100); return()=>clearTimeout(t); }, [pct]);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'160px 1fr 44px', gap:14, alignItems:'center' }}>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:G.text }}>{dim.name}</div>
        {dim.isMasking && <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:9, color:G.gold, marginTop:2 }}>◆ Camuflagem</div>}
      </div>
      <div style={{ height:5, background:G.border, borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${width}%`, background:dim.color, borderRadius:3, transition:'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
      </div>
      <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:G.text2, textAlign:'right' }}>{pct}%</div>
    </div>
  );
}

function Result({ answers, onRestart }) {
  const scores = calcScores(answers);
  const risk = getRisk(scores.total);
  const maskPct = scores.masking;
  const maskLevel = maskPct >= 60 ? 'alto' : maskPct >= 40 ? 'moderado' : 'baixo';

  const heroDesc = {
    low: 'A pontuação está abaixo do limiar clínico para rastreamento positivo. Isso não descarta experiências de divergência — especialmente se o índice de masking for elevado.',
    medium: 'A pontuação indica presença moderada de características associadas ao TEA. Fatores de masking e histórico de diagnóstico tardio devem ser considerados.',
    high: 'A pontuação está na faixa de risco elevado. O perfil sugere presença significativa de características do espectro, com possível subestimação por estratégias de camuflagem.',
    'very-high': 'Pontuação na faixa de risco muito elevado, com presença intensa de características do espectro em múltiplas dimensões. Encaminhamento para avaliação formal é fortemente recomendado.',
  }[risk.level];

  const maskDesc = maskPct >= 65
    ? `O índice de masking está muito elevado. Adultos com alto masking frequentemente têm pontuações totais subestimadas — a expressão real de características autísticas pode ser significativamente maior. Isso explica diagnósticos perdidos por décadas, especialmente em mulheres.`
    : maskPct >= 45
    ? `O índice de masking é moderado a elevado. Estratégias de camuflagem presentes podem estar mascarando o nível real de características do espectro. O escore total deve ser interpretado com esse fator em mente.`
    : `O índice de masking é relativamente baixo, sugerindo que as características do espectro expressam-se com mais liberdade. O escore total reflete razoavelmente a intensidade das características avaliadas.`;

  const recs = [];
  if (risk.level === 'high' || risk.level === 'very-high') recs.push({ title:'Buscar avaliação diagnóstica formal', desc:'Procure psiquiatra ou neuropsicólogo com experiência em diagnóstico tardio de TEA. Informe sobre este rastreamento e leve um relato da sua história de vida.' });
  if (maskPct >= 50) recs.push({ title:'Considerar o impacto do masking na saúde', desc:'Masking prolongado está associado a burnout autístico, ansiedade e depressão. Terapia com profissional informado sobre neurodivergência pode ser essencial.' });
  if (scores.sensory >= 55) recs.push({ title:'Avaliação de terapia ocupacional sensorial', desc:'Um terapeuta ocupacional especializado em integração sensorial pode mapear seu perfil e propor adaptações ambientais e estratégias de regulação.' });
  recs.push({ title:'Explorar comunidades de diagnóstico tardio', desc:'Grupos para adultos no espectro e recursos especializados em diagnóstico tardio oferecem perspectiva valiosa e senso de pertencimento.' });

  const card = (title, content) => (
    <div style={{ padding:22, border:`1px solid ${G.border}`, borderRadius:8, background:G.surface }}>
      <div style={{ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:G.text2, marginBottom:10, fontFamily:"'JetBrains Mono', monospace" }}>{title}</div>
      <div style={{ fontSize:13, color:G.text, lineHeight:1.7, marginTop:8 }} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:G.bg }}>
      <div style={{ maxWidth:820, margin:'0 auto', padding:'60px 28px 100px' }}>

        {/* eyebrow */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:44 }}>
          <div style={{ width:32, height:1, background:G.border2 }} />
          <MonoLabel>Relatório de Triagem</MonoLabel>
        </div>

        {/* hero */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:40, alignItems:'start', marginBottom:44, paddingBottom:44, borderBottom:`1px solid ${G.border}` }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:3, border:`1px solid ${risk.color}44`, background:`${risk.color}14`, marginBottom:18 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:risk.color, display:'inline-block' }} />
              <MonoLabel color={risk.color}>{risk.label}</MonoLabel>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(32px,5vw,52px)', fontWeight:300, lineHeight:1.05, marginBottom:14, color:G.text }}>
              {risk.level==='low'&&<>Abaixo do <em style={{color:risk.color}}>limiar</em></>}
              {risk.level==='medium'&&<>Risco <em style={{color:risk.color}}>moderado</em></>}
              {risk.level==='high'&&<>Risco <em style={{color:risk.color}}>elevado</em></>}
              {risk.level==='very-high'&&<>Risco <em style={{color:risk.color}}>muito elevado</em></>}
            </div>
            <div style={{ fontSize:13.5, color:G.text, lineHeight:1.8, maxWidth:460 }}>{heroDesc}</div>
          </div>
          <div style={{ width:130, height:130, borderRadius:'50%', border:`1px solid ${G.border2}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:`${risk.color}0f`, flexShrink:0 }}>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:48, fontWeight:500, color:risk.color, lineHeight:1 }}>{scores.total}</div>
            <MonoLabel>/ 100</MonoLabel>
          </div>
        </div>

        {/* dim bars */}
        <div style={{ marginBottom:44 }}>
          <div style={{ paddingBottom:12, marginBottom:20, borderBottom:`1px solid ${G.border}` }}><MonoLabel>Perfil por dimensão</MonoLabel></div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {DIMENSIONS.map(dim => <DimBar key={dim.id} dim={dim} pct={scores[dim.id]} />)}
          </div>
        </div>

        {/* masking */}
        <div style={{ border:`1px solid ${G.border}`, borderRadius:10, overflow:'hidden', marginBottom:44 }}>
          <div style={{ padding:'18px 22px', background:G.surface, borderBottom:`1px solid ${G.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:G.gold, boxShadow:`0 0 8px ${G.gold}66` }} />
              <span style={{ fontSize:13, fontWeight:600, color:G.text }}>Análise de Masking & Camuflagem</span>
            </div>
            <Tag color={G.gold}>{maskPct}% — nível {maskLevel}</Tag>
          </div>
          <div style={{ padding:22, background:G.surface2 }}>
            <div style={{ fontSize:13.5, color:G.text, lineHeight:1.75, marginBottom:18 }} dangerouslySetInnerHTML={{ __html: maskDesc }} />
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {(maskPct >= 50 ? [
                'Discrepância potencial entre aparência social externa e custo interno — comum em diagnóstico tardio.',
                'Provável aprendizado de scripts sociais desde a infância ou adolescência.',
                'Risco elevado de burnout autístico após esforço prolongado de camuflagem.',
                'Alto funcionamento cognitivo pode ter facilitado o masking, retardando o reconhecimento.',
              ] : [
                'Autoconhecimento sobre seus padrões de comportamento é um passo valioso independente do nível de masking.',
                'Espaços seguros onde o masking não é necessário são essenciais para bem-estar e regulação emocional.',
                'Mesmo com masking baixo, algumas estratégias compensatórias podem estar presentes de forma inconsciente.',
              ]).map((ind, i) => (
                <div key={i} style={{ display:'flex', gap:12, fontSize:13, color:G.text, lineHeight:1.55 }}>
                  <span style={{ color:G.gold, fontSize:8, marginTop:5, flexShrink:0 }}>◆</span>
                  {ind}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* profile blocks */}
        <div style={{ paddingBottom:12, marginBottom:20, borderBottom:`1px solid ${G.border}` }}><MonoLabel color={G.text2}>Perfil qualitativo</MonoLabel></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:44 }}>
          {card('Perfil Social', scores.social>=60 ? '<strong style="color:#e8e4dc">Dificuldades significativas</strong> em comunicação e cognição social. Provável processamento diferente de pistas sociais implícitas.' : 'Padrão misto: algumas interações fluem bem, outras custam esforço considerável — especialmente em grupos ou contextos desconhecidos.')}
          {card('Rotinas & Interesses', scores.patterns>=55 ? '<strong style="color:#e8e4dc">Interesses intensos e necessidade de previsibilidade</strong> são traços marcantes. Mudanças não planejadas têm impacto emocional relevante.' : 'Presença moderada de padrões repetitivos ou interesses restritos. Flexibilidade adaptativa relativamente preservada.')}
          {card('Perfil Sensorial', scores.sensory>=60 ? '<strong style="color:#e8e4dc">Processamento sensorial atípico acentuado</strong> — hiper ou hipossensibilidade em múltiplas modalidades com impacto significativo na vida diária.' : 'Sensibilidade sensorial presente em grau variável. Ambientes de alta estimulação podem ser desafiadores mesmo com pontuação moderada.')}
          {card('Perfil Cognitivo', scores.cognition>=55 ? '<strong style="color:#e8e4dc">Perfil de função executiva divergente</strong>: hiperfoco intenso, dificuldade de iniciação e gestão de tempo — com possível alta inteligência em domínios específicos.' : 'Função executiva com desafios pontuais. Pensamento detalhista e processamento visual podem ser pontos fortes neste perfil.')}
        </div>

        {/* recs */}
        <div style={{ paddingBottom:12, marginBottom:20, borderBottom:`1px solid ${G.border}` }}><MonoLabel color={G.text2}>Próximos passos recomendados</MonoLabel></div>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:44 }}>
          {recs.map((r,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:16, padding:'18px 20px', border:`1px solid ${G.border}`, borderRadius:8, background:G.surface, alignItems:'start' }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:32, fontWeight:300, color:G.border2, lineHeight:1 }}>0{i+1}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:5, color:G.text }}>{r.title}</div>
                <div style={{ fontSize:12.5, color:G.text2, lineHeight:1.65 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* paywall */}
        <div style={{ paddingBottom:12, marginBottom:20, borderBottom:`1px solid ${G.border}` }}><MonoLabel color={G.text2}>Relatório completo</MonoLabel></div>
        <div style={{ position:'relative', marginBottom:44, borderRadius:10, overflow:'hidden', minHeight:260 }}>
          {/* blurred preview */}
          <div style={{ filter:'blur(5px)', opacity:0.35, pointerEvents:'none', padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {['Perfil Cognitivo Detalhado','Comparativo por Gênero','Trajetória de Diagnóstico','Recursos por Perfil'].map(t=>(
              <div key={t} style={{ padding:18, border:`1px solid ${G.border}`, borderRadius:8, background:G.surface }}>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:9, color:G.text3, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.12em' }}>{t}</div>
                <div style={{ fontSize:12, color:G.text3, lineHeight:1.6 }}>██████ ████ ██ ████████ ██████ ████ ██ ████████</div>
              </div>
            ))}
          </div>
          {/* overlay */}
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom, transparent 0%, ${G.bg} 35%)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'0 24px 36px', textAlign:'center' }}>
            <Tag color={G.gold} style={{ marginBottom:12 }}>◆ Relatório Premium</Tag>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:400, margin:'12px 0 8px', color:G.text }}>
              Acesse a análise <em style={{color:G.gold}}>completa</em>
            </div>
            <div style={{ fontSize:13, color:G.text2, maxWidth:360, lineHeight:1.6, marginBottom:22 }}>
              PDF com perfil cognitivo detalhado, comparativo de gênero, orientações para busca diagnóstica e recursos específicos para o seu perfil.
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, justifyContent:'center', marginBottom:20 }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:G.gold }}>R$</span>
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:42, fontWeight:500, color:G.gold2, lineHeight:1 }}>29</span>
              <span style={{ fontSize:12, color:G.text3 }}>,90 — pagamento único</span>
            </div>
            <button style={{
              padding:'14px 44px',
              background:`linear-gradient(135deg,${G.gold},${G.gold2})`,
              color:G.bg, border:'none', borderRadius:3, cursor:'pointer',
              fontFamily:"'Syne', sans-serif", fontSize:12, fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${G.gold}44`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              Obter relatório completo →
            </button>
          </div>
        </div>

        {/* disclaimer */}
        <div style={{ padding:'16px 20px', border:`1px solid ${G.border}`, borderRadius:6, fontFamily:"'JetBrains Mono', monospace", fontSize:9.5, color:G.text3, lineHeight:1.7, letterSpacing:'0.02em', marginBottom:32 }}>
          ⚠ AVISO CLÍNICO — Instrumento de RASTREAMENTO, não diagnóstico. Baseado em itens derivados de RAADS-R, CAT-Q, AQ-50 e SRS-2. Pontuações elevadas devem ser encaminhadas para avaliação por psiquiatra ou neuropsicólogo especializado em TEA de diagnóstico tardio. Masking elevado pode subestimar a pontuação total.
        </div>

        <button onClick={onRestart} style={{ background:'none', border:'none', fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:G.text3, cursor:'pointer', textDecoration:'underline', letterSpacing:'0.1em' }}>
          ← Refazer avaliação
        </button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('landing');
  const [finalAnswers, setFinalAnswers] = useState(null);

  useEffect(() => {
    document.documentElement.style.background = '#0a0a0f';
    document.documentElement.style.color = '#f0ece4';
    document.body.style.background = '#0a0a0f';
    document.body.style.color = '#f0ece4';
    document.body.style.margin = '0';
    document.body.style.overscrollBehaviorY = 'none';
  }, []);

  if (screen === 'landing') return <Landing onStart={() => setScreen('quiz')} />;
  if (screen === 'quiz')    return <Quiz onFinish={(ans) => { setFinalAnswers(ans); setScreen('result'); }} />;
  return <Result answers={finalAnswers} onRestart={() => setScreen('landing')} />;
}
