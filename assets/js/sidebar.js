// Sidebar state
let isSidebarOpen = true;
let openSubmenuIndex = null;
let activeMenuItem = 0; // Default active item (Home)
let currentPage = 'home'; // Default page
let isMobile = window.innerWidth < 768;
let isSidebarShowing = false; // Tracks if sidebar is visible on mobile
let sidebarContentInitialized = false;

// Pages available in the application with subpages
const pages = {
  // Main pages
  'home': {
    title: 'Home',
    icon: 'Home'
  },
  'accounting': {
    title: 'Accounting',
    icon: 'FileText',
    subpages: {
      'assets': { title: 'Assets', icon: 'FileText' },
      'liabilities': { title: 'Liabilities', icon: 'FileText' },
      'income': { title: 'Income', icon: 'FileText' },
      'expenses': { title: 'Expenses', icon: 'FileText' }
    }
  },
  'buying': {
    title: 'Buying',
    icon: 'ShoppingCart'
  },
  'selling': {
    title: 'Selling',
    icon: 'Store'
  },
  'stock': {
    title: 'Stock',
    icon: 'Package'
  },
  'hr': {
    title: 'Human Resources',
    icon: 'Users',
    subpages: {
      'recruitment': { title: 'Recruitment', icon: 'Users' },
      'employee_lifecycle': { title: 'Employee Lifecycle', icon: 'Users' },
      'performance': { title: 'Performance', icon: 'Award' },
      'shift_&_attendance': { title: 'Shift & Attendance', icon: 'Clock' },
      'expense_claims': { title: 'Expense Claims', icon: 'DollarSign' },
      'leaves': { title: 'Leaves', icon: 'Calendar' }
    }
  },
  'manufacturing': {
    title: 'Manufacturing',
    icon: 'Factory'
  },
  'payroll': {
    title: 'Payroll',
    icon: 'DollarSign',
    subpages: {
      'salary_payout': { title: 'Salary Payout', icon: 'DollarSign' },
      'tax_&_benefits': { title: 'Tax & Benefits', icon: 'FileText' }
    }
  },
  'crm': {
    title: 'CRM',
    icon: 'Heart'
  },
  'support': {
    title: 'Support',
    icon: 'PhoneCall'
  },
  'quality': {
    title: 'Quality',
    icon: 'Award'
  },
  'projects': {
    title: 'Projects',
    icon: 'Folder'
  },
  'website': {
    title: 'Website',
    icon: 'Globe'
  },
  'loans': {
    title: 'Loans',
    icon: 'Wallet'
  },
  'users': {
    title: 'Users',
    icon: 'User'
  },
  'build': {
    title: 'Build',
    icon: 'Hammer'
  },
  'tools': {
    title: 'Tools',
    icon: 'Wrench'
  },
  'settings': {
    title: 'Settings',
    icon: 'Settings'
  },
  'integrations': {
    title: 'Integrations',
    icon: 'Link'
  },
  
  // Subpages are defined within their parent page objects above,
  // but we also include them here for direct navigation
  'accounting/assets': {
    title: 'Assets',
    icon: 'FileText',
    parent: 'accounting'
  },
  'accounting/liabilities': {
    title: 'Liabilities',
    icon: 'FileText',
    parent: 'accounting'
  },
  'accounting/income': {
    title: 'Income', 
    icon: 'FileText',
    parent: 'accounting'
  },
  'accounting/expenses': {
    title: 'Expenses',
    icon: 'FileText',
    parent: 'accounting'
  },
  // HR subpages
  'hr/recruitment': {
    title: 'Recruitment',
    icon: 'Users',
    parent: 'hr'
  },
  'hr/employee_lifecycle': {
    title: 'Employee Lifecycle',
    icon: 'Users',
    parent: 'hr'
  },
  // ... other subpages
};

