// Header state
let notificationsOpen = false;
let profileOpen = false;
let isDark = false;

// Function to render the header
function renderHeader() {
  const header = document.getElementById('header');
  
  const headerHTML = `
    <div class="h-full flex items-center justify-between px-12">
      <!-- Left side - Workspace Actions -->
      <div class="flex items-center gap-3">
        <button class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <span class="mr-2 flex items-center">${getIconSvg("Plus", "w-4 h-4")}</span>
          <span class="font-medium text-sm">Create Workspace</span>
        </button>
        <button class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <span class="mr-2 flex items-center">${getIconSvg("Pencil", "w-4 h-4")}</span>
          <span class="font-medium text-sm">Edit</span>
        </button>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <!-- Search Bar -->
        <div class="w-64 lg:w-96">
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ${getIconSvg("Search", "w-5 h-5")}
            </span>
            <input
              id="header-search"
              type="text"
              placeholder="Search or type a command (⌘ + G)"
              class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 px-1.5 py-0.5 rounded text-xs text-gray-600">
              ⌘G
            </div>
          </div>
        </div>

        <!-- Right Side Icons -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button 
            id="theme-toggle"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle theme"
          >
            ${isDark ? 
              getIconSvg("Moon", "w-5 h-5") : 
              getIconSvg("Sun", "w-5 h-5")
            }
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button 
              id="notifications-toggle"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              title="Notifications"
            >
              ${getIconSvg("Bell", "w-5 h-5")}
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            ${notificationsOpen ? `
              <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900">Notifications</h3>
                  <span class="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">Mark all as read</span>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-2 border-indigo-500">
                    <div class="flex items-start">
                      <div class="bg-indigo-100 p-1.5 rounded-lg text-indigo-600 mr-3">
                        ${getIconSvg("ShoppingCart", "w-4 h-4")}
                      </div>
                      <div class="flex-1">
                        <p class="text-sm text-gray-800">New order received</p>
                        <p class="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-2 border-transparent">
                    <div class="flex items-start">
                      <div class="bg-green-100 p-1.5 rounded-lg text-green-600 mr-3">
                        ${getIconSvg("CheckCircle", "w-4 h-4")}
                      </div>
                      <div class="flex-1">
                        <p class="text-sm text-gray-800">Payment processed</p>
                        <p class="text-xs text-gray-500 mt-1">15 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-gray-100 mt-1">
                  <button class="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Help -->
          <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Help">
            ${getIconSvg("HelpCircle", "w-5 h-5")}
          </button>

          <!-- Profile -->
          <div class="relative">
            <button 
              id="profile-toggle"
              class="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              title="Your account"
            >
              <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              ${getIconSvg("ChevronDown", "w-4 h-4 text-gray-600")}
            </button>

            ${profileOpen ? `
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">Admin User</p>
                  <p class="text-xs text-gray-500">admin@example.com</p>
                </div>
                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span class="mr-2">${getIconSvg("Settings", "w-4 h-4")}</span>
                  Settings
                </button>
                <button class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span class="mr-2">${getIconSvg("LogOut", "w-4 h-4")}</span>
                  Sign out
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  header.innerHTML = headerHTML;
  
  // Add event listeners
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('notifications-toggle').addEventListener('click', toggleNotifications);
  document.getElementById('profile-toggle').addEventListener('click', toggleProfile);
}

// Toggle theme
function toggleTheme() {
  isDark = !isDark;
  renderHeader();
}

// Toggle notifications panel
function toggleNotifications() {
  notificationsOpen = !notificationsOpen;
  // Close profile panel if open
  if (profileOpen) profileOpen = false;
  renderHeader();
}

// Toggle profile panel
function toggleProfile() {
  profileOpen = !profileOpen;
  // Close notifications panel if open
  if (notificationsOpen) notificationsOpen = false;
  renderHeader();
}

// Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
  const notificationsButton = document.getElementById('notifications-toggle');
  const profileButton = document.getElementById('profile-toggle');
  
  if (notificationsOpen && notificationsButton && !notificationsButton.contains(event.target)) {
    notificationsOpen = false;
    renderHeader();
  }
  
  if (profileOpen && profileButton && !profileButton.contains(event.target)) {
    profileOpen = false;
    renderHeader();
  }
});

// Command+G shortcut handler for search
document.addEventListener('keydown', (event) => {
  // Check for Command (Mac) or Control (Windows/Linux) + G
  if ((event.metaKey || event.ctrlKey) && event.key === 'g') {
    event.preventDefault(); // Prevent default browser behavior
    
    // Focus on the search input
    const searchInput = document.getElementById('header-search');
    if (searchInput) {
      searchInput.focus();
    }
  }
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
});