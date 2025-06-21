import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import '../App.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const industries = [
    'Tecnologia',
    'Manifatturiero',
    'Servizi',
    'Commercio',
    'Sanità',
    'Educazione',
    'Finanza',
    'Immobiliare',
    'Turismo',
    'Altro'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      industry: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.firstName.trim()) {
      setError('Il nome è richiesto');
      setLoading(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError('Il cognome è richiesto');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Inserisci un indirizzo email valido');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('La password deve essere di almeno 8 caratteri');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      setLoading(false);
      return;
    }

    if (!formData.companyName.trim()) {
      setError('Il nome dell\'azienda è richiesto');
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        companyName: formData.companyName.trim(),
        industry: formData.industry || 'Altro'
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '' };
    if (password.length < 6) return { strength: 1, text: 'Debole', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 2, text: 'Media', color: 'bg-yellow-500' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: 'Forte', color: 'bg-green-500' };
    }
    return { strength: 2, text: 'Media', color: 'bg-yellow-500' };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Do-Flow</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Inizia la tua prova gratuita</h1>
          <p className="text-gray-300">7 giorni gratis, poi solo 99€ al mese</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Crea il tuo account</CardTitle>
            <CardDescription className="text-gray-300">
              Compila i dati per iniziare con Do-Flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-900/50 border-red-600 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">Nome *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Mario"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Cognome *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Rossi"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mario.rossi@esempio.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Almeno 8 caratteri"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${strength.color}`}
                          style={{ width: `${(strength.strength / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300">{strength.text}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Conferma Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ripeti la password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Le password corrispondono</span>
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-white">Nome Azienda *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="La mia azienda SRL"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-white">Settore</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Seleziona il settore" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry} className="text-white hover:bg-slate-600">
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creazione account...
                  </>
                ) : (
                  'Inizia la prova gratuita'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Hai già un account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Accedi qui
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-6 text-xs text-gray-400 text-center">
              Registrandoti accetti i nostri{' '}
              <Link to="#" className="text-blue-400 hover:text-blue-300">Termini di Servizio</Link>
              {' '}e la{' '}
              <Link to="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

