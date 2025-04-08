// buying.js - Buying Dashboard implementation

// State variables for the Buying dashboard
let activeBuyingTab = 'overview';
let activeTimeFrame = 'month';
let activeSupplierFilter = 'all';
let purchaseOrders = [];
let purchaseRequests = [];
let supplierAnalytics = {};
let expenditureData = [];
let isTableExpanded = false;
let supplierRatings = {
  'Acme Supplies': 4.8,
  'Global Materials Inc.': 3.5,
  'Tech Components Ltd.': 4.2,
  'Industrial Parts Co.': 4.6,
  'Quality Goods Corp.': 3.9,
  'Standard Materials': 4.0,
  'Prime Distributors': 4.7,
  'Budget Supplies': 3.2
};

// Mock data for the Buying dashboard
function initializeMockData() {
  // Mock Purchase Orders
  purchaseOrders = [
    { id: 'PO-2023-001', supplier: 'Acme Supplies', status: 'Completed', date: 'Apr 2, 2025', amount: 5600.50, items: 12 },
    { id: 'PO-2023-002', supplier: 'Global Materials Inc.', status: 'Processing', date: 'Apr 1, 2025', amount: 3450.25, items: 8 },
    { id: 'PO-2023-003', supplier: 'Tech Components Ltd.', status: 'Pending Approval', date: 'Mar 29, 2025', amount: 7890.00, items: 15 },
    { id: 'PO-2023-004', supplier: 'Industrial Parts Co.', status: 'Completed', date: 'Mar 25, 2025', amount: 2300.75, items: 6 },
    { id: 'PO-2023-005', supplier: 'Quality Goods Corp.', status: 'Processing', date: 'Mar 23, 2025', amount: 4590.20, items: 10 },
    { id: 'PO-2023-006', supplier: 'Standard Materials', status: 'Canceled', date: 'Mar 15, 2025', amount: 1250.00, items: 3 }
  ];

  // Mock Purchase Requests
  purchaseRequests = [
    { id: 'PR-2023-001', requestor: 'Sarah Johnson', department: 'Production', status: 'Approved', date: 'Apr 5, 2025', items: 7 },
    { id: 'PR-2023-002', requestor: 'Michael Chen', department: 'R&D', status: 'Pending', date: 'Apr 4, 2025', items: 5 },
    { id: 'PR-2023-003', requestor: 'David Williams', department: 'Maintenance', status: 'Under Review', date: 'Apr 2, 2025', items: 3 },
    { id: 'PR-2023-004', requestor: 'Amanda Rodriguez', department: 'Operations', status: 'Approved', date: 'Mar 29, 2025', items: 9 }
  ];

  // Mock Supplier Analytics
  supplierAnalytics = {
    'Acme Supplies': { onTimeDelivery: 97, qualityRating: 95, costSavings: 12, responseTime: 1.2 },
    'Global Materials Inc.': { onTimeDelivery: 82, qualityRating: 78, costSavings: 5, responseTime: 2.5 },
    'Tech Components Ltd.': { onTimeDelivery: 91, qualityRating: 89, costSavings: 8, responseTime: 1.5 },
    'Industrial Parts Co.': { onTimeDelivery: 95, qualityRating: 92, costSavings: 10, responseTime: 1.0 }
  };

  // Monthly expenditure data
  expenditureData = [
    { month: 'Jan', total: 42500, directMaterials: 25000, indirectMaterials: 10500, services: 7000 },
    { month: 'Feb', total: 39800, directMaterials: 22000, indirectMaterials: 11800, services: 6000 },
    { month: 'Mar', total: 45200, directMaterials: 28000, indirectMaterials: 9200, services: 8000 },
    { month: 'Apr', total: 47500, directMaterials: 29500, indirectMaterials: 10000, services: 8000 },
    { month: 'May', total: 52300, directMaterials: 32000, indirectMaterials: 12300, services: 8000 },
    { month: 'Jun', total: 49800, directMaterials: 30000, indirectMaterials: 11800, services: 8000 }
  ];
}

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function getStatusColor(status) {
  const statusColors = {
    'Completed': 'emerald',
    'Processing': 'indigo',
    'Pending Approval': 'amber',
    'Canceled': 'rose',
    'Approved': 'emerald',
    'Pending': 'indigo',
    'Under Review': 'amber',
    'Rejected': 'rose'
  };
  return statusColors[status] || 'gray';
}

function renderSupplierRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let starsHtml = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += `<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>`;
  }
  
  // Half star
  if (hasHalfStar) {
    starsHtml += `<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stop-color="currentColor"></stop>
          <stop offset="50%" stop-color="#D1D5DB"></stop>
        </linearGradient>
      </defs>
      <path fill="url(#half-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>`;
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += `<svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>`;
  }
  
  // Add the numerical rating
  starsHtml += `<span class="ml-1 text-sm text-gray-500">(${rating.toFixed(1)})</span>`;
  
  return starsHtml;
}

function renderProgressBar(percentage, color = 'indigo') {
  return `
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
      <div class="bg-${color}-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
    </div>
    <div class="text-xs text-gray-500">${percentage}%</div>
  `;
}

function renderBuyingPage() {
  // Initialize mock data if not already done
  if (purchaseOrders.length === 0) {
    initializeMockData();
  }

  const dashboardContent = document.getElementById('dashboard-content');
  if (!dashboardContent) return;

  // Calculate summary statistics
  const totalPurchaseOrders = purchaseOrders.length;
  const completedOrders = purchaseOrders.filter(po => po.status === 'Completed').length;
  const pendingOrders = purchaseOrders.filter(po => po.status === 'Pending Approval').length;
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);
  const averageOrderValue = totalSpend / totalPurchaseOrders;
  
  const pendingRequests = purchaseRequests.filter(pr => pr.status === 'Pending' || pr.status === 'Under Review').length;

  // Dashboard HTML
  let buyingPageHTML = `
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center">
        Buying Dashboard
        <span class="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
          MODULE
        </span>
      </h1>
      <p class="text-gray-600">Manage purchase orders, requests, and supplier relationships</p>
    </div>

    <!-- Main navigation tabs -->
    <div class="mb-6 border-b border-gray-200">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
        <li class="mr-2">
          <button 
            onclick="activeBuyingTab = 'overview'; renderBuyingPage();" 
            class="inline-block p-4 rounded-t-lg ${activeBuyingTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600 active' : 'hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent'}" 
            aria-current="${activeBuyingTab === 'overview' ? 'page' : 'false'}">
            Overview
          </button>
        </li>
        <li class="mr-2">
          <button 
            onclick="activeBuyingTab = 'purchase-orders'; renderBuyingPage();" 
            class="inline-block p-4 rounded-t-lg ${activeBuyingTab === 'purchase-orders' ? 'text-indigo-600 border-b-2 border-indigo-600 active' : 'hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent'}" 
            aria-current="${activeBuyingTab === 'purchase-orders' ? 'page' : 'false'}">
            Purchase Orders
          </button>
        </li>
        <li class="mr-2">
          <button 
            onclick="activeBuyingTab = 'requests'; renderBuyingPage();" 
            class="inline-block p-4 rounded-t-lg ${activeBuyingTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600 active' : 'hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent'}" 
            aria-current="${activeBuyingTab === 'requests' ? 'page' : 'false'}">
            Purchase Requests
          </button>
        </li>
        <li class="mr-2">
          <button 
            onclick="activeBuyingTab = 'suppliers'; renderBuyingPage();" 
            class="inline-block p-4 rounded-t-lg ${activeBuyingTab === 'suppliers' ? 'text-indigo-600 border-b-2 border-indigo-600 active' : 'hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent'}" 
            aria-current="${activeBuyingTab === 'suppliers' ? 'page' : 'false'}">
            Suppliers
          </button>
        </li>
        <li>
          <button 
            onclick="activeBuyingTab = 'analytics'; renderBuyingPage();" 
            class="inline-block p-4 rounded-t-lg ${activeBuyingTab === 'analytics' ? 'text-indigo-600 border-b-2 border-indigo-600 active' : 'hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent'}" 
            aria-current="${activeBuyingTab === 'analytics' ? 'page' : 'false'}">
            Analytics
          </button>
        </li>
      </ul>
    </div>
  `;

  // Content based on active tab
  if (activeBuyingTab === 'overview') {
    buyingPageHTML += renderOverviewTab(totalPurchaseOrders, pendingOrders, totalSpend, pendingRequests);
  } else if (activeBuyingTab === 'purchase-orders') {
    buyingPageHTML += renderPurchaseOrdersTab();
  } else if (activeBuyingTab === 'requests') {
    buyingPageHTML += renderRequestsTab();
  } else if (activeBuyingTab === 'suppliers') {
    buyingPageHTML += renderSuppliersTab();
  } else if (activeBuyingTab === 'analytics') {
    buyingPageHTML += renderAnalyticsTab();
  }

  dashboardContent.innerHTML = buyingPageHTML;

  // Set up event handlers for any interactive elements
  setupEventHandlers();
}

