let isSidebarOpen = true;
let openSubmenuIndex = null;
let activeMenuItem = 0; // Default active item (Home)
let currentPage = 'home'; // Default page
let isMobile = window.innerWidth < 768;
let isSidebarShowing = false; // Tracks if sidebar is visible on mobile
let sidebarContentInitialized = false;

// Cache DOM references for better performance
let sidebarElement = null;
let mainContentElement = null;
let headerElement = null;

/**
 * Initialize cached DOM references
 */
function initializeCachedElements() {
  sidebarElement = document.getElementById('sidebar');
  mainContentElement = document.getElementById('main-content');
  headerElement = document.getElementById('header');
}

const pages = {
  'home': { title: 'Home', icon: 'Home' },
  'accounting': { title: 'Accounting', icon: 'FileText', subpages: { 
      'assets': { title: 'Assets', icon: 'FileText' } } },
  'buying': { title: 'Buying', icon: 'ShoppingCart' },
  'selling': { title: 'Selling', icon: 'Store' },
  'stock': { title: 'Stock', icon: 'Package' },
  'hr': { title: 'Human Resources', icon: 'Users', subpages: {
      'recruitment': { title: 'Recruitment', icon: 'Users' },
      'employee_lifecycle': { title: 'Employee Lifecycle', icon: 'Users' },
      'performance': { title: 'Performance', icon: 'Award' },
      'shift_&_attendance': { title: 'Shift & Attendance', icon: 'Clock' },
      'expense_claims': { title: 'Expense Claims', icon: 'DollarSign' },
      'leaves': { title: 'Leaves', icon: 'Calendar' } } },
  'manufacturing': { title: 'Manufacturing', icon: 'Factory'},
  'payroll': { title: 'Payroll', icon: 'DollarSign', subpages: {
      'salary_payout': { title: 'Salary Payout', icon: 'DollarSign' },
      'tax_&_benefits': { title: 'Tax & Benefits', icon: 'FileText' } } },
  'crm': { title: 'CRM', icon: 'Heart'},
  'support': { title: 'Support', icon: 'PhoneCall'},
  'quality': { title: 'Quality', icon: 'Award'},
  'projects': { title: 'Projects', icon: 'Folder'},
  'website': { title: 'Website', icon: 'Globe'},
  'loans': { title: 'Loans', icon: 'Wallet'},
  'users': { title: 'Users', icon: 'User'},
  'build': { title: 'Build', icon: 'Hammer'},
  'tools': { title: 'Tools', icon: 'Wrench'},
  'settings': { title: 'Settings', icon: 'Settings'},
  'integrations': { title: 'Integrations', icon: 'Link' }
};

const menuData = [
  {
    title: "Core Operations",
    items: [
      { icon: "Home", label: "Home", children: [], page: "home" },
      { icon: "FileText", label: "Accounting", children: ["Assets"], page: "accounting" },
      { icon: "ShoppingCart", label: "Buying", children: [], page: "buying" },
      { icon: "Store", label: "Selling", children: [], page: "selling" },
      { icon: "Package", label: "Stock", children: [], page: "stock" }
    ]
  },
  {
    title: "Workforce & Production",
    items: [
      { 
        icon: "Users", 
        label: "HR", 
        children: [
          "Recruitment",
          "Employee Lifecycle",
          "Performance",
          "Shift & Attendance",
          "Expense Claims",
          "Leaves"
        ],
        page: "hr"
      },
      { icon: "Factory", label: "Manufacturing", children: [], page: "manufacturing" },
      { 
        icon: "DollarSign", 
        label: "Payroll", 
        children: ["Salary Payout", "Tax & Benefits"],
        page: "payroll"
      }
    ]
  },
  {
    title: "Customer Management",
    items: [
      { icon: "Heart", label: "CRM", children: [], page: "crm" },
      { icon: "PhoneCall", label: "Support", children: [], page: "support" },
      { icon: "Award", label: "Quality", children: [], page: "quality" }
    ]
  },
  {
    title: "Project & Resources",
    items: [
      { icon: "Folder", label: "Projects", children: [], page: "projects" },
      { icon: "Globe", label: "Website", children: [], page: "website" },
      { icon: "Wallet", label: "Loans", children: [], page: "loans" }
    ]
  },
  {
    title: "System",
    items: [
      { icon: "User", label: "Users", children: [], page: "users" },
      { icon: "Hammer", label: "Build", children: [], page: "build" },
      { icon: "Wrench", label: "Tools", children: [], page: "tools" },
      { icon: "Settings", label: "Settings", children: [], page: "settings" },
      { icon: "Link", label: "Integrations", children: [], page: "integrations" }
    ]
  }
];

