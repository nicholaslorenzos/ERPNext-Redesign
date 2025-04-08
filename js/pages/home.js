// home.js
let timeRange = 'month';
let activeCategory = 'accounting';
let expandedCategory = null;
let username = 'Admin';
let taskCompleted = [false, false, false];

const categoriesData = [
  { title: 'Accounting', icon: 'FileText', items: ['Chart of Accounts', 'Company', 'Customer', 'Supplier'] },
  { title: 'Stock', icon: 'Package', items: ['Item', 'Warehouse', 'Brand', 'Unit of Measure (UOM)', 'Stock Reconciliation'] },
  { title: 'CRM', icon: 'Users', items: ['Lead', 'Customer Group', 'Territory'] },
  { title: 'Data Import and Settings', icon: 'Settings', items: ['Import Data', 'Opening Invoice Creation Tool', 'Chart of Accounts Importer', 'Letter Head', 'Email Account'] }
];

const frequentlyUsedItems = [
  { name: 'Chart of Accounts', icon: 'FileText', category: 'Accounting' },
  { name: 'Warehouse', icon: 'Package', category: 'Stock' },
  { name: 'Import Data', icon: 'Download', category: 'Data Import' },
  { name: 'Customer Group', icon: 'Users', category: 'CRM' },
  { name: 'Stock Reconciliation', icon: 'RefreshCw', category: 'Stock' },
  { name: 'Letter Head', icon: 'Mail', category: 'Settings' },
  { name: 'Company', icon: 'Building', category: 'Accounting' },
  { name: 'Lead', icon: 'Heart', category: 'CRM' },
  { name: 'Supplier', icon: 'Truck', category: 'Accounting' },
  { name: 'Item', icon: 'Package', category: 'Stock' },
  { name: 'Territory', icon: 'Map', category: 'CRM' },
  { name: 'Email Account', icon: 'Mail', category: 'Settings' }
];

function scrollToSectionWithOffset(elementId, offsetY = -80) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset + offsetY;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}

function renderQuickAction(icon, label) {
  return `
    <button class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100">
      <div class="flex flex-col items-center">
        <div class="bg-indigo-700 p-3 rounded-xl mb-3 text-white group-hover:bg-indigo-800 transition-colors shadow-md">
          <span>${getIconSvg(icon)}</span>
        </div>
        <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">${label}</span>
      </div>
    </button>
  `;
}

function renderStatCard(icon, label, value, trend, percentage, subtext) {
  const trendColor = trend === 'up' ? 'emerald' : 'rose'; // Matches original
  return `
    <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
      <div class="flex items-center justify-between mb-4">
        <div class="bg-indigo-700 p-3 rounded-xl text-white group-hover:bg-indigo-800 transition-colors shadow-md">
          <span>${getIconSvg(icon)}</span>
        </div>
        ${trend ? `
          <span class="flex items-center text-sm font-medium px-3 py-1 rounded-full bg-${trendColor}-50 text-${trendColor}-600 border border-${trendColor}-200">
            <span class="text-${trendColor}-600 mr-1">${getIconSvg(trend === 'up' ? 'ArrowUp' : 'ArrowDown', "w-4 h-4")}</span>
            ${percentage}
          </span>
        ` : ''}
      </div>
      <div>
        <p class="text-gray-600 text-sm font-medium">${label}</p>
        <h3 class="text-2xl font-bold text-gray-900 mt-2 group-hover:text-indigo-700 transition-colors">${value}</h3>
        ${subtext ? `<p class="text-sm text-gray-500 mt-2">${subtext}</p>` : ''}
      </div>
    </div>
  `;
}

