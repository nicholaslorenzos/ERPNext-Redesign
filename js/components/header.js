let notificationsOpen = false;
let profileOpen = false;
let searchOpen = false;
let isDark = false;

// Notification data - would connect to backend in real implementation
const notifications = [
  {
    id: 1,
    type: 'order',
    title: 'New order received',
    message: 'Order #1234 from John Doe',
    time: '2 minutes ago',
    read: false,
    icon: 'ShoppingCart',
    color: 'indigo'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment processed',
    message: 'Invoice #5678 - $2,340',
    time: '15 minutes ago',
    read: false,
    icon: 'CheckCircle',
    color: 'green'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Low stock alert',
    message: 'Item ID #420 running low',
    time: '1 hour ago',
    read: true,
    icon: 'AlertCircle',
    color: 'amber'
  }
];

// Search suggestions data - would be dynamic in real implementation
const searchSuggestions = [
  { type: 'recent', text: 'Recent Orders', icon: 'ShoppingCart' },
  { type: 'recent', text: 'Inventory Reports', icon: 'FileText' },
  { type: 'recent', text: 'Customer #1234', icon: 'User' },
  { type: 'command', text: 'Create New Order', icon: 'Plus' },
  { type: 'command', text: 'Add Customer', icon: 'UserPlus' },
  { type: 'command', text: 'View Reports', icon: 'BarChart2' },
];

function renderHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    renderMobileHeader();
  } else {
    renderDesktopHeader();
  }

  // Setup global listeners for closing menus when clicking outside
  setupGlobalListeners();
}