/**
 * Renders a menu item for the sidebar
 */
function renderMenuItem(item, index, groupIndex) {
  const { icon, label, children, page } = item;
  const itemId = `menu-item-${groupIndex}-${index}`;
  const hasChildren = children && children.length > 0;
  const isActive = currentPage === page || (currentPage && currentPage.startsWith(page + '/'));
  const isSubmenuOpen = openSubmenuIndex === `${groupIndex}-${index}`;

  return `
    <div class="relative group" id="${itemId}">
      <button
        class="${isSidebarOpen ? 'w-full px-3 py-2.5' : 'w-10 h-10 mx-auto'} flex items-center ${isSidebarOpen ? '' : 'justify-center'} rounded-xl transition-all duration-200 ${
          isActive ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm' : 'text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-600'
        }"
        data-group="${groupIndex}"
        data-index="${index}"
        data-page="${page}"
        onclick="handleMenuItemClick(${groupIndex}, ${index}, ${hasChildren}, '${page}')"
        ${hasChildren ? 'aria-expanded="' + (isSubmenuOpen ? 'true' : 'false') + '"' : ''}
        ${hasChildren ? 'aria-controls="submenu-' + groupIndex + '-' + index + '"' : ''}
        ${isActive ? 'aria-current="page"' : ''}
        type="button"
      >
        <span class="${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600 transition-colors'}">
          ${getIconSvg(icon, `w-5 h-5 ${!isSidebarOpen ? 'mx-auto' : ''}`)}
        </span>
        ${isSidebarOpen ? `
          <span class="ml-3 text-sm font-medium truncate flex-1 text-left">${label}</span>
          ${hasChildren ? `
            <span class="transition-transform ${isSubmenuOpen ? 'rotate-180 text-indigo-600' : 'text-gray-400'}">
              ${getIconSvg("ChevronDown")}
            </span>
          ` : ''}
        ` : ''}
      </button>
      ${!isSidebarOpen ? `
        <div class="absolute left-full top-0 ml-2 px-2 py-1 bg-indigo-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
          ${label}${hasChildren ? '<span class="ml-1 text-amber-300">•</span>' : ''}
        </div>
      ` : ''}
      ${hasChildren && isSubmenuOpen && isSidebarOpen ? `
        <div id="submenu-${groupIndex}-${index}" class="ml-11 mt-1 space-y-1 submenu submenu-${groupIndex}-${index} ${isSubmenuOpen ? 'open' : ''}" role="menu">
          ${children.map((child, childIndex) => {
            const childSlug = child.toLowerCase().replace(/\s+/g, '_').replace(/&/g, '_');
            const subpagePath = `${page}/${childSlug}`;
            const isSubActive = currentPage === subpagePath;
            return `
              <button
                class="w-full flex items-center text-left py-2 px-3 text-sm ${isSubActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'} hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
                data-group="${groupIndex}"
                data-index="${index}"
                data-child="${childIndex}"
                data-subpage="${subpagePath}"
                onclick="handleSubmenuItemClick('${page}', '${childSlug}')"
                ${isSubActive ? 'aria-current="page"' : ''}
                role="menuitem"
                type="button"
              >
                <div class="w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-indigo-500' : 'bg-amber-400'} mr-2"></div>
                ${child}
              </button>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Renders a group of menu items
 */
function renderMenuGroup(group, groupIndex) {
  return `
    <div class="mb-8">
      ${isSidebarOpen ? `
        <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
          <div class="w-8 border-t border-gray-200 mr-2"></div>
          ${group.title}
        </h3>
      ` : ''}
      <div class="${isSidebarOpen ? 'space-y-1.5' : 'flex flex-col items-center space-y-1'}">
        ${group.items.map((item, index) => renderMenuItem(item, index, groupIndex)).join('')}
      </div>
    </div>
  `;
}

/**
 * Toggles hamburger menu visibility
 */
function toggleHamburgerVisibility(sidebarIsOpen) {
  const hamburger = document.getElementById('mobile-nav-toggle');
  if (hamburger) {
    if (sidebarIsOpen) {
      hamburger.classList.add('opacity-0', 'pointer-events-none');
      hamburger.setAttribute('aria-hidden', 'true');
    } else {
      hamburger.classList.remove('opacity-0', 'pointer-events-none');
      hamburger.setAttribute('aria-hidden', 'false');
    }
  }
}

/**
 * Optimized renderSidebar function
 */
function renderSidebar() {
  // Initialize DOM cache on first render
  if (!sidebarElement) {
    initializeCachedElements();
  }
  
  if (!sidebarElement) return;

  // Set appropriate classes based on state
  if (window.isMobile) {
    sidebarElement.className = `bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col fixed top-0 h-screen z-40 ${window.isSidebarShowing ? 'left-0 w-64' : '-left-64 w-0'}`;
  } else {
    sidebarElement.className = `bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 h-screen z-40 ${isSidebarOpen ? 'w-64' : 'w-16'}`;
  }

  // Generate HTML for sidebar content
  sidebarElement.innerHTML = generateSidebarHTML();
  
  // Set up event listeners
  setupSidebarEventListeners();
  
  // Update dependent elements
  updateLayout();
}

/**
 * Generate sidebar HTML - extracted for clarity
 */
function generateSidebarHTML() {
  let sidebarHTML = `
    <div class="h-16 flex items-center justify-between px-3">
      ${isSidebarOpen ? `
        <div class="flex items-center ml-1 logo-container">
          <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
            <span class="flex items-center justify-center text-amber-300">${getIconSvg("Zap")}</span>
          </div>
          <span class="ml-3 font-semibold text-gray-900">ERPNext</span>
        </div>
        <button id="toggle-sidebar-close" class="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors" 
                aria-label="Collapse Sidebar" type="button">
          ${getIconSvg("ChevronLeft")}
        </button>
      ` : `
        <button id="toggle-sidebar-open" class="w-16 h-16 flex items-center justify-center logo-container p-0" 
                aria-label="Expand Sidebar" type="button">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg cursor-pointer zap-button">
            <span class="text-amber-300">${getIconSvg("Zap", "w-6 h-6")}</span>
          </div>
        </button>
      `}
    </div>
  `;

  if (isSidebarOpen) {
    sidebarHTML += `
      <div class="p-3">
        <div class="relative">
          <span class="absolute left-3 top-1 -translate-y-1/2 text-gray-400">${getIconSvg("Search")}</span>
          <input type="text" placeholder="Search..." class="w-full py-2 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 pl-10 pr-4" 
                aria-label="Search modules"/>
        </div>
      </div>
    `;
  }

  sidebarHTML += `
    <div class="flex-1 overflow-y-auto px-3 py-2" role="navigation">
      ${menuData.map((group, index) => renderMenuGroup(group, index)).join('')}
    </div>
  `;

  return sidebarHTML;
}

/**
 * Set up event listeners for sidebar elements
 */
function setupSidebarEventListeners() {
  // Set up toggle buttons
  if (isSidebarOpen) {
    const closeButton = document.getElementById('toggle-sidebar-close');
    if (closeButton) {
      closeButton.addEventListener('click', toggleSidebar);
    }
  } else {
    const openButton = document.getElementById('toggle-sidebar-open');
    if (openButton) {
      openButton.addEventListener('click', toggleSidebar);
    }
  }

  // Set up mobile sidebar header
  if (window.isMobile && window.isSidebarShowing) {
    setTimeout(renderMobileSidebarHeader, 50);
  }
}

/**
 * Updates layout of main content and header based on sidebar state
 * Uses cached DOM references for better performance
 */
function updateLayout() {
  if (!mainContentElement || !headerElement) {
    mainContentElement = document.getElementById('main-content');
    headerElement = document.getElementById('header');
  }
  
  if (mainContentElement) {
    if (window.isMobile) {
      mainContentElement.className = `transition-all duration-300 ease-in-out ml-0`;
    } else {
      mainContentElement.className = `transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-16'}`;
    }
  }

  if (headerElement) {
    if (window.isMobile) {
      headerElement.className = `h-16 bg-white border-b border-gray-200 fixed right-0 top-0 z-30 left-0 transition-all duration-300 ease-in-out ${window.isSidebarShowing ? 'sidebar-open' : ''}`;
    } else {
      headerElement.className = `h-16 bg-white border-b border-gray-200 fixed right-0 top-0 z-30 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-64' : 'left-16'}`;
    }
  }
}

/**
 * Renders mobile sidebar header
 */
function renderMobileSidebarHeader() {
  const sidebarHeaderContainer = document.querySelector('#sidebar .h-16');
  if (!sidebarHeaderContainer) return;

  sidebarHeaderContainer.innerHTML = `
    <div class="flex items-center px-1 h-full">
      <div class="flex items-center">
        <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
          <span class="flex items-center justify-center text-amber-300">${getIconSvg("Zap")}</span>
        </div>
        <span class="ml-3 font-semibold text-gray-900">ERPNext</span>
      </div>
      <button id="toggle-sidebar-close" class="absolute top-4 right-3 text-gray-400 hover:text-indigo-600 w-8 h-8 flex items-center justify-center p-2 rounded-full hover:bg-indigo-50 transition-colors" 
              aria-label="Close Sidebar" type="button">
        ${getIconSvg("ChevronLeft", "w-5 h-5")}
      </button>
    </div>
  `;

  document.getElementById('toggle-sidebar-close')?.addEventListener('click', toggleSidebar);
}

/**
 * Generates breadcrumbs for navigation
 */
function generateBreadcrumbs(page) {
  if (page === 'home') return [];
  if (page.includes('/')) {
    const [parentPage, subpage] = page.split('/');
    let breadcrumbs = [];
    if (pages[parentPage]) breadcrumbs.push({ title: pages[parentPage].title, page: parentPage });
    if (pages[page]) breadcrumbs.push({ title: pages[page].title, page: page });
    else breadcrumbs.push({ title: subpage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), page: page });
    return breadcrumbs;
  }
  return [];
}

