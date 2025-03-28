// sidebar.js - JavaScript functionality for the sidebar component

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const collapseSidebarBtn = document.getElementById('collapseSidebarBtn');
    
    // Toggle sidebar for mobile
    function toggleMobileSidebar() {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
        document.body.classList.toggle('sidebar-expanded');
    }
    
    // Collapse sidebar for desktop (optional functionality)
    function toggleSidebarCollapse() {
        document.body.classList.toggle('sidebar-collapsed');
        
        // Save preference to localStorage
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
    
    // Event listeners
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleMobileSidebar);
    }
    
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleMobileSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleMobileSidebar);
    }
    
    if (collapseSidebarBtn) {
        collapseSidebarBtn.addEventListener('click', toggleSidebarCollapse);
    }
    
    // Check for saved preference and apply
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // Close sidebar on window resize if in mobile view
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
            document.body.classList.remove('sidebar-expanded');
        }
    });
    
    // Add active class to parent nav-item if child is active
    const activeLinks = document.querySelectorAll('.sidebar .nav-link.active');
    activeLinks.forEach(function(link) {
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
            parentDropdown.classList.add('active');
            const toggle = parentDropdown.querySelector('.nav-dropdown-toggle');
            if (toggle) {
                toggle.classList.add('active');
                const content = parentDropdown.querySelector('.nav-dropdown-items');
                if (content) {
                    content.style.display = 'block';
                }
            }
        }
    });
    
    // Toggle dropdown menus (if you add dropdown functionality later)
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.nav-dropdown');
            const content = parent.querySelector('.nav-dropdown-items');
            
            // Toggle this dropdown
            parent.classList.toggle('open');
            this.classList.toggle('active');
            
            // Animate content height
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});