function renderDesktopHeader() {
  const header = document.getElementById('header');
  
  const headerHTML = `
    <div class="h-full flex items-center justify-between px-12">
      <!-- Left side - Workspace Actions -->
      <div class="flex items-center gap-2">
        <button class="btn btn-primary ${window.innerWidth < 1024 ? 'icon-only' : ''}" title="Create a new workspace" aria-label="Create Workspace">
          <span class="icon">${getIconSvg("Plus", "w-4 h-4")}</span>
          ${window.innerWidth < 1110 ? '' : '<span class="font-medium text-sm">Create Workspace</span>'}
        </button>
        <button class="btn btn-secondary ${window.innerWidth < 1024 ? 'icon-only' : ''}" title="Edit current workspace" aria-label="Edit Workspace">
          <span class="icon">${getIconSvg("Pencil", "w-4 h-4")}</span>
          ${window.innerWidth < 1110 ? '' : '<span class="font-medium text-sm">Edit</span>'}
        </button>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <!-- Search Bar -->
        <div class="relative group" id="search-container">
          ${
            window.innerWidth < 1110 ?
            `<button 
              id="search-toggle" 
              class="header-action-btn search-icon-only ${searchOpen ? 'active' : ''}" 
              title="Search"
              aria-label="Search"
              aria-expanded="${searchOpen}"
              ${searchOpen ? 'aria-controls="search-dropdown"' : ''}
            >
              ${getIconSvg("Search", "w-5 h-5")}
            </button>` :
            `<div class="search-input-container ${searchOpen ? 'search-active' : ''}">
              <span class="search-icon" aria-hidden="true">
                ${getIconSvg("Search", "w-5 h-5")}
              </span>
              <input
                id="header-search"
                type="text"
                placeholder="Search or type a command"
                class="search-input"
                aria-label="Search"
                aria-expanded="${searchOpen}"
                ${searchOpen ? 'aria-controls="search-dropdown"' : ''}
                autocomplete="off"
              />
              <div class="shortcut-hint" aria-hidden="true">⌘G</div>
            </div>`
          }
          ${searchOpen ? renderSearchDropdown() : ''}
        </div>

        <!-- Action Buttons -->
        <div class="header-actions">
          <!-- Theme Toggle -->
          <button 
            id="theme-toggle" 
            class="header-action-btn" 
            title="${isDark ? 'Switch to light theme' : 'Switch to dark theme'}"
            aria-label="${isDark ? 'Light Mode' : 'Dark Mode'}"
          >
            ${isDark ? getIconSvg("Sun", "w-5 h-5") : getIconSvg("Moon", "w-5 h-5")}
          </button>
          
          <!-- Notifications -->
          <div class="relative">
            <button 
              id="notifications-toggle" 
              class="header-action-btn ${notificationsOpen ? 'active' : ''}" 
              title="Notifications"
              aria-label="Notifications"
              aria-expanded="${notificationsOpen}"
              ${notificationsOpen ? 'aria-controls="notifications-dropdown"' : ''}
            >
              ${getIconSvg("Bell", "w-5 h-5")}
              ${hasUnreadNotifications() ? '<span class="notification-badge"></span>' : ''}
            </button>
            
            ${notificationsOpen ? renderNotificationsDropdown() : ''}
          </div>
          
          <!-- Help -->
          <button 
            class="header-action-btn" 
            title="Help and Resources"
            aria-label="Help"
          >
            ${getIconSvg("HelpCircle", "w-5 h-5")}
          </button>
          
          <!-- User Profile -->
          <div class="relative">
            <button 
              id="profile-toggle" 
              class="profile-btn ${profileOpen ? 'active' : ''}" 
              title="Your account"
              aria-label="Your Profile"
              aria-expanded="${profileOpen}"
              ${profileOpen ? 'aria-controls="profile-dropdown"' : ''}
            >
              <div class="avatar">A</div>
              ${getIconSvg("ChevronDown", "w-4 h-4 text-gray-600")}
            </button>
            
            ${profileOpen ? renderProfileDropdown() : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  header.innerHTML = headerHTML;

  // Set up event listeners
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('notifications-toggle')?.addEventListener('click', toggleNotifications);
  document.getElementById('profile-toggle')?.addEventListener('click', toggleProfile);
  document.getElementById('header-search')?.addEventListener('focus', handleSearchFocus);
  document.getElementById('header-search')?.addEventListener('keyup', handleSearchInput);
  document.getElementById('search-toggle')?.addEventListener('click', () => {
    searchOpen = !searchOpen;
    renderHeader();
  });
}

function renderMobileHeader() {
  const header = document.getElementById('header');
  if (!header || window.innerWidth >= 768) {
    renderDesktopHeader();
    return;
  }

  const headerHTML = `
    <div class="h-full flex items-center ${window.isSidebarShowing ? 'justify-end' : 'justify-between'} px-4">
      <!-- Left: Hamburger and ERPNext (hide both when sidebar open) -->
      ${window.isSidebarShowing ? '' : `
        <div class="flex items-center space-x-2">
          <button 
            id="mobile-nav-toggle" 
            class="p-2 text-gray-600 hover:text-indigo-600 transition-colors" 
            title="Menu"
            aria-label="Open Menu"
          >
            ${getIconSvg("Menu", "w-5 h-5")}
          </button>
          <div class="flex items-center">
            <span class="font-semibold text-gray-900 text-base" style="line-height: 20px;">ERPNext</span>
          </div>
        </div>
      `}

      <!-- Right: Search, Notifications, Profile -->
      <div class="flex items-center space-x-1">
        <button 
          id="mobile-search-toggle" 
          class="mobile-header-btn ${searchOpen ? 'active' : ''}" 
          title="Search"
          aria-label="Search"
        >
          ${getIconSvg("Search", "w-5 h-5")}
        </button>
        <button 
          id="mobile-notifications-toggle" 
          class="mobile-header-btn ${notificationsOpen ? 'active' : ''}" 
          title="Notifications"
          aria-label="Notifications"
          aria-expanded="${notificationsOpen}"
        >
          ${getIconSvg("Bell", "w-5 h-5")}
          ${hasUnreadNotifications() ? '<span class="notification-badge"></span>' : ''}
        </button>
        <button 
          id="mobile-profile-toggle" 
          class="flex items-center p-1 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors" 
          title="Your account"
          aria-label="Your Profile"
          aria-expanded="${profileOpen}"
        >
          <div class="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">A</div>
        </button>
      </div>
    </div>

    <!-- Mobile Search Drawer -->
    <div id="mobile-search-drawer" class="${searchOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200 p-4 z-20 animate-fadeIn">
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          ${getIconSvg("Search", "w-5 h-5")}
        </span>
        <input
          id="mobile-search-input"
          type="text"
          placeholder="Search anything..."
          class="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          autocomplete="off"
        />
        <button 
          id="close-mobile-search" 
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close Search"
        >
          ${getIconSvg("X", "w-5 h-5")}
        </button>
      </div>
      
      <div class="mt-3">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-semibold text-gray-500 uppercase">Recent Searches</h3>
          <button class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Clear All</button>
        </div>
        <div class="space-y-2">
          ${renderMobileSearchSuggestions()}
        </div>
      </div>
    </div>
  `;

  header.innerHTML = headerHTML;
  
  // Set up mobile event listeners
  document.getElementById('mobile-nav-toggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('mobile-search-toggle')?.addEventListener('click', toggleMobileSearch);
  document.getElementById('close-mobile-search')?.addEventListener('click', toggleMobileSearch);
  document.getElementById('mobile-notifications-toggle')?.addEventListener('click', toggleMobileNotifications);
  document.getElementById('mobile-profile-toggle')?.addEventListener('click', toggleMobileProfile);
}

function renderSearchDropdown() {
  return `
    <div id="search-dropdown" class="dropdown search-dropdown animate-fadeIn" role="listbox">
      <div class="p-2 border-b border-gray-100">
        <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span>${getIconSvg("Clock", "w-3 h-3")}</span>
          <span>Recent Searches</span>
        </div>
        ${searchSuggestions.filter(item => item.type === 'recent').map((item, index) => `
          <button class="search-item" role="option" aria-selected="false">
            <span class="search-item-icon">${getIconSvg(item.icon, "w-4 h-4")}</span>
            <span class="search-item-text">${item.text}</span>
          </button>
        `).join('')}
      </div>
      <div class="p-2">
        <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span>${getIconSvg("Zap", "w-3 h-3")}</span>
          <span>Quick Actions</span>
        </div>
        ${searchSuggestions.filter(item => item.type === 'command').map((item, index) => `
          <button class="search-item" role="option" aria-selected="false">
            <span class="search-item-icon">${getIconSvg(item.icon, "w-4 h-4")}</span>
            <span class="search-item-text">${item.text}</span>
          </button>
        `).join('')}
      </div>
      <div class="p-2 border-t border-gray-100 text-center">
        <span class="text-xs text-gray-500">Press <kbd class="kbd">↑</kbd> <kbd class="kbd">↓</kbd> to navigate, <kbd class="kbd">Enter</kbd> to select</span>
      </div>
    </div>
  `;
}

function renderNotificationsDropdown() {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return `
    <div id="notifications-dropdown" class="dropdown notifications-dropdown animate-fadeIn" role="menu">
      <div class="p-3 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-semibold text-gray-900">Notifications</h3>
        <span class="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">Mark all as read</span>
      </div>
      <div class="max-h-80 overflow-y-auto p-1">
        ${notifications.length === 0 ? `
          <div class="flex flex-col items-center justify-center py-6 text-center">
            <div class="bg-gray-100 p-3 rounded-full mb-2">
              ${getIconSvg("Bell", "w-6 h-6 text-gray-400")}
            </div>
            <p class="text-gray-500 text-sm">No notifications</p>
          </div>
        ` : 
        notifications.map(notification => `
          <div class="notification-item ${!notification.read ? 'unread' : ''}" role="menuitem">
            <div class="notification-icon bg-${notification.color}-100 text-${notification.color}-600">
              ${getIconSvg(notification.icon, "w-4 h-4")}
            </div>
            <div class="notification-content">
              <p class="notification-title">${notification.title}</p>
              <p class="notification-message">${notification.message}</p>
              <p class="notification-time">${notification.time}</p>
            </div>
            <button class="notification-action" aria-label="More options">
              ${getIconSvg("MoreVertical", "w-4 h-4")}
            </button>
          </div>
        `).join('')}
      </div>
      <div class="p-2 border-t border-gray-100">
        <button class="w-full text-center py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  `;
}