/**
 * Renders a stat card with dynamic trend coloring
 */
function renderStatCard(icon, title, value, trend, percentage, subtitle) {
  const trendColor = trend === 'up' ? 'text-emerald-600' : 'text-rose-600';
  const trendIconColor = trend === 'up' ? 'text-emerald-500' : 'text-rose-500';

  return `
    <div class="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <div class="bg-indigo-50 p-2 rounded-lg shadow-sm"><span class="text-indigo-600">${getIconSvg(icon, "w-5 h-5")}</span></div>
        <span class="${trendIconColor}">${getIconSvg(trend === 'up' ? 'TrendingUp' : 'TrendingDown', "w-4 h-4")}</span>
      </div>
      <h3 class="text-sm font-medium text-gray-600 mb-1">${title}</h3>
      <div class="text-2xl font-bold text-gray-800 mb-2">${value}</div>
      <div class="flex items-center text-sm">
        <span class="font-medium mr-1 ${trendColor}">${percentage}</span>
        <span class="text-gray-500">${subtitle}</span>
      </div>
    </div>
  `;
}

/**
 * Creates a module page template
 */
function createModulePageTemplate(pageInfo, breadcrumbs, isSubpage, parentInfo) {
  const title = pageInfo.title;
  const icon = pageInfo.icon;

  const breadcrumbsHtml = breadcrumbs.length > 0 ? `
    <div class="flex items-center text-gray-500 text-sm mt-1">
      ${breadcrumbs.map((crumb, index) => index === breadcrumbs.length - 1 ? 
        `<span class="text-indigo-600 font-medium">${crumb.title}</span>` : 
        `<span class="cursor-pointer hover:text-indigo-500 transition-colors" onclick="navigateToPage('${crumb.page}')">${crumb.title}</span><span class="mx-1">${getIconSvg("ChevronRight", "w-4 h-4")}</span>`).join('')}
    </div>
  ` : '';

  return `
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center">
        ${title}
        <span class="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">${isSubpage ? 'SUBMODULE' : 'MODULE'}</span>
      </h1>
      ${breadcrumbsHtml}
    </div>
    <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-6 shadow-lg mb-8 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-amber-300 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-4">
          <div class="bg-white/15 p-2 rounded-xl backdrop-blur-sm"><span class="text-amber-300">${getIconSvg(icon, "w-6 h-6")}</span></div>
          <h1 class="text-white text-2xl font-bold">${title}</h1>
        </div>
        <p class="text-indigo-100 text-lg mb-6">${isSubpage ? `${title} Submodule of ${parentInfo.title} Module` : `${title} Management Module`}</p>
        <div class="flex gap-3">
          <button class="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors shadow-md">View ${title} Reports</button>
          <button class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors border border-indigo-500 shadow-md">Quick Actions</button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      ${renderQuickAction('Plus', 'Create New')}
      ${renderQuickAction(icon, `Add ${title}`)}
      ${renderQuickAction('FileText', 'Reports')}
      ${renderQuickAction('Settings', 'Settings')}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${renderStatCard('BarChart2', `Total ${title}`, '842', 'up', '6.8%', 'Compared to last month')}
      ${renderStatCard('Activity', 'Activity Rate', '78%', 'up', '3.2%', '18 new activities this month')}
      ${renderStatCard('TrendingUp', 'Growth Rate', '12.5%', 'up', '2.1%', 'Steady increase')}
      ${renderStatCard('Calendar', 'Upcoming Tasks', '23', 'down', '5.3%', '4 tasks due today')}
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-600 p-2 rounded-lg shadow-md"><span class="text-white">${getIconSvg("Bell", "w-4 h-4")}</span></div>
            <h3 class="text-lg font-bold text-gray-800">Recent Activity</h3>
          </div>
          <button class="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 border border-indigo-100">View All</button>
        </div>
        <div class="space-y-1">
          ${renderActivityItem('CheckCircle', `New ${title} created`, `${title} #1234 - Recent update`, '2m ago', 'emerald')}
          ${renderActivityItem('Bell', 'Update received', 'Status changes applied to records', '15m ago', 'indigo')}
          ${renderActivityItem('AlertCircle', 'Attention needed', 'Review required for specific items', '1h ago', 'amber')}
          ${renderActivityItem('Clock', 'Scheduled update', 'System maintenance planned', '2h ago', 'indigo')}
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-600 p-2 rounded-lg shadow-md"><span class="text-white">${getIconSvg("Calendar", "w-4 h-4")}</span></div>
            <h3 class="text-lg font-bold text-gray-800">Tasks & Reminders</h3>
          </div>
          <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"><span class="text-gray-500">${getIconSvg("Settings", "w-4 h-4")}</span></button>
        </div>
        <div class="space-y-4">
          ${[
            { task: `Review ${title} report`, due: "2 hours", priority: "Priority", priorityColor: "rose" },
            { task: "Follow up with clients", due: "tomorrow", priority: "Regular", priorityColor: "indigo" },
            { task: "Update documentation", due: "3 days", priority: "Planning", priorityColor: "indigo" }
          ].map((item, idx) => `
            <div class="p-4 border border-gray-100 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer group hover:shadow-sm task-item"
                 onclick="document.getElementById('task-checkbox-${idx}').checked = !document.getElementById('task-checkbox-${idx}').checked">
              <div class="flex items-center mb-2">
                <input id="task-checkbox-${idx}" type="checkbox" class="rounded border-gray-300 text-indigo-600 mr-2 w-4 h-4 task-checkbox"
                       onclick="event.stopPropagation()"/>
                <h4 class="text-sm font-medium text-gray-800 group-hover:text-indigo-600">${item.task}</h4>
              </div>
              <div class="flex items-center justify-between ml-6">
                <span class="text-xs text-gray-500">Due in ${item.due}</span>
                <span class="px-2 py-1 text-xs bg-${item.priorityColor}-50 text-${item.priorityColor}-600 rounded-full">${item.priority}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="w-full mt-4 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-200">+ Add New Task</button>
      </div>
    </div>
  `;
}

/**
 * Navigates to a specific page
 */
function navigateToPage(page) {
  currentPage = page;
  const breadcrumbs = generateBreadcrumbs(page);
  const dashboardContent = document.getElementById('dashboard-content');
  let pageInfo = pages[page];
  let parentInfo = null;
  let isSubpage = false;

  if (!pageInfo && page.includes('/')) {
    isSubpage = true;
    const [parentPage, subpage] = page.split('/');
    parentInfo = pages[parentPage];
    pageInfo = pages[page] || { title: subpage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), icon: parentInfo.icon, parent: parentPage };
  }

  if (page === 'home') {
    if (typeof renderDashboard === 'function') {
      renderDashboard();
    }
  } else if (page === 'buying' && typeof window.renderBuyingPage === 'function') {
    window.renderBuyingPage();
  } else if (pageInfo && dashboardContent) {
    dashboardContent.innerHTML = createModulePageTemplate(pageInfo, breadcrumbs, isSubpage, parentInfo);
  } else if (dashboardContent) {
    dashboardContent.innerHTML = `
      <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-10 shadow-lg my-8 text-center">
        <div class="text-white text-6xl font-bold mb-4">404</div>
        <h2 class="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p class="text-indigo-200 mb-6">The requested page "${page}" does not exist.</p>
        <button class="px-6 py-3 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-lg" onclick="navigateToPage('home')">Back to Home</button>
      </div>
    `;
  }
  renderSidebar();
}

/**
 * Handles menu item clicks
 */
function handleMenuItemClick(groupIndex, index, hasChildren, page) {
  if (hasChildren) {
    const submenuId = `${groupIndex}-${index}`;
    openSubmenuIndex = openSubmenuIndex === submenuId ? null : submenuId;
    renderSidebar();
  } else {
    navigateToPage(page);
    if (!isSidebarOpen) {
      isSidebarOpen = true;
      renderSidebar();
    }
  }
}

/**
 * Handles submenu item clicks
 */
function handleSubmenuItemClick(parentPage, subPage) {
  navigateToPage(`${parentPage}/${subPage}`);
}

/**
 * Toggles sidebar open/closed
 */
function toggleSidebar() {
  if (!window.isMobile) {
    isSidebarOpen = !isSidebarOpen;
    if (!isSidebarOpen) openSubmenuIndex = null;
    renderSidebar();
  } else {
    window.isSidebarShowing = !window.isSidebarShowing;
    const overlay = document.getElementById('mobile-overlay');
    
    if (window.isSidebarShowing) {
      if (!overlay) createMobileOverlay();
      else {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-50');
      }
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');
      toggleHamburgerVisibility(true);
    } else {
      if (overlay) {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-50');
      }
      document.body.classList.remove('overflow-hidden');
      toggleHamburgerVisibility(false);
    }
    
    renderSidebar();
    
    if (typeof renderHeader === 'function') {
      renderHeader();
    }
  }
}

/**
 * Creates mobile overlay for sidebar
 */
function createMobileOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'mobile-overlay';
  overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity duration-300 md:hidden';
  overlay.addEventListener('click', toggleSidebar);
  document.body.appendChild(overlay);
}

/**
 * Handles window resize event
 */
function handleResize() {
  const wasMobile = isMobile;
  isMobile = window.innerWidth < 768;
  if (wasMobile !== isMobile) {
    if (!isMobile) {
      const overlay = document.getElementById('mobile-overlay');
      if (overlay) overlay.classList.add('opacity-0', 'pointer-events-none');
      document.body.classList.remove('overflow-hidden');
      window.isSidebarShowing = false;
    } else {
      window.isSidebarShowing = false;
    }
    renderSidebar();
    if (typeof renderHeader === 'function') {
      renderHeader(); // Ensure header updates on resize
    }
  }
}

window.addEventListener('resize', handleResize);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  isMobile = window.innerWidth < 768;
  renderSidebar();
  navigateToPage('home');
  
  // Initialize mobile nav toggle if it exists
  document.getElementById('mobile-nav-toggle')?.addEventListener('click', toggleSidebar);
});

// Initialize cached DOM references when the document loads
document.addEventListener('DOMContentLoaded', initializeCachedElements);