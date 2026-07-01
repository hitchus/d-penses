import { useState } from 'react'
import './App.css'

const CREDENTIALS = { username: 'hicham', password: '1Adam2Aicha.' }

const FIXED_EXPENSES = [
  { id: 'logement', label: 'Traite Logement', amount: 6544.22, category: 'logement' },
  { id: 'assurance_logement', label: 'Assurance Logement', amount: 376.77, category: 'logement' },
  { id: 'voiture', label: 'Traite Voiture', amount: 3692.85, category: 'transport' },
  { id: 'assurance_voiture', label: 'Assurance Voiture', amount: 95.27, category: 'transport' },
  { id: 'ecole', label: 'École', amount: 4000.00, category: 'education' },
  { id: 'charges_vie', label: 'Charges de vie', amount: 3000.00, category: 'vie' },
  { id: 'syndic', label: 'Frais de Syndic', amount: 800.00, category: 'logement' },
]

const SEMI_FIXED_EXPENSES = [
  { id: 'electricite', label: 'Électricité (ONEE)', amount: 559.00, category: 'util' },
  { id: 'eau', label: 'Eau (LYDEC)', amount: 121.00, category: 'util' },
  { id: 'fibre', label: 'Orange Fibre', amount: 499.00, category: 'telecom' },
  { id: 'gsm1', label: 'Orange GSM 1', amount: 95.00, category: 'telecom' },
  { id: 'gsm2', label: 'Orange GSM 2', amount: 99.00, category: 'telecom' },
  { id: 'gsm3', label: 'Orange GSM 3', amount: 164.00, category: 'telecom' },
]

const CAT_COLOR = {
  logement: '#6366f1', transport: '#f59e0b', education: '#10b981',
  vie: '#3b82f6', autre: '#ec4899', loisir: '#8b5cf6', sante: '#ef4444',
  util: '#06b6d4', telecom: '#f97316',
}
const CAT_ICON = {
  logement: '🏠', transport: '🚗', education: '🎓',
  vie: '🛒', autre: '💸', loisir: '🎮', sante: '💊',
  util: '⚡', telecom: '📱',
}

const fmt = (n) =>
  new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' DH'

let uid = 1

