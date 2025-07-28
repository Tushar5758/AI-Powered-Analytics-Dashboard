import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Calendar, Filter, Download, Moon, Sun, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data generation
const generateMockData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lineChartData = months.map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 30000,
    users: Math.floor(Math.random() * 5000) + 2000,
    conversions: Math.floor(Math.random() * 1000) + 500
  }));

  const barChartData = [
    { category: 'Social Media', value: 35000, growth: 12.5 },
    { category: 'Email Marketing', value: 28000, growth: 8.3 },
    { category: 'SEO', value: 42000, growth: 15.7 },
    { category: 'PPC', value: 38000, growth: -2.1 },
    { category: 'Content', value: 25000, growth: 9.8 }
  ];

  const pieChartData = [
    { name: 'Desktop', value: 45, color: '#0d6efd' },
    { name: 'Mobile', value: 35, color: '#198754' },
    { name: 'Tablet', value: 20, color: '#ffc107' }
  ];

  const tableData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    campaign: `Campaign ${index + 1}`,
    clicks: Math.floor(Math.random() * 10000) + 1000,
    impressions: Math.floor(Math.random() * 100000) + 10000,
    ctr: (Math.random() * 5 + 1).toFixed(2),
    cost: Math.floor(Math.random() * 5000) + 500,
    conversions: Math.floor(Math.random() * 100) + 10,
    status: Math.random() > 0.5 ? 'Active' : 'Paused'
  }));

  return { lineChartData, barChartData, pieChartData, tableData };
};

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('clicks');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [data, setData] = useState(generateMockData());
  const [isLoading, setIsLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    frequency: 'weekly',
    email: '',
    time: '09:00',
    day: 'monday'
  });
  const [filters, setFilters] = useState({
    status: 'all',
    minClicks: '',
    maxClicks: '',
    minCost: '',
    maxCost: '',
    minCTR: '',
    maxCTR: ''
  });

  const itemsPerPage = 10;

  // Custom CSS for dark mode and animations
  const customStyles = `
    .dark-mode {
      background-color: #212529 !important;
      color: #ffffff !important;
    }
    
    .dark-mode .navbar {
      background-color: #343a40 !important;
      border-color: #495057 !important;
    }
    
    .dark-mode .card {
      background-color: #343a40 !important;
      border-color: #495057 !important;
      color: #ffffff !important;
    }
    
    .dark-mode .table {
      background-color: #343a40 !important;
      color: #ffffff !important;
    }
    
    .dark-mode .table thead th {
      background-color: #495057 !important;
      border-color: #6c757d !important;
    }
    
    .dark-mode .table td, .dark-mode .table th {
      border-color: #495057 !important;
    }
    
    .dark-mode .form-control, .dark-mode .form-select {
      background-color: #495057 !important;
      border-color: #6c757d !important;
      color: #ffffff !important;
    }
    
    .dark-mode .form-control:focus, .dark-mode .form-select:focus {
      background-color: #495057 !important;
      border-color: #0d6efd !important;
      color: #ffffff !important;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
    
    .dark-mode .btn-outline-secondary {
      color: #ffffff !important;
      border-color: #6c757d !important;
    }
    
    .dark-mode .btn-outline-secondary:hover {
      background-color: #6c757d !important;
      border-color: #6c757d !important;
    }
    
    .metric-card {
      transition: all 0.3s ease;
      border: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .chart-card {
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .chart-card:hover {
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
    
    .gradient-bg-1 {
      background: linear-gradient(135deg, #198754, #20c997);
    }
    
    .gradient-bg-2 {
      background: linear-gradient(135deg, #0d6efd, #6610f2);
    }
    
    .gradient-bg-3 {
      background: linear-gradient(135deg, #6f42c1, #d63384);
    }
    
    .gradient-bg-4 {
      background: linear-gradient(135deg, #fd7e14, #dc3545);
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    .dark-mode .loading-skeleton {
      background: linear-gradient(90deg, #495057 25%, #6c757d 50%, #495057 75%);
      background-size: 200% 100%;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .table-hover tbody tr:hover {
      background-color: rgba(0,0,0,0.05) !important;
    }
    
    .dark-mode .table-hover tbody tr:hover {
      background-color: rgba(255,255,255,0.05) !important;
    }
    
    .btn-icon {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .sortable-header {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
    }
    
    .sortable-header:hover {
      background-color: rgba(0,0,0,0.05) !important;
    }
    
    .dark-mode .sortable-header:hover {
      background-color: rgba(255,255,255,0.05) !important;
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .brand-gradient {
      background: linear-gradient(135deg, #0d6efd, #6610f2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `;

  // Add custom styles to document head
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);
    
    // Add Bootstrap CSS if not already present
    if (!document.querySelector('link[href*="bootstrap"]')) {
      const bootstrapLink = document.createElement('link');
      bootstrapLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';
      bootstrapLink.rel = 'stylesheet';
      document.head.appendChild(bootstrapLink);
    }
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Key metrics calculation
  const totalRevenue = data.lineChartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = data.lineChartData.reduce((sum, item) => sum + item.users, 0);
  const totalConversions = data.lineChartData.reduce((sum, item) => sum + item.conversions, 0);
  const growthRate = 12.5;

  // Table filtering and sorting
  const filteredData = data.tableData
    .filter(item => {
      // Search filter
      const matchesSearch = item.campaign.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status === 'all' || item.status.toLowerCase() === filters.status;
      
      // Numeric filters
      const matchesClicks = (!filters.minClicks || item.clicks >= parseInt(filters.minClicks)) &&
                           (!filters.maxClicks || item.clicks <= parseInt(filters.maxClicks));
      
      const matchesCost = (!filters.minCost || item.cost >= parseInt(filters.minCost)) &&
                         (!filters.maxCost || item.cost <= parseInt(filters.maxCost));
      
      const matchesCTR = (!filters.minCTR || parseFloat(item.ctr) >= parseFloat(filters.minCTR)) &&
                        (!filters.maxCTR || parseFloat(item.ctr) <= parseFloat(filters.maxCTR));
      
      return matchesSearch && matchesStatus && matchesClicks && matchesCost && matchesCTR;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 1000);
  };

  const exportData = (format) => {
    if (format === 'csv') {
      const csv = [
        Object.keys(data.tableData[0]).join(','),
        ...data.tableData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics-data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Create PDF content
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>ADmyBRAND Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .metrics { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .metric { text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .metric h3 { margin: 0; color: #0d6efd; }
            .metric p { margin: 5px 0 0 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
            .status-active { color: #198754; font-weight: bold; }
            .status-paused { color: #ffc107; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ADmyBRAND Analytics Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <h3>${(totalRevenue / 1000000).toFixed(1)}M</h3>
              <p>Total Revenue</p>
            </div>
            <div class="metric">
              <h3>${(totalUsers / 1000).toFixed(1)}K</h3>
              <p>Total Users</p>
            </div>
            <div class="metric">
              <h3>${(totalConversions / 1000).toFixed(1)}K</h3>
              <p>Conversions</p>
            </div>
            <div class="metric">
              <h3>${growthRate}%</h3>
              <p>Growth Rate</p>
            </div>
          </div>
          
          <h2>Campaign Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR (%)</th>
                <th>Cost ($)</th>
                <th>Conversions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(row => `
                <tr>
                  <td>${row.campaign}</td>
                  <td>${row.clicks.toLocaleString()}</td>
                  <td>${row.impressions.toLocaleString()}</td>
                  <td>${row.ctr}%</td>
                  <td>${row.cost.toLocaleString()}</td>
                  <td>${row.conversions}</td>
                  <td class="status-${row.status.toLowerCase()}">${row.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics-report.html';
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('PDF report generated! The HTML file can be opened in a browser and printed as PDF.');
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      alert(`Report scheduled successfully! You will receive ${scheduleForm.frequency} reports at ${scheduleForm.email} every ${scheduleForm.day} at ${scheduleForm.time}.`);
      setShowScheduleModal(false);
      setScheduleForm({
        frequency: 'weekly',
        email: '',
        time: '09:00',
        day: 'monday'
      });
    }, 500);
  };

  const handleFilterApply = () => {
    setCurrentPage(1); // Reset to first page when filters change
    setShowFiltersModal(false);
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      minClicks: '',
      maxClicks: '',
      minCost: '',
      maxCost: '',
      minCTR: '',
      maxCTR: ''
    });
    setCurrentPage(1);
  };

  const MetricCard = ({ title, value, icon: Icon, growth, gradientClass }) => (
    <div className="col-12 col-sm-6 col-lg-3 mb-4 fade-in">
      <div className={`card metric-card h-100`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="card-text text-muted small mb-2">{title}</p>
              <h3 className="card-title mb-2">{value}</h3>
              {growth && (
                <div className={`small d-flex align-items-center ${growth > 0 ? 'text-success' : 'text-danger'}`}>
                  <TrendingUp size={16} className="me-1" />
                  {growth > 0 ? '+' : ''}{growth}%
                </div>
              )}
            </div>
            <div className={`p-3 rounded-circle ${gradientClass}`}>
              <Icon size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = ({ height = "20px", width = "100%" }) => (
    <div 
      className="loading-skeleton rounded" 
      style={{ height, width, minHeight: height }}
    ></div>
  );

  return (
    <div className={`min-vh-100 ${darkMode ? 'dark-mode' : 'bg-light'}`}>
      {/* Header */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark' : 'navbar-light bg-white'} border-bottom`}>
        <div className="container-fluid">
          <h1 className="navbar-brand mb-0 h1 brand-gradient fw-bold">
            ADmyBRAND Insights
          </h1>
          
          <div className="d-flex align-items-center gap-3">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="btn btn-primary btn-sm btn-icon"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-outline-secondary btn-sm"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="container-fluid py-4">
        {/* Key Metrics */}
        <div className="row mb-4">
          <MetricCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            growth={growthRate}
            gradientClass="gradient-bg-1"
          />
          <MetricCard
            title="Total Users"
            value={`${(totalUsers / 1000).toFixed(1)}K`}
            icon={Users}
            growth={8.2}
            gradientClass="gradient-bg-2"
          />
          <MetricCard
            title="Conversions"
            value={`${(totalConversions / 1000).toFixed(1)}K`}
            icon={Target}
            growth={15.3}
            gradientClass="gradient-bg-3"
          />
          <MetricCard
            title="Growth Rate"
            value={`${growthRate}%`}
            icon={TrendingUp}
            growth={2.1}
            gradientClass="gradient-bg-4"
          />
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          {/* Line Chart */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">Revenue Trend</h5>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <LoadingSkeleton height="300px" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#495057' : '#e9ecef'} />
                      <XAxis dataKey="month" stroke={darkMode ? '#adb5bd' : '#6c757d'} />
                      <YAxis stroke={darkMode ? '#adb5bd' : '#6c757d'} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#495057' : '#ffffff',
                          border: darkMode ? '1px solid #6c757d' : '1px solid #dee2e6',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0d6efd" 
                        strokeWidth={3}
                        dot={{ fill: '#0d6efd', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#0d6efd', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">Campaign Performance</h5>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <LoadingSkeleton height="300px" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#495057' : '#e9ecef'} />
                      <XAxis dataKey="category" stroke={darkMode ? '#adb5bd' : '#6c757d'} />
                      <YAxis stroke={darkMode ? '#adb5bd' : '#6c757d'} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#495057' : '#ffffff',
                          border: darkMode ? '1px solid #6c757d' : '1px solid #dee2e6',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#0d6efd"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          {/* Pie Chart */}
          <div className="col-12 col-lg-4 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">Device Distribution</h5>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <LoadingSkeleton height="200px" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={data.pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {data.pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-12 col-lg-8 mb-4">
            <div className="card chart-card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <button
                      onClick={() => exportData('csv')}
                      className="btn btn-success w-100 btn-icon"
                    >
                      <Download size={18} />
                      Export CSV
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button
                      onClick={() => exportData('pdf')}
                      className="btn btn-danger w-100 btn-icon"
                    >
                      <Download size={18} />
                      Export PDF
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button className="btn btn-primary w-100 btn-icon" onClick={() => setShowScheduleModal(true)}>
                      <Calendar size={18} />
                      Schedule Report
                    </button>
                  </div>
                  <div className="col-6 col-md-3">
                    <button className="btn btn-secondary w-100 btn-icon" onClick={() => setShowFiltersModal(true)}>
                      <Filter size={18} />
                      Advanced Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Report Modal */}
        {showScheduleModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content ${darkMode ? 'bg-dark text-white' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Schedule Report</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowScheduleModal(false)}
                    style={{ filter: darkMode ? 'invert(1)' : 'none' }}
                  ></button>
                </div>
                <form onSubmit={handleScheduleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={scheduleForm.email}
                        onChange={(e) => setScheduleForm({...scheduleForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="frequency" className="form-label">Frequency</label>
                      <select
                        className="form-select"
                        id="frequency"
                        value={scheduleForm.frequency}
                        onChange={(e) => setScheduleForm({...scheduleForm, frequency: e.target.value})}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    {scheduleForm.frequency === 'weekly' && (
                      <div className="mb-3">
                        <label htmlFor="day" className="form-label">Day of Week</label>
                        <select
                          className="form-select"
                          id="day"
                          value={scheduleForm.day}
                          onChange={(e) => setScheduleForm({...scheduleForm, day: e.target.value})}
                        >
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                          <option value="saturday">Saturday</option>
                          <option value="sunday">Sunday</option>
                        </select>
                      </div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="time" className="form-label">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        id="time"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowScheduleModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Schedule Report</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters Modal */}
        {showFiltersModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className={`modal-content ${darkMode ? 'bg-dark text-white' : ''}`}>
                <div className="modal-header">
                  <h5 className="modal-title">Advanced Filters</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowFiltersModal(false)}
                    style={{ filter: darkMode ? 'invert(1)' : 'none' }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="statusFilter" className="form-label">Campaign Status</label>
                      <select
                        className="form-select"
                        id="statusFilter"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="paused">Paused Only</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Clicks Range</label>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Min clicks"
                            value={filters.minClicks}
                            onChange={(e) => setFilters({...filters, minClicks: e.target.value})}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Max clicks"
                            value={filters.maxClicks}
                            onChange={(e) => setFilters({...filters, maxClicks: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Cost Range ($)</label>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Min cost"
                            value={filters.minCost}
                            onChange={(e) => setFilters({...filters, minCost: e.target.value})}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Max cost"
                            value={filters.maxCost}
                            onChange={(e) => setFilters({...filters, maxCost: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CTR Range (%)</label>
                      <div className="row">
                        <div className="col-6">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            placeholder="Min CTR"
                            value={filters.minCTR}
                            onChange={(e) => setFilters({...filters, minCTR: e.target.value})}
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            step="0.1"
                            className="form-control"
                            placeholder="Max CTR"
                            value={filters.maxCTR}
                            onChange={(e) => setFilters({...filters, maxCTR: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-light rounded" style={{ backgroundColor: darkMode ? '#495057 !important' : undefined }}>
                    <small className="d-block mb-2"><strong>Active Filters:</strong></small>
                    <div className="d-flex flex-wrap gap-2">
                      {filters.status !== 'all' && (
                        <span className="badge bg-primary">Status: {filters.status}</span>
                      )}
                      {(filters.minClicks || filters.maxClicks) && (
                        <span className="badge bg-info">
                          Clicks: {filters.minClicks || '0'} - {filters.maxClicks || '∞'}
                        </span>
                      )}
                      {(filters.minCost || filters.maxCost) && (
                        <span className="badge bg-success">
                          Cost: ${filters.minCost || '0'} - ${filters.maxCost || '∞'}
                        </span>
                      )}
                      {(filters.minCTR || filters.maxCTR) && (
                        <span className="badge bg-warning text-dark">
                          CTR: {filters.minCTR || '0'}% - {filters.maxCTR || '∞'}%
                        </span>
                      )}
                      {Object.values(filters).every(val => !val || val === 'all') && (
                        <span className="text-muted">No filters applied</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
                    Clear All
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowFiltersModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleFilterApply}>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="card chart-card">
          <div className="card-header">
            <div className="row align-items-center">
              <div className="col-12 col-md-6">
                <h5 className="card-title mb-0">Campaign Data</h5>
              </div>
              <div className="col-12 col-md-6 mt-3 mt-md-0">
                <div className="position-relative">
                  <Search 
                    size={18} 
                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control ps-5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className={darkMode ? 'table-dark' : 'table-light'}>
                  <tr>
                    {[
                      { label: 'Campaign', field: 'campaign' },
                      { label: 'Clicks', field: 'clicks' },
                      { label: 'Impressions', field: 'impressions' },
                      { label: 'CTR (%)', field: 'ctr' },
                      { label: 'Cost ($)', field: 'cost' },
                      { label: 'Conversions', field: 'conversions' },
                      { label: 'Status', field: 'status' }
                    ].map(({ label, field }) => (
                      <th
                        key={field}
                        className="sortable-header"
                        onClick={() => handleSort(field)}
                      >
                        <div className="d-flex align-items-center">
                          <span>{label}</span>
                          {sortField === field && (
                            <span className="text-primary ms-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 7 }).map((_, cellIndex) => (
                          <td key={cellIndex}>
                            <LoadingSkeleton height="20px" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    paginatedData.map((row) => (
                      <tr key={row.id}>
                        <td><strong>{row.campaign}</strong></td>
                        <td>{row.clicks.toLocaleString()}</td>
                        <td>{row.impressions.toLocaleString()}</td>
                        <td>{row.ctr}%</td>
                        <td>${row.cost.toLocaleString()}</td>
                        <td>{row.conversions}</td>
                        <td>
                          <span className={`badge ${
                            row.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="card-footer">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <small className="text-muted">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
                </small>
              </div>
              <div className="col-12 col-md-6">
                <nav aria-label="Table pagination">
                  <ul className="pagination pagination-sm justify-content-end mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    <li className="page-item">
                      <span className="page-link">
                        Page {currentPage} of {totalPages}
                      </span>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;