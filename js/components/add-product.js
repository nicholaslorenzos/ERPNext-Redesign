// State variables to control form behavior
let createVariant = false;
let maintainStock = true;
let isFixedAsset = false;
let isModalOpen = false;

// Function to render the Add Product modal
function renderAddProductModal() {
  // Create the modal element if it doesn't exist
  let modalContainer = document.getElementById('add-product-modal');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'add-product-modal';
    document.body.appendChild(modalContainer);
  }

  // Modal HTML content
  const modalHTML = `
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 ${isModalOpen ? '' : 'hidden'}" id="modal-backdrop">
      <div class="bg-white rounded-xl w-full max-w-xl overflow-hidden shadow-xl transform transition-all mx-4">
        <!-- Modal Header -->
        <div class="bg-indigo-700 px-6 py-4 flex justify-between items-center">
          <h3 class="text-lg font-medium text-white flex items-center">
            <span class="mr-2">${getIconSvg("Package", "w-5 h-5")}</span>
            Add Product
          </h3>
          <button id="close-modal-btn" class="text-white hover:text-indigo-100 focus:outline-none">
            ${getIconSvg("X", "w-5 h-5")}
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form id="add-product-form" class="space-y-4">
            <!-- Variant Option -->
            <div class="flex items-center space-x-2 py-2">
              <input type="checkbox" id="create-variant" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                     ${createVariant ? 'checked' : ''}>
              <label for="create-variant" class="text-sm font-medium text-gray-700">Create Variant</label>
            </div>

            <!-- Conditional fields based on Create Variant -->
            ${createVariant ? `
              <!-- Item Template (shown when Create Variant is selected) -->
              <div class="form-group">
                <label for="item-template" class="block text-sm font-medium text-gray-700 mb-1">Item Template <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select id="item-template" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select Template</option>
                    <option value="template1">Electronic Device</option>
                    <option value="template2">Apparel</option>
                    <option value="template3">Furniture</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                    ${getIconSvg("ChevronDown", "w-4 h-4")}
                  </div>
                </div>
              </div>
            ` : `
              <!-- Fields shown when Create Variant is NOT selected -->
              <div class="form-group">
                <label for="item-code" class="block text-sm font-medium text-gray-700 mb-1">Item Code <span class="text-red-500">*</span></label>
                <input type="text" id="item-code" placeholder="Auto-generated if blank" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              
              <div class="form-group">
                <label for="item-name" class="block text-sm font-medium text-gray-700 mb-1">Item Name <span class="text-red-500">*</span></label>
                <input type="text" id="item-name" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              
              <div class="form-group">
                <label for="item-group" class="block text-sm font-medium text-gray-700 mb-1">Item Group <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select id="item-group" class="custom-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select Group</option>
                    <option value="group1">Electronics</option>
                    <option value="group2">Furniture</option>
                    <option value="group3">Office Supplies</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                    ${getIconSvg("ChevronDown", "w-4 h-4")}
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="default-uom" class="block text-sm font-medium text-gray-700 mb-1">Default Unit of Measure <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select id="default-uom" class="custom-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select UOM</option>
                    <option value="pcs">Piece</option>
                    <option value="kg">Kilogram</option>
                    <option value="m">Meter</option>
                    <option value="l">Liter</option>
                    <option value="box">Box</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                    ${getIconSvg("ChevronDown", "w-4 h-4")}
                  </div>
                </div>
              </div>
            `}

            <!-- Fixed Asset Option -->
            <div class="flex items-center space-x-2 py-2">
              <input type="checkbox" id="is-fixed-asset" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                     ${isFixedAsset ? 'checked' : ''}>
              <label for="is-fixed-asset" class="text-sm font-medium text-gray-700">Is Fixed Asset</label>
            </div>

            ${isFixedAsset ? `
              <!-- Asset Category (shown when Is Fixed Asset is selected) -->
              <div class="form-group">
                <label for="asset-category" class="block text-sm font-medium text-gray-700 mb-1">Asset Category <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select id="asset-category" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select Category</option>
                    <option value="cat1">Furniture and Fixtures</option>
                    <option value="cat2">Plant and Machinery</option>
                    <option value="cat3">Buildings</option>
                    <option value="cat4">Electronic Equipment</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-400">
                    ${getIconSvg("ChevronDown", "w-4 h-4")}
                  </div>
                </div>
              </div>
            ` : `
              <!-- Maintain Stock Option (hidden when Is Fixed Asset is selected) -->
              <div class="flex items-center space-x-2 py-2">
                <input type="checkbox" id="maintain-stock" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                       ${maintainStock ? 'checked' : ''}>
                <label for="maintain-stock" class="text-sm font-medium text-gray-700">Maintain Stock</label>
              </div>
              
              ${maintainStock ? `
                <!-- Opening Stock (shown when Maintain Stock is selected) -->
                <div class="form-group">
                  <label for="opening-stock" class="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label>
                  <input type="number" id="opening-stock" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              ` : ''}
            `}
            
            <!-- Standard Selling Rate (always shown) -->
            <div class="form-group">
              <label for="selling-rate" class="block text-sm font-medium text-gray-700 mb-1">Standard Selling Rate</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input type="number" step="0.01" id="selling-rate" class="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <button id="edit-full-form-btn" class="text-gray-700 font-medium text-sm hover:text-indigo-700 focus:outline-none flex items-center">
            <span class="mr-2">${getIconSvg("Edit", "w-4 h-4")}</span>
            Edit Full Form
          </button>
          <button id="save-product-btn" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
            <span class="mr-2">${getIconSvg("Save", "w-4 h-4")}</span>
            Save
          </button>
        </div>
      </div>
    </div>
  `;

  // Update the modal container content
  modalContainer.innerHTML = modalHTML;

  // Set up event listeners
  setupAddProductEventListeners();
}