function renderProfileDropdown() {
  return `
    <div id="profile-dropdown" class="dropdown profile-dropdown animate-fadeIn" role="menu">
      <div class="p-3 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="avatar-lg">A</div>
          <div>
            <p class="text-sm font-medium text-gray-900">Admin User</p>
            <p class="text-xs text-gray-500 mt-0.5">admin@example.com</p>
          </div>
        </div>
      </div>
      <div class="p-1">
        <button class="profile-menu-item" role="menuitem">
          <span class="profile-menu-icon">${getIconSvg("User", "w-4 h-4")}</span>
          Your Profile
        </button>
        <button class="profile-menu-item" role="menuitem">
          <span class="profile-menu-icon">${getIconSvg("Settings", "w-4 h-4")}</span>
          Settings
        </button>
        <button class="profile-menu-item" role="menuitem">
          <span class="profile-menu-icon">${getIconSvg("HelpCircle", "w-4 h-4")}</span>
          Help & Support
        </button>
      </div>
      <div class="border-t border-gray-100 p-1">
        <button class="profile-menu-item text-rose-600" role="menuitem">
          <span class="profile-menu-icon text-rose-600">${getIconSvg("LogOut", "w-4 h-4")}</span>
          Sign out
        </button>
      </div>
    </div>
  `;
}

function renderMobileSearchSuggestions() {
  return searchSuggestions.slice(0, 4).map(item => `
    <button class="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg text-left transition-colors">
      <span class="bg-indigo-100 text-indigo-600 p-2 rounded-full">${getIconSvg(item.icon, "w-4 h-4")}</span>
      <span class="text-sm text-gray-700">${item.text}</span>
    </button>
  `).join('');
}

