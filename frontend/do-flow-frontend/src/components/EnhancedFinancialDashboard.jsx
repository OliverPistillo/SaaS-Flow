import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  Eye,
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building,
  User
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import '../App.css';

const EnhancedFinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'bank',
    category: '',
    clientName: '',
    receivedDate: '',
    notes: '',
    uploadProof: null
  });

  const [financialData, setFinancialData] = useState({
    accounts: [
      { id: 'ACC-001', name: 'Main Bank Account', type: 'bank', balance: 25000.00 },
      { id: 'ACC-002', name: 'Cash Register', type: 'cash', balance: 2500.00 },
      { id: 'ACC-003', name: 'Business Card', type: 'card', balance: 5000.00 }
    ],
    transactions: [
      {
        id: '1s5gf1',
        category: 'Salary',
        name: 'Starbucks',
        details: 'Dhanmondi Branch 2 Rent',
        amount: 33200.00,
        type: 'income',
        paymentMethod: 'bank',
        account: 'Bank',
        date: '2024-01-15',
        image: null
      },
      {
        id: 'dsrg515',
        category: 'Office Rent',
        name: 'Pizza Hut',
        details: 'Dhanmondi Branch 2 Rent',
        amount: 12200.00,
        type: 'expense',
        paymentMethod: 'bank',
        account: 'Bank',
        date: '2024-01-14',
        image: null
      },
      {
        id: '452hd',
        category: 'Car Rent',
        name: 'Car Rent',
        details: 'Vehicle rental for business',
        amount: 1200.00,
        type: 'expense',
        paymentMethod: 'cash',
        account: 'Cash',
        date: '2024-01-13',
        image: null
      }
    ]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleAddTransaction = () => {
    setShowAddModal(true);
  };

  const handleSubmitTransaction = (e) => {
    e.preventDefault();
    // Add transaction logic here
    console.log('Adding transaction:', { ...formData, type: transactionType });
    setShowAddModal(false);
    setFormData({
      amount: '',
      paymentMethod: 'bank',
      category: '',
      clientName: '',
      receivedDate: '',
      notes: '',
      uploadProof: null
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024 * 1024) { // 50MB limit
      setFormData(prev => ({ ...prev, uploadProof: file }));
    } else {
      alert('File size must be less than 50MB');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">€12,153.00</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ricavi Annuali (2024)</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">€12,153.00</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Costi Totali (2024)</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">€12,153.00</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Risparmi Annuali (2024)</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">€12,153.00</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>IVA/Tasse (2024)</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Andamento Mensile
            </h3>
          </div>
          <div className="card-content">
            <div className="h-64 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Grafico Entrate/Uscite/Risparmi</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Distribuzione per Categoria
            </h3>
          </div>
          <div className="card-content">
            <div className="h-64 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Grafico a Torta Categorie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Gestione Account
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Puoi aggiungere le tue entrate e spese quotidiane
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialData.accounts.map((account) => (
          <div key={account.id} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {account.type === 'bank' && <Building className="w-5 h-5 text-blue-600" />}
                    {account.type === 'cash' && <DollarSign className="w-5 h-5 text-green-600" />}
                    {account.type === 'card' && <CreditCard className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {account.name}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {account.id}
                    </p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(account.balance)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Saldo disponibile
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Transazioni
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Gestisci tutte le tue transazioni finanziarie
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="btn btn-ghost">
            <Search className="w-4 h-4 mr-2" />
            Cerca
          </button>
          <button className="btn btn-ghost">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </button>
          <button className="btn btn-primary" onClick={handleAddTransaction}>
            <Plus className="w-4 h-4 mr-2" />
            Nuova Transazione
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>T-ID</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Categoria</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Nome</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Dettagli</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Importo</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Tipo</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Account</th>
                  <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {financialData.transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                        {transaction.id}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {transaction.name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {transaction.details}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? 'Entrata' : 'Uscita'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {transaction.account}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="btn btn-ghost btn-sm">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="btn btn-ghost btn-sm text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddTransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {transactionType === 'income' ? 'Aggiungi Entrata' : 'Aggiungi Spesa'}
        </h3>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setTransactionType('income')}
            className={`btn ${transactionType === 'income' ? 'btn-primary' : 'btn-secondary'} flex-1`}
          >
            Entrata
          </button>
          <button
            onClick={() => setTransactionType('expense')}
            className={`btn ${transactionType === 'expense' ? 'btn-primary' : 'btn-secondary'} flex-1`}
          >
            Spesa
          </button>
        </div>

        <form onSubmit={handleSubmitTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Importo
            </label>
            <input
              type="number"
              step="0.01"
              className="input"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Metodo di Pagamento
            </label>
            <select
              className="input"
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
            >
              <option value="bank">Bonifico Bancario</option>
              <option value="card">Carta</option>
              <option value="cash">Contanti</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Categoria
            </label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="">Seleziona categoria</option>
              {transactionType === 'income' ? (
                <>
                  <option value="salary">Stipendio</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investimenti</option>
                </>
              ) : (
                <>
                  <option value="office_rent">Affitto Ufficio</option>
                  <option value="car_rent">Noleggio Auto</option>
                  <option value="equipment">Attrezzature</option>
                  <option value="utilities">Utenze</option>
                </>
              )}
            </select>
          </div>

          {transactionType === 'income' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Nome Cliente / Azienda
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Nome del cliente"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Data di Ricezione
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.receivedDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, receivedDate: e.target.value }))}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Note
            </label>
            <textarea
              className="input"
              rows="3"
              placeholder="Aggiungi note dettagliate..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Carica Prova (opzionale)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Clicca per caricare o trascina qui
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Dimensione massima file: 50MB
                </p>
              </label>
            </div>
            {formData.uploadProof && (
              <p className="text-sm mt-2" style={{ color: 'var(--text-primary)' }}>
                File selezionato: {formData.uploadProof.name}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-secondary flex-1"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Salva Transazione
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Piano Finanziario
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Gestisci le tue finanze e monitora le performance
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Panoramica' },
              { id: 'accounts', label: 'Account' },
              { id: 'transactions', label: 'Transazioni' },
              { id: 'reports', label: 'Report' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ 
                  color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-muted)' }}>Sezione Report in sviluppo</p>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showAddModal && renderAddTransactionModal()}
      </div>
    </DashboardLayout>
  );
};

export default EnhancedFinancialDashboard;

