import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/helpers';
import '../App.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Inserisci un indirizzo email valido');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('La password è richiesta');
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Do-Flow</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Bentornato</h1>
          <p className="text-gray-300">Accedi al tuo account per continuare</p>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Accedi</CardTitle>
            <CardDescription className="text-gray-300">
              Inserisci le tue credenziali per accedere alla dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-900/50 border-red-600 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Inserisci la tua password"
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
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  to="#" 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Password dimenticata?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso in corso...
                  </>
                ) : (
                  'Accedi'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Non hai un account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Registrati ora
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <h3 className="text-white font-medium mb-2">Account Demo</h3>
              <p className="text-gray-300 text-sm mb-2">
                Prova Do-Flow con l'account demo:
              </p>
              <div className="text-sm text-gray-300">
                <p><strong>Email:</strong> admin@do-flow.demo</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full border-slate-600 text-white hover:bg-slate-700"
                onClick={() => {
                  setFormData({
                    email: 'admin@do-flow.demo',
                    password: 'admin123'
                  });
                }}
              >
                Usa credenziali demo
              </Button>
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

export default LoginPage;