// Function to setup event listeners for the Add Product modal
function setupAddProductEventListeners() {
  // Close modal button
  const closeModalBtn = document.getElementById('close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeAddProductModal);
  }

  // Modal backdrop click to close
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeAddProductModal();
      }
    });
  }

  // Create Variant checkbox
  const createVariantCheckbox = document.getElementById('create-variant');
  if (createVariantCheckbox) {
    createVariantCheckbox.addEventListener('change', (e) => {
      createVariant = e.target.checked;
      renderAddProductModal();
    });
  }

  // Is Fixed Asset checkbox
  const isFixedAssetCheckbox = document.getElementById('is-fixed-asset');
  if (isFixedAssetCheckbox) {
    isFixedAssetCheckbox.addEventListener('change', (e) => {
      isFixedAsset = e.target.checked;
      // If Fixed Asset is checked, hide Maintain Stock option
      if (isFixedAsset) {
        maintainStock = false;
      }
      renderAddProductModal();
    });
  }

  // Maintain Stock checkbox (only if visible)
  const maintainStockCheckbox = document.getElementById('maintain-stock');
  if (maintainStockCheckbox) {
    maintainStockCheckbox.addEventListener('change', (e) => {
      maintainStock = e.target.checked;
      renderAddProductModal();
    });
  }

  // Save button
  const saveBtn = document.getElementById('save-product-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveProduct);
  }

  // Edit Full Form button
  const editFullFormBtn = document.getElementById('edit-full-form-btn');
  if (editFullFormBtn) {
    editFullFormBtn.addEventListener('click', openFullForm);
  }
}

// Function to open the Add Product modal
function openAddProductModal() {
  isModalOpen = true;
  renderAddProductModal();
  document.body.classList.add('overflow-hidden'); // Prevent scrolling when modal is open
}

// Function to close the Add Product modal
function closeAddProductModal() {
  isModalOpen = false;
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.add('hidden');
  }
  document.body.classList.remove('overflow-hidden');
}