function renderOverviewTab(totalPurchaseOrders, pendingOrders, totalSpend, pendingRequests) {
  return `
    <div class="mb-6">
      <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-amber-300 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <div class="bg-white/15 p-2 rounded-xl backdrop-blur-sm">
              <span class="text-amber-300">${getIconSvg("ShoppingCart", "w-6 h-6")}</span>
            </div>
            <h1 class="text-white text-2xl font-bold">Procurement Overview</h1>
          </div>
          <p class="text-indigo-200 text-lg mb-6">Monitor your procurement activities and performance</p>
          <div class="flex gap-3">
            <button class="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors shadow-md"
                    onclick="activeBuyingTab = 'purchase-orders'; renderBuyingPage();">
              View Orders
            </button>
            <button class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-800 transition-colors border border-indigo-500 shadow-md"
                    onclick="window.location='#create-order'">
              Create New Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${renderStatCard('ShoppingCart', 'Total Purchase Orders', totalPurchaseOrders, 'up', '8.2%', 'vs. previous month')}
      ${renderStatCard('Clock', 'Pending Approvals', pendingOrders, 'down', '5.1%', 'needs attention')}
      ${renderStatCard('DollarSign', 'Total Spend', formatCurrency(totalSpend), 'up', '12.3%', 'vs. previous month')}
      ${renderStatCard('FileText', 'Purchase Requests', pendingRequests, 'up', '4.7%', 'awaiting processing')}
    </div>

    <!-- Recent Orders & Requests -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Purchase Orders -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("ShoppingCart", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Recent Purchase Orders</h3>
          </div>
          <button class="text-indigo-700 text-sm font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 border border-indigo-100"
                  onclick="activeBuyingTab = 'purchase-orders'; renderBuyingPage();">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO #</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${purchaseOrders.slice(0, 3).map(order => `
                <tr class="hover:bg-gray-50 cursor-pointer">
                  <td class="px-4 py-3 text-sm font-medium text-indigo-600">${order.id}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">${order.supplier}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">${order.date}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-700">
                      ${order.status}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 text-right">${formatCurrency(order.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Purchase Requests -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("FileText", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Recent Purchase Requests</h3>
          </div>
          <button class="text-indigo-700 text-sm font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 border border-indigo-100"
                  onclick="activeBuyingTab = 'requests'; renderBuyingPage();">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PR #</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requestor</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${purchaseRequests.slice(0, 3).map(request => `
                <tr class="hover:bg-gray-50 cursor-pointer">
                  <td class="px-4 py-3 text-sm font-medium text-indigo-600">${request.id}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">${request.requestor}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">${request.department}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">${request.date}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(request.status)}-100 text-${getStatusColor(request.status)}-700">
                      ${request.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Top Suppliers & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Suppliers -->
      <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("Users", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Top Suppliers</h3>
          </div>
          <button class="text-indigo-700 text-sm font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 border border-indigo-100" 
                  onclick="activeBuyingTab = 'suppliers'; renderBuyingPage();">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Delivery</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Rating</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${Object.keys(supplierAnalytics).slice(0, 3).map(supplier => `
                <tr class="hover:bg-gray-50 cursor-pointer">
                  <td class="px-4 py-4 text-sm font-medium text-gray-900">${supplier}</td>
                  <td class="px-4 py-4 text-sm text-gray-500 w-40">
                    ${renderProgressBar(supplierAnalytics[supplier].onTimeDelivery, 'emerald')}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-500 w-40">
                    ${renderProgressBar(supplierAnalytics[supplier].qualityRating, 'indigo')}
                  </td>
                  <td class="px-4 py-4 text-sm text-gray-900">
                    <div class="flex items-center">
                      ${renderSupplierRating(supplierRatings[supplier] || 3.0)}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("Zap", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Quick Actions</h3>
          </div>
        </div>
        <div class="space-y-3">
          <button class="w-full flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-left transition-colors">
            <div class="flex items-center">
              <span class="p-2 rounded-lg bg-indigo-100 text-indigo-700 mr-3">${getIconSvg("Plus", "w-5 h-5")}</span>
              <span class="font-medium">Create Purchase Order</span>
            </div>
            <span class="text-indigo-600">${getIconSvg("ChevronRight", "w-5 h-5")}</span>
          </button>
          <button class="w-full flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-left transition-colors">
            <div class="flex items-center">
              <span class="p-2 rounded-lg bg-emerald-100 text-emerald-700 mr-3">${getIconSvg("FileText", "w-5 h-5")}</span>
              <span class="font-medium">Submit Request</span>
            </div>
            <span class="text-emerald-600">${getIconSvg("ChevronRight", "w-5 h-5")}</span>
          </button>
          <button class="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-left transition-colors">
            <div class="flex items-center">
              <span class="p-2 rounded-lg bg-amber-100 text-amber-700 mr-3">${getIconSvg("Users", "w-5 h-5")}</span>
              <span class="font-medium">Add Supplier</span>
            </div>
            <span class="text-amber-600">${getIconSvg("ChevronRight", "w-5 h-5")}</span>
          </button>
          <button class="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <div class="flex items-center">
              <span class="p-2 rounded-lg bg-blue-100 text-blue-700 mr-3">${getIconSvg("BarChart2", "w-5 h-5")}</span>
              <span class="font-medium">Generate Reports</span>
            </div>
            <span class="text-blue-600">${getIconSvg("ChevronRight", "w-5 h-5")}</span>
          </button>
        </div>
        <div class="mt-5 pt-5 border-t border-gray-100">
          <a href="#" class="flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm">
            <span class="mr-2">${getIconSvg("Settings", "w-4 h-4")}</span>
            Configure Buying Settings
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderPurchaseOrdersTab() {
  // Determine if we should show empty state or actual data
  const hasOrders = purchaseOrders.length > 0;
  
  return `
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
            <span class="text-white">${getIconSvg("ShoppingCart", "w-5 h-5")}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Purchase Orders</h3>
        </div>
        <button class="text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <span class="flex items-center">
            <span class="mr-2">${getIconSvg("Plus", "w-5 h-5")}</span>
            Create Purchase Order
          </span>
        </button>
      </div>

      <!-- Flexible layout with sidebar and main content -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Left sidebar for filters -->
        <div class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 class="font-medium text-gray-700 mb-4">Filter By</h4>
            
            <!-- Filter groups -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Assigned To</label>
                <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Users</option>
                  <option>Admin User</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Created By</label>
                <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Anyone</option>
                  <option>Admin User</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Tags</label>
                <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Tags</option>
                  <option>Urgent</option>
                  <option>Review Required</option>
                  <option>High Value</option>
                </select>
              </div>
              
              <div class="pt-2 border-t border-gray-200">
                <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <span class="mr-1">${getIconSvg("Settings", "w-4 h-4")}</span>
                  Edit Filters
                </button>
              </div>
              
              <div>
                <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <span class="mr-1">${getIconSvg("Tag", "w-4 h-4")}</span>
                  Show Tags
                </button>
              </div>
            </div>
            
            <!-- Save filter section -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <h4 class="font-medium text-gray-700 mb-2">Save Filter</h4>
              <div class="space-y-3">
                <input 
                  type="text"
                  placeholder="Filter name"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button class="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main content area -->
        <div class="flex-1">
          <!-- Search filters -->
          <div class="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">ID</label>
                <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="PO-2023-XXX">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Supplier</label>
                <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Supplier ID">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Supplier Name</label>
                <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Name">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Company</label>
                <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Company">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="flex flex-wrap justify-between items-center">
              <div class="flex gap-2">
                <button class="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span class="mr-1">${getIconSvg("Filter", "w-4 h-4")}</span>
                  Filter
                </button>
                <button class="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span class="mr-1">${getIconSvg("ArrowUpDown", "w-4 h-4")}</span>
                  Sort
                </button>
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Last Updated On</span>
                <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
            </div>
          </div>

          ${hasOrders ? `
            <!-- Purchase Orders Table -->
            <div class="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO #</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${purchaseOrders.map(order => `
                    <tr class="hover:bg-gray-50 cursor-pointer">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">${order.id}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.supplier}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.date}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.items}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-700">
                          ${order.status}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${formatCurrency(order.amount)}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div class="flex justify-center gap-2">
                          <button class="text-indigo-600 hover:text-indigo-900" title="View">
                            ${getIconSvg("Eye", "w-5 h-5")}
                          </button>
                          <button class="text-blue-600 hover:text-blue-900" title="Edit">
                            ${getIconSvg("Pencil", "w-5 h-5")}
                          </button>
                          <button class="text-gray-600 hover:text-gray-900" title="Print">
                            ${getIconSvg("Printer", "w-5 h-5")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <!-- Empty State -->
            <div class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-gray-200">
              <div class="p-6 rounded-full bg-indigo-50 mb-4">
                ${getIconSvg("FileText", "w-16 h-16 text-indigo-400")}
              </div>
              <h3 class="text-xl font-medium text-gray-900 mb-2">You haven't created a Purchase Order yet</h3>
              <p class="text-gray-500 mb-6 text-center max-w-md">Create your first purchase order to start tracking your procurement process</p>
              <button class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Create your first Purchase Order
              </button>
            </div>
          `}

          <!-- Pagination -->
          <div class="flex items-center justify-between mt-6">
            <div class="text-sm text-gray-500">
              ${hasOrders ? 
                `Showing <span class="font-medium">1</span> to <span class="font-medium">${purchaseOrders.length}</span> of <span class="font-medium">${purchaseOrders.length}</span> purchase orders` :
                `No purchase orders found`
              }
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">Show</span>
              <select class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option selected>20</option>
                <option>100</option>
                <option>500</option>
                <option>2500</option>
              </select>
              <span class="text-sm text-gray-500">entries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRequestsTab() {
  return `
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
            <span class="text-white">${getIconSvg("FileText", "w-5 h-5")}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Purchase Requests</h3>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">${getIconSvg("Search", "w-5 h-5")}</span>
            </div>
            <input type="text" class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full" placeholder="Search requests...">
          </div>
          <button class="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg font-medium transition-colors">
            <span class="flex items-center">
              <span class="mr-2">${getIconSvg("Plus", "w-5 h-5")}</span>
              New Request
            </span>
          </button>
        </div>
      </div>

      <!-- Filter options -->
      <div class="flex flex-wrap gap-3 mb-5">
        <select class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">All Departments</option>
          <option value="Production">Production</option>
          <option value="R&D">R&D</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Operations">Operations</option>
        </select>
        <input type="date" class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
        <button class="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors border border-indigo-100">
          Apply Filters
        </button>
      </div>

      <!-- Purchase Requests Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PR #</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requestor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${purchaseRequests.map(request => `
              <tr class="hover:bg-gray-50 cursor-pointer">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">${request.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${request.requestor}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${request.department}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${request.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${request.items}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(request.status)}-100 text-${getStatusColor(request.status)}-700">
                    ${request.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center gap-2">
                    <button class="text-indigo-600 hover:text-indigo-900" title="View">
                      ${getIconSvg("Eye", "w-5 h-5")}
                    </button>
                    <button class="text-emerald-600 hover:text-emerald-900" title="Approve">
                      ${getIconSvg("CheckCircle", "w-5 h-5")}
                    </button>
                    <button class="text-rose-600 hover:text-rose-900" title="Reject">
                      ${getIconSvg("XCircle", "w-5 h-5")}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-500">
          Showing <span class="font-medium">1</span> to <span class="font-medium">${purchaseRequests.length}</span> of <span class="font-medium">${purchaseRequests.length}</span> purchase requests
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled>
            Previous
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSuppliersTab() {
  return `
    <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
        <div class="flex items-center gap-3">
          <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
            <span class="text-white">${getIconSvg("Users", "w-5 h-5")}</span>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Supplier Management</h3>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">${getIconSvg("Search", "w-5 h-5")}</span>
            </div>
            <input type="text" class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full" placeholder="Search suppliers...">
          </div>
          <button class="text-white bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg font-medium transition-colors">
            <span class="flex items-center">
              <span class="mr-2">${getIconSvg("Plus", "w-5 h-5")}</span>
              Add Supplier
            </span>
          </button>
        </div>
      </div>

      <!-- Filter options -->
      <div class="flex flex-wrap gap-3 mb-5">
        <button onclick="activeSupplierFilter = 'all'; renderBuyingPage();" 
                class="px-4 py-2 rounded-lg ${activeSupplierFilter === 'all' ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors">
          All Suppliers
        </button>
        <button onclick="activeSupplierFilter = 'active'; renderBuyingPage();" 
                class="px-4 py-2 rounded-lg ${activeSupplierFilter === 'active' ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors">
          Active
        </button>
        <button onclick="activeSupplierFilter = 'inactive'; renderBuyingPage();" 
                class="px-4 py-2 rounded-lg ${activeSupplierFilter === 'inactive' ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors">
          Inactive
        </button>
        <button onclick="activeSupplierFilter = 'top'; renderBuyingPage();" 
                class="px-4 py-2 rounded-lg ${activeSupplierFilter === 'top' ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors">
          Top Rated
        </button>
      </div>

      <!-- Suppliers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${Object.keys(supplierAnalytics).concat(['Standard Materials', 'Prime Distributors', 'Budget Supplies']).map(supplier => {
          const performance = supplierAnalytics[supplier] || { onTimeDelivery: 85, qualityRating: 80, costSavings: 7, responseTime: 1.8 };
          const rating = supplierRatings[supplier] || 3.0;
          return `
            <div class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-4">
                <h4 class="text-lg font-medium text-gray-900">${supplier}</h4>
                <span class="px-2 py-1 text-xs font-medium rounded-full ${rating >= 4.5 ? 'bg-emerald-100 text-emerald-700' : rating >= 3.5 ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}">
                  ${rating >= 4.5 ? 'Preferred' : rating >= 3.5 ? 'Approved' : 'Provisional'}
                </span>
              </div>
              <div class="mb-4">
                <div class="flex items-center mb-2">
                  ${renderSupplierRating(rating)}
                </div>
              </div>
              <div class="space-y-3 mb-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-500">On-Time Delivery</span>
                    <span class="font-medium">${performance.onTimeDelivery}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-emerald-600 h-1.5 rounded-full" style="width: ${performance.onTimeDelivery}%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-500">Quality Rating</span>
                    <span class="font-medium">${performance.qualityRating}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${performance.qualityRating}%"></div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
                <span>Response Time: ${performance.responseTime || 1.5} days</span>
                <span>Cost Savings: ${performance.costSavings || 5}%</span>
              </div>
              <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Profile</button>
                <button class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Orders</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Add Supplier Button -->
      <div class="flex justify-center mt-6">
        <button class="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors border border-indigo-100">
          View All Suppliers
        </button>
      </div>
    </div>
  `;
}

function renderAnalyticsTab() {
  return `
    <!-- Analytics Tab -->
    <div class="mb-6">
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-700 p-2.5 rounded-lg shadow-md min-w-[40px] min-h-[40px] flex items-center justify-center">
              <span class="text-white">${getIconSvg("BarChart2", "w-5 h-5")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Procurement Analytics</h3>
          </div>
          <div class="bg-gray-50 p-1 rounded-full border border-gray-200">
            ${['week', 'month', 'quarter', 'year'].map(range => `
              <button
                onclick="activeTimeFrame = '${range}'; renderBuyingPage();"
                class="px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  activeTimeFrame === range
                    ? 'bg-white text-indigo-700 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }"
              >
                ${range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Expenditure Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl border border-gray-200 p-4">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Monthly Expenditure</h4>
              <div id="expenditure-chart" style="height: 300px;" class="w-full">
                <!-- Line chart for expenditure over time -->
                <div class="flex items-center justify-center h-full text-gray-500">
                  Chart placeholder - Expenditure trend over time
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="bg-white rounded-xl border border-gray-200 p-4 h-full">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Expenditure Breakdown</h4>
              <div id="pie-chart" style="height: 200px;" class="w-full mb-4">
                <!-- Pie chart for expenditure breakdown -->
                <div class="flex items-center justify-center h-full text-gray-500">
                  Expenditure breakdown chart
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                    <span class="text-sm text-gray-600">Direct Materials</span>
                  </div>
                  <span class="text-sm font-medium">65%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span class="text-sm text-gray-600">Indirect Materials</span>
                  </div>
                  <span class="text-sm font-medium">20%</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                    <span class="text-sm text-gray-600">Services</span>
                  </div>
                  <span class="text-sm font-medium">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-gray-500 text-sm">Cost Savings</h5>
              <span class="text-emerald-600 text-xs font-medium bg-emerald-100 px-2 py-1 rounded-full flex items-center">
                <span class="mr-1">${getIconSvg("TrendingUp", "w-3 h-3")}</span>
                +8.2%
              </span>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-2xl font-bold text-gray-900">$245,382</span>
              <span class="text-gray-500 text-sm">YTD</span>
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-gray-500 text-sm">Avg. Order Cycle Time</h5>
              <span class="text-emerald-600 text-xs font-medium bg-emerald-100 px-2 py-1 rounded-full flex items-center">
                <span class="mr-1">${getIconSvg("TrendingDown", "w-3 h-3")}</span>
                -2.5 days
              </span>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-2xl font-bold text-gray-900">15.3 days</span>
              <span class="text-gray-500 text-sm">avg</span>
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-gray-500 text-sm">On-Time Delivery</h5>
              <span class="text-rose-600 text-xs font-medium bg-rose-100 px-2 py-1 rounded-full flex items-center">
                <span class="mr-1">${getIconSvg("TrendingDown", "w-3 h-3")}</span>
                -1.8%
              </span>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-2xl font-bold text-gray-900">92.7%</span>
              <span class="text-gray-500 text-sm">avg</span>
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h5 class="text-gray-500 text-sm">Spend Under Management</h5>
              <span class="text-emerald-600 text-xs font-medium bg-emerald-100 px-2 py-1 rounded-full flex items-center">
                <span class="mr-1">${getIconSvg("TrendingUp", "w-3 h-3")}</span>
                +5.3%
              </span>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-2xl font-bold text-gray-900">78.6%</span>
              <span class="text-gray-500 text-sm">total</span>
            </div>
          </div>
        </div>

        <!-- Purchase Request Trends & Top Suppliers -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <h4 class="text-lg font-medium text-gray-800 mb-4">Purchase Request Trends</h4>
            <div style="height: 250px;" class="w-full">
              <!-- Bar chart for request trends -->
              <div class="flex items-center justify-center h-full text-gray-500">
                Bar chart - Request trends by department
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <h4 class="text-lg font-medium text-gray-800 mb-4">Top Suppliers by Spend</h4>
            <div class="space-y-4">
              ${Object.keys(supplierAnalytics).slice(0, 4).map((supplier, index) => {
                const percentage = [35, 25, 18, 12][index];
                return `
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="font-medium text-gray-700">${supplier}</span>
                      <span class="text-gray-500">$${(25000 * (4 - index) + 10000).toLocaleString()}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2">
                      <div class="bg-indigo-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">${percentage}% of total spend</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Download Report Button -->
        <div class="flex justify-center mt-8">
          <button class="flex items-center text-white bg-indigo-700 hover:bg-indigo-800 px-6 py-3 rounded-lg font-medium transition-colors shadow-md">
            <span class="mr-2">${getIconSvg("Download", "w-5 h-5")}</span>
            Download Detailed Report
          </button>
        </div>
      </div>
    </div>
  `;
}

function setupEventHandlers() {
  // Table expansion button
  const expandButton = document.getElementById('expand-table-button');
  if (expandButton) {
    expandButton.addEventListener('click', () => {
      isTableExpanded = !isTableExpanded;
      renderBuyingPage();
    });
  }

  // Other event listeners as needed
}

// Helper function to render stat cards - similar to the one in home.js
function renderStatCard(icon, label, value, trend, percentage, subtext) {
  const trendColor = trend === 'up' ? 'emerald' : 'rose';
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

// Expose the function globally for app.js to use
window.renderBuyingPage = renderBuyingPage;