function toggleNotifications(e) {
  if (e) e.stopPropagation();
  notificationsOpen = !notificationsOpen;
  if (profileOpen) profileOpen = false;
  if (searchOpen) searchOpen = false;
  renderHeader();
}

function toggleProfile(e) {
  if (e) e.stopPropagation();
  profileOpen = !profileOpen;
  if (notificationsOpen) notificationsOpen = false;
  if (searchOpen) searchOpen = false;
  renderHeader();
}

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.classList.toggle('dark-theme', isDark);
  renderHeader();
}

function toggleMobileSearch() {
  searchOpen = !searchOpen;
  if (notificationsOpen) notificationsOpen = false;
  if (profileOpen) profileOpen = false;
  renderHeader();
  if (searchOpen) {
    setTimeout(() => {
      document.getElementById('mobile-search-input')?.focus();
    }, 100);
  }
}

function toggleMobileNotifications(e) {
  if (e) e.stopPropagation();
  notificationsOpen = !notificationsOpen;
  if (profileOpen) profileOpen = false;
  if (searchOpen) searchOpen = false;
  renderHeader();
}

function toggleMobileProfile(e) {
  if (e) e.stopPropagation();
  profileOpen = !profileOpen;
  if (notificationsOpen) notificationsOpen = false;
  if (searchOpen) searchOpen = false;
  renderHeader();
}

function handleSearchFocus() {
  searchOpen = true;
  renderHeader();
}

function handleSearchInput(e) {
  // Here you would implement actual search functionality
  // For now we just keep the search dropdown open
  searchOpen = true;
}

function hasUnreadNotifications() {
  return notifications.some(notification => !notification.read);
}

function setupGlobalListeners() {
  // Global click handler to close menus when clicking outside
  document.addEventListener('click', (event) => {
    const notificationsToggle = document.getElementById('notifications-toggle');
    const notificationsDropdown = document.getElementById('notifications-dropdown');
    const profileToggle = document.getElementById('profile-toggle');
    const profileDropdown = document.getElementById('profile-dropdown');
    const searchContainer = document.getElementById('search-container');
    const searchDropdown = document.getElementById('search-dropdown');
    
    // Handle desktop dropdowns
    if (notificationsOpen && 
        notificationsToggle && 
        notificationsDropdown && 
        !notificationsToggle.contains(event.target) && 
        !notificationsDropdown.contains(event.target)) {
      notificationsOpen = false;
      renderHeader();
    }
    
    if (profileOpen && 
        profileToggle && 
        profileDropdown && 
        !profileToggle.contains(event.target) && 
        !profileDropdown.contains(event.target)) {
      profileOpen = false;
      renderHeader();
    }
    
    if (searchOpen && 
        searchContainer && 
        searchDropdown && 
        !searchContainer.contains(event.target)) {
      searchOpen = false;
      renderHeader();
    }
    
    // Handle mobile toggles
    const mobileNotificationsToggle = document.getElementById('mobile-notifications-toggle');
    const mobileProfileToggle = document.getElementById('mobile-profile-toggle');
    const mobileSearchDrawer = document.getElementById('mobile-search-drawer');
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    
    if (notificationsOpen && 
        mobileNotificationsToggle && 
        !mobileNotificationsToggle.contains(event.target)) {
      notificationsOpen = false;
      renderHeader();
    }
    
    if (profileOpen && 
        mobileProfileToggle && 
        !mobileProfileToggle.contains(event.target)) {
      profileOpen = false;
      renderHeader();
    }
    
    if (searchOpen && 
        mobileSearchDrawer && 
        mobileSearchToggle && 
        !mobileSearchDrawer.contains(event.target) && 
        !mobileSearchToggle.contains(event.target)) {
      // Don't close search drawer when clicking inside it
      if (!mobileSearchDrawer.contains(event.target)) {
        searchOpen = false;
        renderHeader();
      }
    }
  });

  // Keyboard shortcut for search
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'g') {
      event.preventDefault();
      const searchInput = document.getElementById('header-search') || document.getElementById('mobile-search-input');
      searchOpen = true;
      renderHeader();
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 10);
      }
    }
    
    // Close dropdowns on Escape key
    if (event.key === 'Escape') {
      if (notificationsOpen || profileOpen || searchOpen) {
        notificationsOpen = false;
        profileOpen = false;
        searchOpen = false;
        renderHeader();
      }
    }
  });
}

// Add these functions to header.js

/**
 * Improved event listeners setup with better organization
 */
