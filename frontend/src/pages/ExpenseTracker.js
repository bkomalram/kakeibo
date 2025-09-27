import React, { useState, useRef, useEffect, useContext } from 'react';
import { PlusCircle, Upload, Trash2, Eye, BarChart3, PieChart, Calendar, DollarSign, TrendingUp, TrendingDown, FileText, Camera, Search, LogOut} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { AuthContext } from '../context/AuthenticateContext';
import { useNavigate } from 'react-router-dom';


const ExpenseTracker = () => {
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
  
  
  const [expenses, setExpenses] = useState([]);
  const [categories] = useState([
    'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 
    'Hogar', 'Ropa', 'Tecnología', 'Servicios', 'Otros'
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Alimentación',
    date: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  // Colores para gráficos
  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb', '#deb887', '#f0e68c'];

  // Redirigir no está autenticado
    useEffect(() => {
      if (!isAuthenticated) {
          navigate('/'); // Ajusta la ruta según tu configuración
      }
      }, [isAuthenticated, navigate]);
  // Cargar gastos desde la API al montar el componente
  useEffect(() => {
    const fetchExpenses = async () => {
      const user_id = currentUser ? currentUser.id : null;
      try {
        // Cambia la URL por la de tu API
        const response = await fetch(`/api/expenses/${user_id}`);
        if (!response.ok) throw new Error('Error al obtener los gastos');
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        alert('No se pudieron cargar los gastos');
      }
    };
    fetchExpenses();
  }, []);


  // Manejar cierre de sesión
  // Manejar logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser({ email: '', name: '' });
  };

  // Función para procesar imagen de factura (simulada)
  const processReceiptImage = async (file) => {
    // Crea un FormData para enviar la imagen al backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Cambia la URL por la de tu backend que conecta con Document AI
      const response = await fetch('/api/process-receipt', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Error procesando la imagen');

      // El backend debe retornar un objeto con los datos extraídos
      const data = await response.json();

      // Ejemplo de respuesta esperada:
      // { description: 'Supermercado XYZ', amount: '123.45', date: '2025-09-25' }
      return data;
    } catch (error) {
      console.error('Error en processReceiptImage:', error);
      throw error;
    }
  };

  // Manejar carga de archivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const processedData = await processReceiptImage(file);
        setNewExpense({
          ...newExpense,
          ...processedData,
          date: new Date().toISOString().split('T')[0]
        });
        setActiveTab('add');
      } catch (error) {
        alert('Error procesando la factura. Intenta de nuevo.');
      }
    }
  };

  // Agregar gasto
  const addExpense = async () => {
    if (newExpense.description && newExpense.amount) {
      const expense = {
        id: Date.now(),
        user_id: currentUser.id,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        createdAt: new Date().toISOString()
      };

      try {
        // Cambia la URL por la de tu API
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(expense)
        });
        if (!response.ok) throw new Error('Error al guardar el gasto');
        const savedExpense = await response.json();
        setExpenses([savedExpense, ...expenses]);
        setNewExpense({
          description: '',
          amount: '',
          category: 'Alimentación',
          date: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        alert('No se pudo guardar el gasto en la base de datos');
      }

      
    }
  };

  // Eliminar gasto
  const deleteExpense = async (id) => {
    const user_id = currentUser.id; // Simulando usuario logueado
    try {
        // Cambia la URL por la de tu API
        const response = await fetch(`/api/expenses/${user_id}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Error al eliminar el gasto');
        const deleteResponse = await response.json();
        setExpenses(expenses.filter(exp => exp.id !== deleteResponse.id));
      } catch (error) {
        alert('No se pudo eliminar el gasto en la base de datos');
      }
  };

  // Filtrar gastos
  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  // Datos para gráficos
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { name: category, value: total, count: categoryExpenses.length };
  }).filter(item => item.value > 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayExpenses = expenses.filter(exp => new Date(exp.date).toISOString().split('T')[0]=== dateStr);
    const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      date: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      amount: total
    };
  }).reverse();

  console.log('last7Days:', last7Days);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">Control de Gastos</h1>
                      <p className="text-gray-600">Gestiona tus finanzas y procesa facturas automáticamente</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Bienvenido,</p>
                        <p className="font-semibold text-gray-800">{currentUser ? currentUser.name : 'Invitado'}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Salir</span>
                      </button>
                    </div>
                  </div>
                </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <nav className="flex space-x-0">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'add', label: 'Agregar Gasto', icon: PlusCircle },
              { id: 'list', label: 'Lista de Gastos', icon: FileText },
              { id: 'upload', label: 'Procesar Factura', icon: Upload }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-blue-500 text-white rounded-lg'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Gastado</p>
                      <p className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
                    </div>
                    <DollarSign className="text-blue-500" size={32} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Promedio por Gasto</p>
                      <p className="text-2xl font-bold text-gray-800">${averageExpense.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="text-green-500" size={32} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Gastos</p>
                      <p className="text-2xl font-bold text-gray-800">{expenses.length}</p>
                    </div>
                    <FileText className="text-purple-500" size={32} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Categorías Activas</p>
                      <p className="text-2xl font-bold text-gray-800">{categoryData.length}</p>
                    </div>
                    <PieChart className="text-orange-500" size={32} />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gastos por día */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Gastos Últimos 7 Días</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={last7Days}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']} />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Gastos por categoría */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Gastos por Categoría</h3>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({name, value}) => `${name}: $${value.toFixed(2)}`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500 text-center">No hay datos para mostrar</p>
                  )}
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Categorías con Mayor Gasto</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Add Expense */}
          {activeTab === 'add' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Agregar Nuevo Gasto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Almuerzo en restaurante"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={addExpense}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <PlusCircle size={20} />
                <span>Agregar Gasto</span>
              </button>
            </div>
          )}

          {/* Expense List */}
          {activeTab === 'list' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Lista de Gastos</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar gastos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {filteredExpenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay gastos registrados</p>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{expense.description}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">{expense.category}</span>
                              <span className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-800">${expense.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Receipt */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Procesar Factura</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Camera className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg text-gray-600 mb-4">
                  Sube una foto de tu factura para procesarla automáticamente
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Upload size={20} />
                  <span>Seleccionar Imagen</span>
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Formatos soportados: JPG, PNG, HEIC
                </p>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>1. Toma una foto clara de tu factura</li>
                  <li>2. La aplicación extraerá automáticamente los datos</li>
                  <li>3. Revisa y confirma la información</li>
                  <li>4. El gasto se agregará a tu registro</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;