// Direct SVG icon mapping for reliability
const svgIcons = {
  "Home": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  
  "FileText": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>',
  
  "ShoppingCart": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>',
  
  "Store": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"></path></svg>',
  
  "Package": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" y2="12" x2="12"></line></svg>',
  
  "Users": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  
  "Factory": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M17 18h1"></path><path d="M12 18h1"></path><path d="M7 18h1"></path></svg>',
  
  "DollarSign": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
  
  "Heart": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>',
  
  "PhoneCall": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M14.05 2a9 9 0 0 1 8 7.94"></path><path d="M14.05 6A5 5 0 0 1 18 10"></path></svg>',
  
  "Award": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>',
  
  "Folder": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>',
  
  "Globe": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  
  "Wallet": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>',
  
  "User": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  
  "Hammer": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path><path d="M17.64 15 22 10.64"></path><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path></svg>',
  
  "Wrench": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
  
  "Settings": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  
  "Link": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  
  "Zap": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  
  "Search": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>',
  
  "ChevronLeft": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m15 18-6-6 6-6"></path></svg>',
  
  "ChevronRight": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m9 18 6-6-6-6"></path></svg>',
  
  "ChevronDown": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m6 9 6 6 6-6"></path></svg>',
  
  "Circle": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="10"></circle></svg>',
  
  "Calendar": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  
  "Clock": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  
  "Activity": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
  
  "BarChart2": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"></line><line x1="12" x2="12" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="14"></line></svg>',
  
  "ArrowUp": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>',
  
  "ArrowDown": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
  
  "TrendingUp": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
  
  "Layers": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
  
  "Bell": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>',
  
  "CheckCircle": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  
  "AlertCircle": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>'
};