// Function to save product (placeholder for actual implementation)
// Function to save product
function saveProduct() {
  // Get form element
  const form = document.getElementById('add-product-form');
  if (!form) return;

  // Define required fields based on form state
  let requiredFields = [];
  
  if (createVariant) {
    // When Create Variant is checked
    requiredFields = [
      { id: 'item-template', label: 'Item Template' }
    ];
  } else {
    // When Create Variant is not checked
    requiredFields = [
      { id: 'item-code', label: 'Item Code' }, // Will allow empty as it can be auto-generated
      { id: 'item-name', label: 'Item Name' },
      { id: 'item-group', label: 'Item Group' },
      { id: 'default-uom', label: 'Default Unit of Measure' }
    ];
  }

  // Add Asset Category if Is Fixed Asset is checked
  if (isFixedAsset) {
    requiredFields.push({ id: 'asset-category', label: 'Asset Category' });
  }

  // Check for empty required fields
  const missingFields = [];
  
  requiredFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;

    // Special case for item-code: allow empty as it can be auto-generated
    if (field.id === 'item-code' && (!input.value || input.value.trim() === '')) {
      return; // Skip validation for item-code if empty
    }

    // For select elements, check if value is empty
    if (input.tagName === 'SELECT' && (!input.value || input.value === '')) {
      missingFields.push(field.label);
    }
    // For text/number inputs, check if value is empty or only whitespace
    else if (input.tagName === 'INPUT' && (!input.value || input.value.trim() === '')) {
      missingFields.push(field.label);
    }
  });

  // Display notification based on validation result
  if (missingFields.length === 0) {
    // All required fields are filled (or item-code is allowed to be empty)
    console.log('Product saved successfully');
    closeAddProductModal();
    displayNotification('Product successfully added', 'success');
  } else {
    // Some required fields are missing
    const errorMessage = `Please fill in the following required fields: ${missingFields.join(', ')}`;
    displayNotification(errorMessage, 'error');
  }
}

// Function to open full form (placeholder)
function openFullForm() {
  console.log('Opening full form');
  closeAddProductModal();
  
  // This would normally navigate to a more detailed form
  // For now, just show a notification
  displayNotification('Opening full product form', 'info');
}

// Function to display notifications
function displayNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  } transition-all transform translate-y-0 opacity-100`;
  
  // Icon based on type
  const iconName = type === 'success' ? 'CheckCircle' : 
                   type === 'error' ? 'AlertCircle' : 'Info';
  
  notification.innerHTML = `
    <span class="mr-2">${getIconSvg(iconName, "w-5 h-5")}</span>
    <span>${message}</span>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate out and remove after delay
  setTimeout(() => {
    notification.classList.replace('translate-y-0', 'translate-y-2');
    notification.classList.replace('opacity-100', 'opacity-0');
    
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Function to add necessary icons if not already in the icons object
function ensureRequiredIcons() {
  // Check if we need to add missing icons
  if (!window.icons) {
    console.error('Icons object not found. Please make sure icons.js is loaded.');
    return;
  }
  
  // Add X icon if not present
  if (!window.icons.X) {
    window.icons.X = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  }
  
  // Add Edit icon if not present
  if (!window.icons.Edit) {
    window.icons.Edit = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>';
  }
  
  // Add Save icon if not present
  if (!window.icons.Save) {
    window.icons.Save = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>';
  }
  
  // Add Info icon if not present
  if (!window.icons.Info) {
    window.icons.Info = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }
}

// Function to add a button to the home page for opening the Add Product modal
function addProductButtonToHomePage() {
  // Ensure required icons are available
  ensureRequiredIcons();
  
  // Find appropriate container in home page
  const dashboardContent = document.getElementById('dashboard-content');
  if (!dashboardContent) return;
  
  // Look for quick actions section
  const quickActionsSection = dashboardContent.querySelector('#quick-actions-section');
  if (quickActionsSection) {
    // Check if button already exists
    if (!quickActionsSection.querySelector('#add-product-button')) {
      // Create button in the quick actions grid
      const addProductButton = document.createElement('button');
      addProductButton.id = 'add-product-button';
      addProductButton.className = 'p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100';
      addProductButton.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="bg-indigo-700 p-3 rounded-xl mb-3 text-white group-hover:bg-indigo-800 transition-colors shadow-md">
            <span>${getIconSvg("Package", "w-5 h-5")}</span>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">Add Product</span>
        </div>
      `;
      
      // Add click event
      addProductButton.addEventListener('click', openAddProductModal);
      
      // Add to quick actions
      quickActionsSection.appendChild(addProductButton);
    }
  }
}

// Initialize the Add Product functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initial render of the modal (hidden)
  renderAddProductModal();
  
  // Add the button to the home page
  addProductButtonToHomePage();
});

// Expose functions globally
window.openAddProductModal = openAddProductModal;
window.closeAddProductModal = closeAddProductModal;