function renderActivityItem(icon, title, description, time, color = "indigo") {
  const colorStyles = {
    'success': { bg: '#dcfce7', border: '#bbf7d0', text: '#059669', hover: '#059669' },
    'info': { bg: '#dbeafe', border: '#bfdbfe', text: '#2563eb', hover: '#2563eb' },
    'warning': { bg: '#fef3c7', border: '#fde68a', text: '#d97706', hover: '#d97706' },
    'danger': { bg: '#fee2e2', border: '#fecaca', text: '#e11d48', hover: '#e11d48' },
    'primary': { bg: '#e0e7ff', border: '#c7d2fe', text: '#4f46e5', hover: '#4f46e5' },
    'emerald': { bg: '#dcfce7', border: '#bbf7d0', text: '#059669', hover: '#059669' },
    'indigo': { bg: '#e0e7ff', border: '#c7d2fe', text: '#4f46e5', hover: '#4f46e5' },
    'amber': { bg: '#fef3c7', border: '#fde68a', text: '#d97706', hover: '#d97706' },
    'rose': { bg: '#fee2e2', border: '#fecaca', text: '#e11d48', hover: '#e11d48' },
    'blue': { bg: '#dbeafe', border: '#bfdbfe', text: '#2563eb', hover: '#2563eb' }
  };
  const styleSet = colorStyles[color] || colorStyles.indigo;
  return `
    <div class="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-200">
      <div class="p-2.5 rounded-lg shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors" 
           style="background-color: ${styleSet.bg}; border: 1px solid ${styleSet.border};">
        <span style="color: ${styleSet.text};" class="group-hover:text-${styleSet.hover} transition-colors">${getIconSvg(icon, "w-5 h-5")}</span>
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-800 transition-colors">${title}</p>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${time}</span>
        </div>
        <p class="text-sm text-gray-500 mt-1">${description}</p>
      </div>
      <span class="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">${getIconSvg("ChevronRight", "w-4 h-4")}</span>
    </div>
  `;
}

function renderCategoryItem(icon, name, isActive) {
  return `
    <button
      data-category="${name.toLowerCase()}"
      class="category-item flex items-center justify-between w-full p-3 rounded-xl text-left transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-700 text-white shadow-lg' 
          : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-100 shadow-sm hover:shadow-md'
      }"
    >
      <div class="flex items-center gap-3">
        <span class="${isActive ? 'text-amber-300' : 'text-indigo-700'}">${getIconSvg(icon, "w-5 h-5")}</span>
        <span class="font-medium">${name}</span>
      </div>
      <span class="${isActive ? 'text-amber-300' : 'text-gray-400'}">${getIconSvg("ChevronRight", "w-4 h-4")}</span>
    </button>
  `;
}

function renderModuleItem(name) {
  return `
    <div class="flex items-center p-4 bg-white border border-gray-100 hover:border-indigo-200 rounded-xl transition-all shadow-sm hover:shadow-md group cursor-pointer">
      <div class="w-2 h-2 rounded-full bg-indigo-700 mr-3 group-hover:bg-amber-400 transition-colors"></div>
      <span class="text-gray-700 group-hover:text-indigo-700 font-medium">${name}</span>
      <span class="text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">${getIconSvg("ChevronRight", "w-4 h-4")}</span>
    </div>
  `;
}

