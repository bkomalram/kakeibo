import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, Trash2, Eye, BarChart3, PieChart, Calendar, DollarSign, TrendingUp, TrendingDown, FileText, Camera, Search, LogIn, UserPlus, LogOut, User, Lock, Mail } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';
import { AuthContext } from '../context/AuthenticateContext';

const Authenticate = () => { 
  //navegacion
  const navigate = useNavigate();
  // Estados de autenticación
  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [authErrors, setAuthErrors] = useState({});

  // Usuarios simulados para demo
  const [users] = useState([
    { id: 1, email: 'demo@email.com', password: '123456', name: 'Usuario Demo' },
    { id: 2, email: 'test@email.com', password: 'password', name: 'Test User' }
  ]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
        navigate('/expense-tracker'); // Ajusta la ruta según tu configuración
    }
    }, [isAuthenticated, navigate]);

  // Colores para gráficos
  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb', '#deb887', '#f0e68c'];

  // Validar email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Manejar cambios en formulario de auth
  const handleAuthChange = (field, value) => {
    setAuthForm(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (authErrors[field]) {
      setAuthErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validar formulario de login
  const validateLogin = () => {
    const errors = {};
    
    if (!authForm.email) {
      errors.email = 'Email es requerido';
    } else if (!isValidEmail(authForm.email)) {
      errors.email = 'Email no válido';
    }
    
    if (!authForm.password) {
      errors.password = 'Contraseña es requerida';
    }
    
    return errors;
  };

  // Validar formulario de registro
  const validateRegister = () => {
    const errors = {};
    
    if (!authForm.name) {
      errors.name = 'Nombre es requerido';
    }
    
    if (!authForm.email) {
      errors.email = 'Email es requerido';
    } else if (!isValidEmail(authForm.email)) {
      errors.email = 'Email no válido';
    }
    
    if (!authForm.password) {
      errors.password = 'Contraseña es requerida';
    } else if (authForm.password.length < 1) {
      errors.password = 'Contraseña debe tener al menos 6 caracteres';
    }
    
    if (!authForm.confirmPassword) {
      errors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (authForm.password !== authForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return errors;
  };

  // Manejar login
  const handleLogin = async () => {
    const errors = validateLogin();
    
    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }
    
    try {
        const loginUser = {
            email: authForm.email,
            password: authForm.password
        };
        // Cambia la URL por la de tu API
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginUser)
        });
        if (!response.ok) throw new Error('Error al iniciar sesión');
        const LogIn = await response.json();
        if (LogIn && !LogIn.message) {
            setCurrentUser(LogIn);
            setIsAuthenticated(true);
            setAuthForm({ email: '', password: '', confirmPassword: '', name: '' });
            setAuthErrors({});
        } else {
            setAuthErrors({ general: 'Email o contraseña incorrectos' });
        }
      } catch (error) {
        alert('Error al iniciar sesión');
      }
  };

  // Manejar registro
  const handleRegister = async () => {
    const errors = validateRegister();
    
    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }
    
    // Crear nuevo usuario (en app real se enviaría al servidor)
    const newUser = {
      id: Date.now(),
      email: authForm.email,
      password: authForm.password,
      name: authForm.name,
      role: 'OPERADOR' // Rol por defecto
    };
    
    try {
        // Cambia la URL por la de tu API
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });
        if (!response.ok) throw new Error('Error al crear el usuario');
        const savedUser = await response.json();
        setAuthForm({ email: '', password: '', confirmPassword: '', name: '' });
        setAuthErrors({});
        setAuthMode('login');
        alert('Usuario registrado exitosamente. Por favor, inicia sesión.');
      } catch (error) {
        alert('No se pudo guardar el usuario en la base de datos');
      }
  };

  // Manejar logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({ email: '', name: '' });
  };

  // Cambiar modo de autenticación
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthForm({ email: '', password: '', confirmPassword: '', name: '' });
    setAuthErrors({});
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Control de Gastos</h1>
            <p className="text-gray-600 mt-2">
              {authMode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
            </p>
          </div>

          {/* Error general */}
          {authErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {authErrors.general}
            </div>
          )}

          {/* Formulario */}
          <form className="space-y-6">
            {/* Campo Nombre (solo en registro) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => handleAuthChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      authErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {authErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{authErrors.name}</p>
                )}
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => handleAuthChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    authErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {authErrors.email && (
                <p className="text-red-500 text-sm mt-1">{authErrors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    authErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {authErrors.password && (
                <p className="text-red-500 text-sm mt-1">{authErrors.password}</p>
              )}
            </div>

            {/* Campo Confirmar Contraseña (solo en registro) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={authForm.confirmPassword}
                    onChange={(e) => handleAuthChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      authErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {authErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{authErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Botón de acción */}
            <button
              type="button"
              onClick={authMode === 'login' ? handleLogin : handleRegister}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              {authMode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
              <span>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
            </button>
          </form>

          {/* Cambiar modo */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={toggleAuthMode}
                className="ml-2 text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                {authMode === 'login' ? 'Regístrate' : 'Inicia Sesión'}
              </button>
            </p>
          </div>

          {/* Datos de demo */}
          {authMode === 'login' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Datos de demo:</p>
              <p className="text-xs text-gray-500">Email: demo@email.com</p>
              <p className="text-xs text-gray-500">Contraseña: 123456</p>
            </div>
          )}
        </div>
      </div>
    );
};

export default Authenticate;