// Complete menu data structure with all menu items and their submenus
const menuData = [
  {
    title: "Core Operations",
    items: [
      { icon: "Home", label: "Home", children: [], page: "home" },
      { icon: "FileText", label: "Accounting", children: ["Assets", "Liabilities", "Income", "Expenses"], page: "accounting" },
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

// Helper functions from home.js that we'll use for consistent UI
function getIconSvg(iconName, cssClass = "w-5 h-5") {
  // Get the SVG HTML or use Circle as fallback
  const svgHtml = svgIcons[iconName] || svgIcons["Circle"];
  
  // Replace default size with the specified class
  return svgHtml.replace('class="w-5 h-5"', `class="${cssClass}"`);
}

// Function to render a stat card
function renderStatCard(icon, label, value, trend, percentage, subtext) {
  return `
    <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
      <div class="flex items-center justify-between mb-4">
        <div class="bg-indigo-600 p-3 rounded-xl text-white group-hover:bg-indigo-700 transition-colors shadow-md">
          <span>${getIconSvg(icon)}</span>
        </div>
        ${trend ? `
          <span class="flex items-center text-sm font-medium px-3 py-1 rounded-full ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }">
            <span>${getIconSvg(trend === 'up' ? 'ArrowUp' : 'ArrowDown', "w-4 h-4 mr-1")}</span>
            ${percentage}
          </span>
        ` : ''}
      </div>
      <div>
        <p class="text-gray-600 text-sm font-medium">${label}</p>
        <h3 class="text-2xl font-bold text-gray-900 mt-2 group-hover:text-indigo-600 transition-colors">${value}</h3>
        ${subtext ? `<p class="text-sm text-gray-500 mt-2">${subtext}</p>` : ''}
      </div>
    </div>
  `;
}

// Function to render quick action buttons
function renderQuickAction(icon, label) {
  return `
    <button class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100">
      <div class="flex flex-col items-center">
        <div class="bg-indigo-600 p-3 rounded-xl mb-3 text-white group-hover:bg-indigo-700 transition-colors shadow-md">
          <span>${getIconSvg(icon)}</span>
        </div>
        <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">${label}</span>
      </div>
    </button>
  `;
}

// Function to render activity items
function renderActivityItem(icon, title, description, time, color = "indigo") {
  return `
    <div class="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-200">
      <div class="bg-${color}-100 p-2 rounded-xl group-hover:bg-${color}-600 transition-colors border border-${color}-200 shadow-sm">
        <span class="text-${color}-600 group-hover:text-white transition-colors">${getIconSvg(icon, "w-5 h-5")}</span>
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">${title}</p>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${time}</span>
        </div>
        <p class="text-sm text-gray-500 mt-1">${description}</p>
      </div>
      <span class="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">${getIconSvg("ChevronRight", "w-4 h-4")}</span>
    </div>
  `;
}

// Function to render a menu item with direct SVG
function renderMenuItem(item, index, groupIndex) {
  const { icon, label, children, page } = item;
  const itemId = `menu-item-${groupIndex}-${index}`;
  const hasChildren = children && children.length > 0;
  const isActive = currentPage === page || (currentPage && currentPage.startsWith(page + '/'));
  const isSubmenuOpen = openSubmenuIndex === `${groupIndex}-${index}`;
  
  // Get the SVG for this icon, or use a fallback
  const iconSvg = svgIcons[icon] || svgIcons["Circle"];
  
  return `
    <div class="relative group" id="${itemId}">
      <button
        class="${isSidebarOpen ? 'w-full px-3 py-2.5' : 'w-10 h-10 mx-auto'} flex items-center ${isSidebarOpen ? '' : 'justify-center'} rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm' 
            : 'text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-600'
        }"
        data-group="${groupIndex}"
        data-index="${index}"
        data-page="${page}"
        onclick="handleMenuItemClick(${groupIndex}, ${index}, ${hasChildren}, '${page}')"
      >
        <span class="${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600 transition-colors'}">
          ${iconSvg.replace('class="w-5 h-5"', `class="w-5 h-5 ${!isSidebarOpen ? 'mx-auto' : ''}""`)}
        </span>
        
        ${isSidebarOpen ? `
          <span class="ml-3 text-sm font-medium truncate flex-1 text-left">
            ${label}
          </span>
          ${hasChildren ? `
            <span class="transition-transform ${isSubmenuOpen ? 'rotate-180 text-indigo-600' : 'text-gray-400'}">
              ${svgIcons["ChevronDown"]}
            </span>
          ` : ''}
        ` : ''}
      </button>

      ${!isSidebarOpen ? `
        <div class="absolute left-full top-0 ml-2 px-2 py-1 bg-indigo-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
          ${label}
          ${hasChildren ? `
            <span class="ml-1 text-amber-300">•</span>
          ` : ''}
        </div>
      ` : ''}
      
      ${hasChildren && isSubmenuOpen && isSidebarOpen ? `
        <div class="ml-11 mt-1 space-y-1 submenu submenu-${groupIndex}-${index} ${isSubmenuOpen ? 'open' : ''}">
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

// Function to render a menu group
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

// Function to toggle hamburger visibility
function toggleHamburgerVisibility(sidebarIsOpen) {
  const hamburger = document.getElementById('mobile-nav-toggle');
  if (hamburger) {
    if (sidebarIsOpen) {
      hamburger.classList.add('opacity-0', 'pointer-events-none');
    } else {
      hamburger.classList.remove('opacity-0', 'pointer-events-none');
    }
  }
}

// Function to render the sidebar
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  // First, make sure sidebar exists
  if (!sidebar) return;
  
  // Update sidebar width and position classes based on state
  if (isMobile) {
    sidebar.className = `bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col fixed top-0 h-screen z-40 ${
      isSidebarShowing ? 'left-0 w-64' : '-left-64 w-0'
    }`;
  } else {
    sidebar.className = `bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 h-screen z-40 ${
      isSidebarOpen ? 'w-64' : 'w-16'
    }`;
  }

  // Always render the sidebar content
  let sidebarHTML = `
    <!-- Header with modern design -->
    <div class="h-16 flex items-center justify-between px-3">
        ${isSidebarOpen ? `
            <div class="flex items-center ml-1 logo-container">
                <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="flex items-center justify-center text-amber-300">${svgIcons["Zap"]}</span>
                </div>
                <span class="ml-3 font-semibold text-gray-900">ERPNext</span>
            </div>
            <button 
                id="toggle-sidebar-close"
                class="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                aria-label="Collapse Sidebar"
            >
                <span class="flex items-center justify-center w-full h-full">${svgIcons["ChevronLeft"]}</span>
            </button>
        ` : `
            <button 
                id="toggle-sidebar-open"
                class="mx-auto flex items-center justify-center logo-container"
                aria-label="Expand Sidebar"
            >
                <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg hover:shadow-indigo-500/20 transition-shadow cursor-pointer">
                    <span class="text-amber-300">${svgIcons["Zap"]}</span>
                </div>
            </button>
        `}
    </div>
  `;

  // Add search if sidebar is expanded
  if (isSidebarOpen) {
    sidebarHTML += `
      <div class="p-3">
        <div class="relative">
          <span class="absolute left-3 top-1 -translate-y-1/2 text-gray-400">${svgIcons["Search"]}</span>
          <input
            type="text"
            placeholder="Search..."
            class="w-full py-2 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 pl-10 pr-4"
          />
        </div>
      </div>
    `;
  }

  // Add menu groups
  sidebarHTML += `
    <div class="flex-1 overflow-y-auto px-3 py-2">
      ${menuData.map((group, index) => renderMenuGroup(group, index)).join('')}
    </div>
  `;

  sidebar.innerHTML = sidebarHTML;
  sidebarContentInitialized = true;
  
  // Add event listeners
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

  // Update main content margin
  const mainContent = document.getElementById('main-content');
  if (isMobile) {
    mainContent.className = `transition-all duration-300 ease-in-out ml-0`;
  } else {
    mainContent.className = `transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-16'}`;
  }
  
  // Update header position
  const header = document.getElementById('header');
  if (header) {
    if (isMobile) {
      header.className = `h-16 bg-white border-b border-gray-200 fixed right-0 top-0 z-30 left-0 transition-all duration-300 ease-in-out`;
    } else {
      header.className = `h-16 bg-white border-b border-gray-200 fixed right-0 top-0 z-30 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'left-64' : 'left-16'
      }`;
    }
  }
}

// Function to generate a breadcrumb path based on current page
function generateBreadcrumbs(page) {
  // For home or main pages, don't show breadcrumbs
  if (page === 'home') {
    return [];
  }
  
  // For subpages, show parent -> current
  if (page && page.includes('/')) {
    const [parentPage, subpage] = page.split('/');
    
    let breadcrumbs = [];
    
    // Add parent page
    if (pages[parentPage]) {
      breadcrumbs.push({ 
        title: pages[parentPage].title, 
        page: parentPage 
      });
    }
    
    // Add subpage
    if (pages[page]) {
      breadcrumbs.push({ 
        title: pages[page].title, 
        page: page 
      });
    } else {
      // If specific subpage not found in pages, use formatted subpage name
      const subpageTitle = subpage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ 
        title: subpageTitle, 
        page: page 
      });
    }
    
    return breadcrumbs;
  }
  
  // For main pages, return empty array (no breadcrumbs)
  return [];
}

// Function to create a consistent module page template similar to home
function createModulePageTemplate(pageInfo, breadcrumbs, isSubpage, parentInfo) {
  const title = pageInfo.title;
  const icon = pageInfo.icon;
  
  // Generate breadcrumbs HTML
  const breadcrumbsHtml = breadcrumbs.length > 0 ? `
    <div class="flex items-center text-gray-500 text-sm mt-1">
      ${breadcrumbs.map((crumb, index) => {
        if (index === breadcrumbs.length - 1) {
          return `<span class="text-indigo-600 font-medium">${crumb.title}</span>`;
        } else {
          return `
            <span class="cursor-pointer hover:text-indigo-500 transition-colors" onclick="navigateToPage('${crumb.page}')">${crumb.title}</span>
            <span class="mx-1">${svgIcons["ChevronRight"].replace('class="w-5 h-5"', 'class="w-4 h-4"')}</span>
          `;
        }
      }).join('')}
    </div>
  ` : '';

  // Create the page template with home-like styling
  return `
    <!-- Modern Dashboard Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center">
        ${title}
        <span class="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
          ${isSubpage ? 'SUBMODULE' : 'MODULE'}
        </span>
      </h1>
      ${breadcrumbsHtml}
    </div>

    <!-- Modernized Banner with Gradient -->
    <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-6 shadow-lg mb-8 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-400 opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-amber-300 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-4">
          <div class="bg-white/15 p-2 rounded-xl backdrop-blur-sm">
            <span class="text-amber-300">${getIconSvg(icon, "w-6 h-6")}</span>
          </div>
          <h1 class="text-white text-2xl font-bold">${title}</h1>
        </div>
        <p class="text-indigo-100 text-lg mb-6">${
          isSubpage 
            ? `${title} Submodule of ${parentInfo.title} Module` 
            : `${title} Management Module`
        }</p>
        <div class="flex gap-3">
          <button class="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors shadow-md">
            View ${title} Reports
          </button>
          <button class="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors border border-indigo-500 shadow-md">
            Quick Actions
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      ${renderQuickAction('Plus', 'Create New')}
      ${renderQuickAction(icon, `Add ${title}`)}
      ${renderQuickAction('FileText', 'Reports')}
      ${renderQuickAction('Settings', 'Settings')}
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${renderStatCard('BarChart2', `Total ${title}`, '842', 'up', '6.8%', 'Compared to last month')}
      ${renderStatCard('Activity', 'Activity Rate', '78%', 'up', '3.2%', '18 new activities this month')}
      ${renderStatCard('TrendingUp', 'Growth Rate', '12.5%', 'up', '2.1%', 'Steady increase')}
      ${renderStatCard('Calendar', 'Upcoming Tasks', '23', 'down', '5.3%', '4 tasks due today')}
    </div>

    <!-- Recent Activity and Tasks -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-600 p-2 rounded-lg shadow-md">
              <span class="text-white">${getIconSvg("Bell", "w-4 h-4")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Recent Activity</h3>
          </div>
          <button class="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 border border-indigo-100">
            View All
          </button>
        </div>
        <div class="space-y-1">
          ${renderActivityItem('CheckCircle', `New ${title} created`, `${title} #1234 - Recent update`, '2m ago', 'emerald')}
          ${renderActivityItem('Bell', 'Update received', 'Status changes applied to records', '15m ago', 'indigo')}
          ${renderActivityItem('AlertCircle', 'Attention needed', 'Review required for specific items', '1h ago', 'amber')}
          ${renderActivityItem('Clock', 'Scheduled update', 'System maintenance planned', '2h ago', 'indigo')}
        </div>
      </div>

      <!-- Tasks & Reminders -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-600 p-2 rounded-lg shadow-md">
              <span class="text-white">${getIconSvg("Calendar", "w-4 h-4")}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Tasks & Reminders</h3>
          </div>
          <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
            <span class="text-gray-500">${getIconSvg("Settings", "w-4 h-4")}</span>
          </button>
        </div>
        
        <div class="space-y-4">
          ${[
            {
              task: `Review ${title} report`,
              due: "2 hours",
              priority: "Priority",
              priorityColor: "amber"
            },
            {
              task: "Follow up with clients",
              due: "tomorrow",
              priority: "Regular",
              priorityColor: "indigo"
            },
            {
              task: "Update documentation",
              due: "3 days",
              priority: "Planning",
              priorityColor: "indigo"
            }
          ].map((item) => `
            <div class="p-4 border border-gray-100 rounded-xl hover:border-indigo-300 transition-colors cursor-pointer group hover:shadow-sm">
              <div class="flex items-center mb-2">
                <input type="checkbox" class="rounded border-gray-300 text-indigo-600 mr-2 w-4 h-4" />
                <h4 class="text-sm font-medium text-gray-800 group-hover:text-indigo-600">${item.task}</h4>
              </div>
              <div class="flex items-center justify-between ml-6">
                <span class="text-xs text-gray-500">Due in ${item.due}</span>
                <span class="px-2 py-1 text-xs bg-${item.priorityColor}-50 text-${item.priorityColor}-600 rounded-full">
                  ${item.priority}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <button class="w-full mt-4 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-200">
          + Add New Task
        </button>
      </div>
    </div>
  `;
}

// Function to navigate to a page
function navigateToPage(page) {
  currentPage = page;
  
  // Get breadcrumbs
  const breadcrumbs = generateBreadcrumbs(page);
  
  // Update page content
  const dashboardContent = document.getElementById('dashboard-content');
  
  // Get page info - handle both parent pages and subpages
  let pageInfo = pages[page];
  let parentInfo = null;
  let isSubpage = false;
  
  if (!pageInfo && page.includes('/')) {
    // This is a subpage
    isSubpage = true;
    const [parentPage, subpage] = page.split('/');
    parentInfo = pages[parentPage];
    
    // Check if there's a specific subpage entry
    pageInfo = pages[page];
    
    // If not, create one based on the parent and subpage name
    if (!pageInfo && parentInfo) {
      const subpageTitle = subpage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      pageInfo = {
        title: subpageTitle,
        icon: parentInfo.icon,
        parent: parentPage
      };
    }
  }
  
  if (page === 'home') {
    // For home page, we load the dashboard (already implemented)
    if (typeof renderDashboard === 'function') {
      renderDashboard();
    } else {
      dashboardContent.innerHTML = `
        <div class="text-center py-20">
          <h2 class="text-3xl font-bold text-gray-700 mb-4">Welcome to ERPNext Dashboard</h2>
          <p class="text-gray-500">Your enterprise resource planning system</p>
        </div>
      `;
    }
  } else if (pageInfo) {
    // Use our consistent module page template for all non-home pages
    dashboardContent.innerHTML = createModulePageTemplate(pageInfo, breadcrumbs, isSubpage, parentInfo);
  } else {
    // If page doesn't exist, show 404-like message with consistent styling
    dashboardContent.innerHTML = `
      <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-10 shadow-lg my-8 text-center">
        <div class="text-white text-6xl font-bold mb-4">404</div>
        <h2 class="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p class="text-indigo-200 mb-6">The requested page "${page}" does not exist.</p>
        <button 
          class="px-6 py-3 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium shadow-lg"
          onclick="navigateToPage('home')"
        >
          Back to Home
        </button>
      </div>
    `;
  }
  
  // Re-render sidebar to update active state
  renderSidebar();
}

// Function to handle main menu item click
function handleMenuItemClick(groupIndex, index, hasChildren, page) {
  if (hasChildren) {
    // Toggle submenu
    const submenuId = `${groupIndex}-${index}`;
    openSubmenuIndex = openSubmenuIndex === submenuId ? null : submenuId;
    renderSidebar();
  } else {
    // If it's a regular page link, navigate to that page
    navigateToPage(page);
    
    // If sidebar is collapsed and menu item clicked, expand sidebar
    if (!isSidebarOpen) {
      isSidebarOpen = true;
      renderSidebar();
    }
  }
}

// Function to handle submenu item click
function handleSubmenuItemClick(parentPage, subPage) {
  // Navigate to the specific subpage
  navigateToPage(`${parentPage}/${subPage}`);
}

function toggleSidebar() {
  if (!isMobile) {
    // Desktop behavior remains unchanged
    isSidebarOpen = !isSidebarOpen;
    
    if (!isSidebarOpen) {
      openSubmenuIndex = null;
    }
    
    renderSidebar();
  } else {
    // Mobile behavior - toggle visibility without changing content
    isSidebarShowing = !isSidebarShowing;
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const mainContent = document.getElementById('main-content');
    const header = document.getElementById('header');
    
    if (isSidebarShowing) {
      // Show sidebar
      sidebar.classList.remove('-left-64');
      sidebar.classList.add('left-0', 'w-64');
      
      // Show overlay
      if (!overlay) {
        createMobileOverlay();
      } else {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-50');
      }
      
      // Prevent body scrolling when sidebar is open
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');
      
      // Add sidebar-open class to main content and header
      mainContent.classList.add('sidebar-open');
      header.classList.add('sidebar-open');
      
      // Hide hamburger
      toggleHamburgerVisibility(true);
    } else {
      // Hide sidebar
      sidebar.classList.remove('left-0');
      sidebar.classList.add('-left-64');
      
      // Hide overlay
      if (overlay) {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-50');
      }
      
      // Restore body scrolling
      document.body.classList.remove('overflow-hidden');
      
      // Remove sidebar-open class from main content and header
      mainContent.classList.remove('sidebar-open');
      header.classList.remove('sidebar-open');
      
      // Show hamburger
      toggleHamburgerVisibility(false);
    }
  }
}

// Create a semi-transparent overlay for mobile sidebar
function createMobileOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'mobile-overlay';
  overlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity duration-300 md:hidden';
  
  // Close sidebar when tapping the overlay
  overlay.addEventListener('click', toggleSidebar);
  document.body.appendChild(overlay);
}

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
  const wasMobile = isMobile;
  isMobile = window.innerWidth < 768;
  
  // When switching between mobile and desktop modes
  if (wasMobile !== isMobile) {
    // Hide overlay when switching to desktop
    if (!isMobile) {
      const overlay = document.getElementById('mobile-overlay');
      if (overlay) {
        overlay.classList.add('opacity-0', 'pointer-events-none');
      }
      document.body.classList.remove('overflow-hidden');
      
      // Reset sidebar states for desktop
      isSidebarShowing = false;
    } else {
      // When going to mobile, reset mobile states
      isSidebarShowing = false;
    }
    
    renderSidebar();
  }
});