function renderQuickAccessItem(icon, name, category) {
  return `
    <div class="p-4 bg-white border border-gray-100 hover:border-indigo-300 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div class="bg-indigo-50 text-indigo-700 p-3 rounded-xl mx-auto w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-indigo-700 group-hover:text-white transition-all">
        <span>${getIconSvg(icon, "w-5 h-5")}</span>
      </div>
      <div class="text-center">
        <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-700 block">${name}</span>
        <span class="text-xs text-gray-500 flex items-center justify-center mt-1">
          <span class="text-amber-400 mr-1">${getIconSvg("Tag", "w-3 h-3")}</span> ${category}
        </span>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const dashboardContent = document.getElementById('dashboard-content');
  if (!dashboardContent) return;

  const activeCategoryData = categoriesData.find(cat => cat.title.toLowerCase() === activeCategory);

  let dashboardHTML = `
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center">
        Home
        <span class="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
          MODULE
        </span>
      </h1>
    </div>

    <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-6 shadow-lg mb-8 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-amber-300 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-4">
          <div class="bg-white/15 p-2 rounded-xl backdrop-blur-sm">
            <span class="text-amber-300">${getIconSvg("Zap", "w-6 h-6")}</span>
          </div>
          <h1 class="text-white text-2xl font-bold">Hello, ${username}!</h1>
        </div>
        <p class="text-indigo-200 text-lg mb-6">Here's what's happening with your business today.</p>
        <div class="flex gap-3">
          <button class="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors shadow-md"
                  onclick="scrollToSectionWithOffset('stats-section', -80)">
            View Reports
          </button>
          <button class="bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors border border-indigo-600 shadow-md"
                  onclick="scrollToSectionWithOffset('quick-actions-section', 60)">
            Quick Actions
          </button>
        </div>
      </div>
    </div>

    <div id="quick-actions-section" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      ${renderQuickAction('Plus', 'New Order')}
      ${renderQuickAction('Users', 'Add Customer')}
      ${renderQuickAction('Package', 'Add Product')}
      ${renderQuickAction('FileText', 'Create Invoice')}
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-300 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-amber-300 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
              <span class="text-amber-300">${getIconSvg("Layers", "w-6 h-6")}</span>
              Reports & Masters
            </h2>
            <p class="text-indigo-200 mt-1">Access your company's core modules and reports</p>
          </div>
          <div class="relative w-64">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-indigo-300">${getIconSvg("Search", "w-4 h-4")}</span>
            </div>
            <input
              id="module-search"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-indigo-600 bg-indigo-700 bg-opacity-50 rounded-lg text-indigo-100 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Search modules..."
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row min-h-[400px]">
        <div class="w-full md:w-1/4 bg-indigo-50 p-4 border-r border-gray-100">
          <h3 class="font-medium text-indigo-700 mb-3 text-sm uppercase tracking-wider">Categories</h3>
          <div class="space-y-2">
            ${categoriesData.map(category => 
              renderCategoryItem(category.icon, category.title, activeCategory === category.title.toLowerCase())
            ).join('')}
          </div>
        </div>
        <div class="w-full md:w-3/4 p-6 bg-white">
          ${!activeCategoryData ? `
            <div class="text-center py-8 text-gray-500">
              <span class="text-indigo-200 mx-auto mb-3 block">${getIconSvg("Layers", "w-12 h-12")}</span>
              <p>Please select a category to view items</p>
            </div>
          ` : `
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-indigo-700">${getIconSvg(activeCategoryData.icon, "w-6 h-6")}</span>
                <h3 class="text-xl font-bold text-gray-800">${activeCategoryData.title}</h3>
              </div>
              <div class="h-1 w-20 bg-amber-400 rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${activeCategoryData.items.map(item => renderModuleItem(item)).join('')}
            </div>
          `}
        </div>
      </div>
      <div class="border-t border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-1">Quick Access</h3>
            <div class="h-1 w-12 bg-amber-400 rounded-full"></div>
          </div>
          <button class="text-sm text-indigo-700 hover:text-indigo-800 font-medium flex items-center px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all">
            Customize <span class="ml-2">${getIconSvg("Settings", "w-4 h-4")}</span>
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          ${frequentlyUsedItems.slice(0, 12).map(item => renderQuickAccessItem(item.icon, item.name, item.category)).join('')}
        </div>
      </div>
    </div>

    <div id="stats-section" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${renderStatCard('DollarSign', 'Total Revenue', '$54,375', 'up', '12.5%', 'Compared to $48,500 last month')}
      ${renderStatCard('Users', 'Active Customers', '1,437', 'up', '8.2%', '47 new customers this month')}
      ${renderStatCard('ShoppingCart', 'Total Orders', '486', 'down', '3.1%', '12 orders pending')}
      ${renderStatCard('Package', 'Inventory Items', '1,072', 'up', '5.3%', '154 items low in stock')}
    </div>

    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8 overflow-hidden">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="bg-gradient-to-br from-indigo-700 to-indigo-800 p-3 rounded-xl shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center">
            <span class="text-white">${getIconSvg("Activity", "w-5 h-5")}</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">Business Analytics</h3>
            <p class="text-sm text-gray-500 mt-1">Revenue performance overview</p>
          </div>
        </div>
        <div class="bg-gray-50 p-1 rounded-full border border-gray-200">
          ${['day', 'week', 'month'].map(range => `
            <button
              class="time-range-button px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                timeRange === range
                  ? 'bg-white text-indigo-700 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }"
              data-range="${range}"
            >
              ${range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="chart-container rounded-xl overflow-hidden bg-white h-full">
            <div class="flex flex-col h-full">
              <div class="p-4 pb-0">
                <h4 class="font-medium text-gray-700 flex items-center gap-2">
                  <span class="w-2 h-8 bg-indigo-700 rounded-full"></span>
                  Revenue Trends
                </h4>
              </div>
              <div class="p-4 flex-grow" id="revenue-chart" style="min-height: 40rem; height: 100%;">
                <p class="text-gray-500 text-center">Chart placeholder (requires charts.js)</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-gray-800 font-semibold flex items-center gap-2">
                <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-2.5 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center">
                  <span class="text-indigo-700">${getIconSvg("BarChart2", "w-4 h-4")}</span>
                </div>
                <span>Performance Metrics</span>
              </h4>
              <button class="text-sm text-indigo-700 hover:text-indigo-800 font-medium px-3 py-1.5 bg-white rounded-lg hover:bg-indigo-50 transition-all border border-indigo-100 shadow-sm">
                View Report
              </button>
            </div>
            <div class="space-y-4">
              ${[
                { icon: 'CircleDollarSign', label: 'Revenue', value: '$461,000', trend: '+12.5%', width: '75%', color: 'indigo', positive: true },
                { icon: 'ShoppingCart', label: 'Orders', value: '910', trend: '+8.2%', width: '65%', color: 'indigo', positive: true },
                { icon: 'TrendingUp', label: 'Avg. Order Value', value: '$506.59', trend: '-2.3%', width: '85%', color: 'indigo', positive: false }
              ].map(metric => `
                <div class="group hover:bg-white hover:shadow-sm p-3 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <div class="flex items-center gap-2">
                        <div class="p-2 rounded-lg bg-${metric.color}-50 group-hover:bg-${metric.color}-100 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                          <span class="text-${metric.color}-700">${getIconSvg(metric.icon, "w-4 h-4")}</span>
                        </div>
                        <span class="text-sm font-medium text-gray-700">${metric.label}</span>
                      </div>
                      <span class="text-xl font-bold text-gray-900 mt-2 block">${metric.value}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-sm ${metric.positive ? 'text-emerald-600' : 'text-rose-600'} flex items-center gap-1 justify-end">
                        <span>${getIconSvg(metric.positive ? "ArrowUp" : "ArrowDown", "w-4 h-4")}</span>
                        ${metric.trend}
                      </span>
                      <span class="text-xs text-gray-500 block">vs last month</span>
                    </div>
                  </div>
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                    <div class="h-full bg-${metric.color}-700 rounded-full transform transition-all duration-500 group-hover:translate-x-1" style="width: ${metric.width}"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="mt-6 pt-6 border-t border-gray-100">
            <button class="w-full py-2.5 px-4 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow">
              Update Metrics
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("Bell", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Recent Activity</h3>
          </div>
          <button class="text-indigo-700 text-sm font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 border border-indigo-100">
            View All
          </button>
        </div>
        <div class="space-y-1">
          ${renderActivityItem('CheckCircle', 'New order received', 'Order #1234 from John Doe - $2,340', '2m ago', 'success')}
          ${renderActivityItem('Bell', 'Payment received', '$2,500 received from Invoice #5678', '15m ago', 'primary')}
          ${renderActivityItem('AlertCircle', 'Low stock alert', '5 products are running low on inventory', '1h ago', 'warning')}
          ${renderActivityItem('Clock', 'New customer registered', 'Jane Smith created an account', '2h ago', 'info')}
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("Calendar", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Tasks & Reminders</h3>
          </div>
          <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <span class="text-gray-500">${getIconSvg("Settings", "w-4 h-4")}</span>
          </button>
        </div>
        <div class="space-y-4">
          ${[
            { task: "Review inventory report", due: "2 hours", priority: "Priority", priorityColor: "rose", index: 0 },
            { task: "Follow up with suppliers", due: "tomorrow", priority: "Regular", priorityColor: "blue", index: 1 },
            { task: "Update pricing strategy", due: "3 days", priority: "Planning", priorityColor: "emerald", index: 2 }
          ].map(item => `
            <div class="p-4 border border-gray-200 hover:border-indigo-300 rounded-xl transition-colors cursor-pointer group hover:shadow-sm">
              <div class="flex items-center mb-2">
                <div class="task-checkbox cursor-pointer w-5 h-5 rounded border-2 border-indigo-300 mr-3 flex-shrink-0 flex items-center justify-center ${taskCompleted[item.index] ? 'bg-indigo-700 border-indigo-700' : ''}" data-index="${item.index}">
                  ${taskCompleted[item.index] ? `<span class="text-white">${getIconSvg("Check", "w-3 h-3")}</span>` : ''}
                </div>
                <h4 class="text-sm font-medium text-gray-800 group-hover:text-indigo-700 ${taskCompleted[item.index] ? 'line-through text-gray-400' : ''}">${item.task}</h4>
              </div>
              <div class="flex items-center justify-between ml-8">
                <span class="text-xs text-gray-500">Due in ${item.due}</span>
                <span class="px-2 py-1 text-xs bg-${item.priorityColor}-50 text-${item.priorityColor}-600 rounded-full border border-${item.priorityColor}-200">
                  ${item.priority}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="w-full mt-4 py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-200">
          + Add New Task
        </button>
      </div>
    </div>
  `;

  dashboardContent.innerHTML = dashboardHTML;

  // Add event listener to the Add Product button
  const addProductButton = document.querySelector('#quick-actions-section button:nth-child(3)'); // Targets the 3rd button (Add Product)
  if (addProductButton) {
    addProductButton.addEventListener('click', () => {
      if (window.openAddProductModal) {
        window.openAddProductModal(); // Call the modal function from add-product.js
      } else {
        console.error('Add Product modal functionality not loaded.');
      }
    });
  }

  document.querySelectorAll('.category-item').forEach(button => {
    button.addEventListener('click', (e) => {
      activeCategory = e.currentTarget.dataset.category;
      renderDashboard();
    });
  });

  document.querySelectorAll('.time-range-button').forEach(button => {
    button.addEventListener('click', function() {
      timeRange = this.getAttribute('data-range');
      document.querySelectorAll('.time-range-button').forEach(btn => {
        btn.classList.remove('bg-white', 'text-indigo-700', 'shadow-sm', 'border', 'border-gray-200');
        btn.classList.add('text-gray-600', 'hover:text-gray-900');
      });
      this.classList.remove('text-gray-600', 'hover:text-gray-900');
      this.classList.add('bg-white', 'text-indigo-700', 'shadow-sm', 'border', 'border-gray-200');
      try {
        if (typeof Recharts !== 'undefined' && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
          initializeChart(timeRange);
        } else {
          renderSimpleChart(timeRange);
        }
      } catch (error) {
        console.error('Error updating chart:', error);
        renderSimpleChart(timeRange);
      }
    });
  });

  const moduleSearch = document.getElementById('module-search');
  if (moduleSearch) {
    moduleSearch.addEventListener('focus', () => {
      moduleSearch.style.outline = 'none';
      moduleSearch.style.boxShadow = '0 0 0 2px #fbbf24'; // amber-400
      moduleSearch.style.borderColor = 'transparent';
    });
    moduleSearch.addEventListener('blur', () => {
      moduleSearch.style.boxShadow = 'none';
      moduleSearch.style.borderColor = '';
    });
  }

  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(checkbox.dataset.index);
      taskCompleted[index] = !taskCompleted[index];
      renderDashboard();
    });
  });

  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    const taskBox = checkbox.closest('.p-4');
    if (taskBox) {
      taskBox.addEventListener('click', () => {
        const index = parseInt(checkbox.dataset.index);
        taskCompleted[index] = !taskCompleted[index];
        renderDashboard();
      });
    }
  });

  try {
    if (typeof Recharts !== 'undefined' && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
      initializeChart(timeRange);
    } else {
      renderSimpleChart(timeRange);
    }
  } catch (error) {
    console.error('Error initializing chart:', error);
    renderSimpleChart(timeRange);
  }
}

function toggleCategory(category) {
  expandedCategory = expandedCategory === category ? null : category;
  renderDashboard();
}

// document.addEventListener('DOMContentLoaded', () => {
//   renderDashboard();
// });

document.addEventListener('DOMContentLoaded', () => {
  // Load add-product.css
  const addProductStyles = document.createElement('link');
  addProductStyles.rel = 'stylesheet';
  addProductStyles.href = 'css/add-product.css'; // Adjust path if needed
  document.head.appendChild(addProductStyles);

  // Load add-product.js if not already loaded
  if (!window.openAddProductModal) {
    const addProductScript = document.createElement('script');
    addProductScript.src = 'js/components/add-product.js'; // Adjust path if needed
    addProductScript.onload = () => {
      console.log('add-product.js loaded successfully');
      renderDashboard(); // Re-render to ensure button functionality
    };
    document.body.appendChild(addProductScript);
  } else {
    renderDashboard(); // Render if script is already loaded
  }
});