function setupHeaderEventListeners() {
  // Cache DOM references
  const themeToggle = document.getElementById('theme-toggle');
  const notificationsToggle = document.getElementById('notifications-toggle');
  const profileToggle = document.getElementById('profile-toggle');
  const headerSearch = document.getElementById('header-search');
  const searchToggle = document.getElementById('search-toggle');
  
  // Add event listeners only if elements exist
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (notificationsToggle) notificationsToggle.addEventListener('click', toggleNotifications);
  if (profileToggle) profileToggle.addEventListener('click', toggleProfile);
  
  if (headerSearch) {
    headerSearch.addEventListener('focus', handleSearchFocus);
    headerSearch.addEventListener('keyup', handleSearchInput);
  }
  
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchOpen = !searchOpen;
      renderHeader();
    });
  }
  
  // Mobile-specific elements
  const mobileSearchToggle = document.getElementById('mobile-search-toggle');
  const closeMobileSearch = document.getElementById('close-mobile-search');
  const mobileNotificationsToggle = document.getElementById('mobile-notifications-toggle');
  const mobileProfileToggle = document.getElementById('mobile-profile-toggle');
  
  if (mobileSearchToggle) mobileSearchToggle.addEventListener('click', toggleMobileSearch);
  if (closeMobileSearch) closeMobileSearch.addEventListener('click', toggleMobileSearch);
  if (mobileNotificationsToggle) mobileNotificationsToggle.addEventListener('click', toggleMobileNotifications);
  if (mobileProfileToggle) mobileProfileToggle.addEventListener('click', toggleMobileProfile);
}

/**
 * Modify renderHeader function to call setupHeaderEventListeners at the end
 */
function renderHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    renderMobileHeader();
  } else {
    renderDesktopHeader();
  }

  // Call our new function instead of inline setup
  setupHeaderEventListeners();
  setupGlobalListeners();
}

/**
 * Improve outside click handling
 */
function setupGlobalListeners() {
  // Remove any existing document click listeners to prevent duplicates
  document.removeEventListener('click', handleOutsideClicks);
  document.removeEventListener('keydown', handleKeyboardShortcuts);
  
  // Add optimized listeners
  document.addEventListener('click', handleOutsideClicks);
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Centralized handler for outside clicks on dropdowns
 */
function handleOutsideClicks(event) {
  // Handle desktop dropdowns
  const dropdowns = [
    {
      isOpen: notificationsOpen,
      toggle: 'notifications-toggle',
      dropdown: 'notifications-dropdown',
      setter: (value) => { notificationsOpen = value; }
    },
    {
      isOpen: profileOpen,
      toggle: 'profile-toggle',
      dropdown: 'profile-dropdown',
      setter: (value) => { profileOpen = value; }
    },
    {
      isOpen: searchOpen,
      toggle: 'search-toggle',
      dropdown: 'search-dropdown',
      container: 'search-container',
      setter: (value) => { searchOpen = value; }
    }
  ];
  
  let needsRerender = false;
  
  dropdowns.forEach(item => {
    if (!item.isOpen) return;
    
    const toggleEl = document.getElementById(item.toggle);
    const dropdownEl = document.getElementById(item.dropdown);
    const containerEl = item.container ? document.getElementById(item.container) : null;
    
    // If the click is outside both the toggle element and dropdown content
    if ((toggleEl && !toggleEl.contains(event.target)) && 
        (dropdownEl && !dropdownEl.contains(event.target)) &&
        (!containerEl || !containerEl.contains(event.target))) {
      item.setter(false);
      needsRerender = true;
    }
  });
  
  // Handle search input specifically (for both mobile and desktop)
  const searchContainer = document.querySelector('.search-input-container');
  if (searchOpen && searchContainer && !searchContainer.contains(event.target)) {
    searchOpen = false;
    needsRerender = true;
  }
  
  // Only render once if multiple dropdowns need to close
  if (needsRerender) {
    renderHeader();
  }
}

/**
 * Centralized handler for keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
  // Search shortcut (Cmd/Ctrl + G)
  if ((event.metaKey || event.ctrlKey) && event.key === 'g') {
    event.preventDefault();
    searchOpen = true;
    renderHeader();
    setTimeout(() => {
      const searchInput = document.getElementById('header-search') || document.getElementById('mobile-search-input');
      if (searchInput) searchInput.focus();
    }, 10);
  }
  
  // Close dropdowns on Escape key
  if (event.key === 'Escape') {
    if (notificationsOpen || profileOpen || searchOpen) {
      notificationsOpen = false;
      profileOpen = false;
      searchOpen = false;
      renderHeader();
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderHeader);
window.addEventListener('resize', renderHeader);