function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
      sessionStorage.setItem('dpenses_auth', '1')
      onLogin()
    } else {
      setError(true)
      setPass('')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-logo">💰</div>
        <h2 className="login-title">D-Penses</h2>
        <p className="login-sub">Connectez-vous pour accéder à votre espace</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            className={`field ${error ? 'field-error' : ''}`}
            placeholder="Nom d'utilisateur"
            value={user}
            autoComplete="username"
            onChange={e => { setUser(e.target.value); setError(false) }}
          />
          <input
            className={`field ${error ? 'field-error' : ''}`}
            type="password"
            placeholder="Mot de passe"
            value={pass}
            autoComplete="current-password"
            onChange={e => { setPass(e.target.value); setError(false) }}
          />
          {error && <p className="login-error">Identifiants incorrects</p>}
          <button className="btn btn-green login-btn" type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [incomes, setIncomes] = useState([{ id: 'salaire', label: 'Salaire', amount: '' }])
  const [extras, setExtras] = useState([])
  const [tab, setTab] = useState('dashboard')
  const [incomeModal, setIncomeModal] = useState(false)
  const [expenseModal, setExpenseModal] = useState(false)
  const [newInc, setNewInc] = useState({ label: '', amount: '' })
  const [newExp, setNewExp] = useState({ label: '', amount: '', category: 'autre' })

  const totalIncome = incomes.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
  const totalFixed = FIXED_EXPENSES.reduce((s, e) => s + e.amount, 0)
  const totalSemiFixed = SEMI_FIXED_EXPENSES.reduce((s, e) => s + e.amount, 0)
  const totalExtra = extras.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
  const totalExp = totalFixed + totalSemiFixed + totalExtra
  const balance = totalIncome - totalExp
  const pct = totalIncome > 0 ? Math.min((totalExp / totalIncome) * 100, 100) : 0

  function addIncome() {
    if (!newInc.label.trim() || !newInc.amount) return
    setIncomes(p => [...p, { id: `i${uid++}`, label: newInc.label, amount: newInc.amount }])
    setNewInc({ label: '', amount: '' })
    setIncomeModal(false)
  }

  function addExpense() {
    if (!newExp.label.trim() || !newExp.amount) return
    setExtras(p => [...p, { id: `e${uid++}`, ...newExp }])
    setNewExp({ label: '', amount: '', category: 'autre' })
    setExpenseModal(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="hdr-title">
          <span className="logo-icon">💰</span>
          <div>
            <h1 className="app-title">D-Penses</h1>
            <p className="app-sub">Gestion financière personnelle</p>
          </div>
        </div>
        <div className="hdr-btns">
          <button className="btn btn-green" onClick={() => setIncomeModal(true)}>＋ Revenu</button>
          <button className="btn btn-red" onClick={() => setExpenseModal(true)}>＋ Dépense</button>
          <button className="btn btn-ghost" onClick={onLogout}>⎋ Déconnexion</button>
        </div>
      </header>

      <nav className="tabs">
        {['dashboard', 'revenus', 'depenses'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
            {t === 'dashboard' ? '📊 Tableau de bord' : t === 'revenus' ? '📈 Revenus' : '📉 Dépenses'}
          </button>
        ))}
      </nav>

      {tab === 'dashboard' && (
        <div className="content">
          <div className="kpi-row">
            <div className="kpi kpi-green">
              <p className="kpi-label">Total Revenus</p>
              <p className="kpi-val">{fmt(totalIncome)}</p>
            </div>
            <div className="kpi kpi-red">
              <p className="kpi-label">Total Dépenses</p>
              <p className="kpi-val">{fmt(totalExp)}</p>
            </div>
            <div className={`kpi ${balance >= 0 ? 'kpi-blue' : 'kpi-orange'}`}>
              <p className="kpi-label">{balance >= 0 ? '✅ Solde restant' : '⚠️ Déficit'}</p>
              <p className="kpi-val">{fmt(balance)}</p>
            </div>
          </div>

          <div className="card">
            <div className="progress-hdr">
              <span>Budget utilisé</span>
              <span className={pct > 90 ? 'txt-red' : pct > 70 ? 'txt-orange' : 'txt-green'}>
                {pct.toFixed(1)} %
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-bar ${pct > 90 ? 'bar-red' : pct > 70 ? 'bar-orange' : 'bar-green'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="progress-footer">
              <span>0 DH</span>
              <span>{fmt(totalIncome)}</span>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Dépenses fixes</h3>
            {FIXED_EXPENSES.map(e => (
              <div key={e.id} className="row-item">
                <div className="row-left">
                  <span className="dot" style={{ background: CAT_COLOR[e.category] }} />
                  <span>{CAT_ICON[e.category]} {e.label}</span>
                </div>
                <div className="row-right">
                  <span className="amt">{fmt(e.amount)}</span>
                  {totalIncome > 0 && (
                    <span className="pct-chip">{((e.amount / totalIncome) * 100).toFixed(1)}%</span>
                  )}
                </div>
              </div>
            ))}
            <div className="divider" />
            <div className="row-item">
              <strong>Sous-total fixes</strong>
              <strong>{fmt(totalFixed)}</strong>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Charges partiellement fixes <span className="avg-badge">moyennes</span></h3>
            {SEMI_FIXED_EXPENSES.map(e => (
              <div key={e.id} className="row-item">
                <div className="row-left">
                  <span className="dot" style={{ background: CAT_COLOR[e.category] }} />
                  <span>{CAT_ICON[e.category]} {e.label}</span>
                </div>
                <div className="row-right">
                  <span className="amt">{fmt(e.amount)}</span>
                  {totalIncome > 0 && (
                    <span className="pct-chip">{((e.amount / totalIncome) * 100).toFixed(1)}%</span>
                  )}
                </div>
              </div>
            ))}
            <div className="divider" />
            <div className="row-item">
              <strong>Sous-total charges</strong>
              <strong>{fmt(totalSemiFixed)}</strong>
            </div>
          </div>

          {extras.length > 0 && (
            <div className="card">
              <h3 className="section-title">Dépenses variables</h3>
              {extras.map(e => (
                <div key={e.id} className="row-item">
                  <div className="row-left">
                    <span className="dot" style={{ background: CAT_COLOR[e.category] || CAT_COLOR.autre }} />
                    <span>{CAT_ICON[e.category] || '💸'} {e.label}</span>
                  </div>
                  <div className="row-right">
                    <span className="amt">{fmt(parseFloat(e.amount) || 0)}</span>
                    <button className="del-btn" onClick={() => setExtras(p => p.filter(x => x.id !== e.id))}>✕</button>
                  </div>
                </div>
              ))}
              <div className="divider" />
              <div className="row-item">
                <strong>Sous-total variables</strong>
                <strong>{fmt(totalExtra)}</strong>
              </div>
            </div>
          )}

          {extras.length === 0 && (
            <div className="empty-card" onClick={() => setExpenseModal(true)}>
              <p>＋ Ajouter une dépense variable</p>
            </div>
          )}
        </div>
      )}

      {tab === 'revenus' && (
        <div className="content">
          <div className="card">
            <div className="card-top">
              <h3 className="section-title">Mes Revenus</h3>
              <button className="btn btn-green sm" onClick={() => setIncomeModal(true)}>＋ Ajouter</button>
            </div>
            {incomes.map(i => (
              <div key={i.id} className="row-item">
                <span>💵 {i.label}</span>
                <div className="row-right">
                  <input
                    className="amt-input"
                    type="number"
                    placeholder="0.00"
                    value={i.amount}
                    onChange={e => setIncomes(p => p.map(x => x.id === i.id ? { ...x, amount: e.target.value } : x))}
                  />
                  <span className="currency-label">DH</span>
                  {incomes.length > 1 && (
                    <button className="del-btn" onClick={() => setIncomes(p => p.filter(x => x.id !== i.id))}>✕</button>
                  )}
                </div>
              </div>
            ))}
            <div className="divider" />
            <div className="row-item">
              <strong>Total revenus</strong>
              <strong className="txt-green">{fmt(totalIncome)}</strong>
            </div>
          </div>
        </div>
      )}

      {tab === 'depenses' && (
        <div className="content">
          <div className="card">
            <h3 className="section-title">Dépenses fixes mensuelles</h3>
            {FIXED_EXPENSES.map(e => (
              <div key={e.id} className="row-item">
                <div className="row-left">
                  <span className="cat-pill" style={{ background: CAT_COLOR[e.category] + '25', color: CAT_COLOR[e.category] }}>
                    {CAT_ICON[e.category]} {e.category}
                  </span>
                  <span>{e.label}</span>
                </div>
                <span className="amt">{fmt(e.amount)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="row-item">
              <strong>Sous-total fixes</strong>
              <strong>{fmt(totalFixed)}</strong>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title">Charges partiellement fixes <span className="avg-badge">moyennes</span></h3>
            {SEMI_FIXED_EXPENSES.map(e => (
              <div key={e.id} className="row-item">
                <div className="row-left">
                  <span className="cat-pill" style={{ background: CAT_COLOR[e.category] + '25', color: CAT_COLOR[e.category] }}>
                    {CAT_ICON[e.category]} {e.category}
                  </span>
                  <span>{e.label}</span>
                </div>
                <span className="amt">{fmt(e.amount)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="row-item">
              <strong>Sous-total charges</strong>
              <strong>{fmt(totalSemiFixed)}</strong>
            </div>
          </div>

          <div className="card">
            <div className="card-top">
              <h3 className="section-title">Dépenses variables</h3>
              <button className="btn btn-red sm" onClick={() => setExpenseModal(true)}>＋ Ajouter</button>
            </div>
            {extras.length === 0 && <p className="empty-msg">Aucune dépense variable ce mois-ci</p>}
            {extras.map(e => (
              <div key={e.id} className="row-item">
                <div className="row-left">
                  <span className="cat-pill" style={{ background: (CAT_COLOR[e.category] || CAT_COLOR.autre) + '25', color: CAT_COLOR[e.category] || CAT_COLOR.autre }}>
                    {CAT_ICON[e.category] || '💸'} {e.category}
                  </span>
                  <span>{e.label}</span>
                </div>
                <div className="row-right">
                  <span className="amt">{fmt(parseFloat(e.amount) || 0)}</span>
                  <button className="del-btn" onClick={() => setExtras(p => p.filter(x => x.id !== e.id))}>✕</button>
                </div>
              </div>
            ))}
            {extras.length > 0 && (
              <>
                <div className="divider" />
                <div className="row-item">
                  <strong>Sous-total variables</strong>
                  <strong>{fmt(totalExtra)}</strong>
                </div>
              </>
            )}
          </div>

          <div className="card total-card">
            <div className="row-item">
              <strong>TOTAL DÉPENSES</strong>
              <strong className="total-big">{fmt(totalExp)}</strong>
            </div>
            <div className="row-item">
              <span className={balance >= 0 ? 'txt-green' : 'txt-red'}>
                {balance >= 0 ? '✅ Solde restant' : '⚠️ Déficit'}
              </span>
              <span className={balance >= 0 ? 'txt-green amt' : 'txt-red amt'}>{fmt(balance)}</span>
            </div>
          </div>
        </div>
      )}

      {incomeModal && (
        <div className="overlay" onClick={() => setIncomeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <h3>Nouveau revenu</h3>
              <button className="modal-close" onClick={() => setIncomeModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>Libellé</label>
              <input className="field" placeholder="Salaire, Prime, Freelance…" value={newInc.label}
                onChange={e => setNewInc(p => ({ ...p, label: e.target.value }))} />
              <label>Montant (DH)</label>
              <input className="field" type="number" placeholder="0.00" value={newInc.amount}
                onChange={e => setNewInc(p => ({ ...p, amount: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addIncome()} />
            </div>
            <div className="modal-ftr">
              <button className="btn btn-ghost" onClick={() => setIncomeModal(false)}>Annuler</button>
              <button className="btn btn-green" onClick={addIncome}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {expenseModal && (
        <div className="overlay" onClick={() => setExpenseModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <h3>Nouvelle dépense</h3>
              <button className="modal-close" onClick={() => setExpenseModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>Libellé</label>
              <input className="field" placeholder="Restaurant, Vêtements…" value={newExp.label}
                onChange={e => setNewExp(p => ({ ...p, label: e.target.value }))} />
              <label>Montant (DH)</label>
              <input className="field" type="number" placeholder="0.00" value={newExp.amount}
                onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))} />
              <label>Catégorie</label>
              <select className="field" value={newExp.category}
                onChange={e => setNewExp(p => ({ ...p, category: e.target.value }))}>
                <option value="autre">💸 Autre</option>
                <option value="logement">🏠 Logement</option>
                <option value="transport">🚗 Transport</option>
                <option value="education">🎓 Éducation</option>
                <option value="vie">🛒 Vie courante</option>
                <option value="loisir">🎮 Loisirs</option>
                <option value="sante">💊 Santé</option>
              </select>
            </div>
            <div className="modal-ftr">
              <button className="btn btn-ghost" onClick={() => setExpenseModal(false)}>Annuler</button>
              <button className="btn btn-red" onClick={addExpense}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('dpenses_auth') === '1')

  function logout() {
    sessionStorage.removeItem('dpenses_auth')
    setAuthed(false)
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  return <Dashboard onLogout={logout} />
}