// Modified initialization
document.addEventListener('DOMContentLoaded', () => {
  isMobile = window.innerWidth < 768;
  renderSidebar();
  navigateToPage('home'); // Start with home page
});

// Additional function to update the sidebar header specifically for mobile
function renderMobileSidebarHeader() {
  // Get the sidebar header container
  const sidebarHeaderContainer = document.querySelector('#sidebar .h-16');
  if (!sidebarHeaderContainer) return;
  
  // Create a better mobile sidebar header with a close button
  sidebarHeaderContainer.innerHTML = `
    <div class="flex items-center px-4 h-full">
      <div class="flex items-center">
        <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
          <span class="flex items-center justify-center text-amber-300">${svgIcons["Zap"]}</span>
        </div>
        <span class="ml-3 font-semibold text-gray-900">ERPNext</span>
      </div>
      <button 
        id="toggle-sidebar-close"
        class="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
        aria-label="Close Sidebar"
      >
        <span class="flex items-center justify-center">${svgIcons["X"]}</span>
      </button>
    </div>
  `;
  
  // Add event listener to the close button
  const closeButton = document.getElementById('toggle-sidebar-close');
  if (closeButton) {
    closeButton.addEventListener('click', toggleSidebar);
  }
}

// Add this to your existing toggleSidebar function for the mobile part:
if (isMobile && isSidebarShowing) {
  // After showing the sidebar, update the header
  setTimeout(renderMobileSidebarHeader, 50);
}

// Make sure to add the "X" icon to your svgIcons dictionary if it's not already there:
svgIcons["X"] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';