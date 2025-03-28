// header.js - JavaScript functionality for the header component

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const notificationDropdown = document.getElementById('notificationsDropdown');
    const notificationCount = document.getElementById('notificationCount');
    const notificationList = document.getElementById('notificationList');
    
    // Sample notification data - in a real app, this would come from an API
    const notifications = [
        // You would fetch these from the server in a real application
        // Uncomment to test notifications
        /*
        {
            id: 1,
            title: 'Low Stock Alert',
            text: 'Part XYZ123 is running low on stock',
            type: 'warning',
            time: '10 minutes ago',
            read: false
        },
        {
            id: 2,
            title: 'New Supplier Added',
            text: 'A new supplier has been added to the system',
            type: 'info',
            time: '1 hour ago',
            read: false
        }
        */
    ];
    
    // Function to update notification count
    function updateNotificationCount() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
        
        if (unreadCount > 0) {
            notificationCount.style.display = 'block';
        } else {
            notificationCount.style.display = 'none';
        }
    }
    
    // Function to render notifications
    function renderNotifications() {
        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="text-center p-3 empty-notification">
                    <i class="bi bi-bell-slash text-muted fs-3"></i>
                    <p class="text-muted mt-2 mb-0">No new notifications</p>
                </div>
            `;
            return;
        }
        
        let notificationHTML = '';
        
        notifications.forEach(notification => {
            let iconClass, bgColor;
            
            switch (notification.type) {
                case 'warning':
                    iconClass = 'bi-exclamation-triangle';
                    bgColor = 'bg-warning text-dark';
                    break;
                case 'danger':
                    iconClass = 'bi-exclamation-circle';
                    bgColor = 'bg-danger text-white';
                    break;
                case 'success':
                    iconClass = 'bi-check-circle';
                    bgColor = 'bg-success text-white';
                    break;
                default:
                    iconClass = 'bi-info-circle';
                    bgColor = 'bg-info text-white';
            }
            
            notificationHTML += `
                <div class="notification-item d-flex align-items-center ${notification.read ? 'text-muted' : ''}" data-id="${notification.id}">
                    <div class="notification-icon ${bgColor}">
                        <i class="bi ${iconClass}"></i>
                    </div>
                    <div class="notification-info">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-text">${notification.text}</div>
                        <div class="notification-time">${notification.time}</div>
                    </div>
                    ${!notification.read ? '<div class="notification-unread-indicator"></div>' : ''}
                </div>
            `;
        });
        
        notificationList.innerHTML = notificationHTML;
        
        // Add click event to mark notifications as read
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', function() {
                const notificationId = parseInt(this.dataset.id);
                const notificationIndex = notifications.findIndex(n => n.id === notificationId);
                
                if (notificationIndex !== -1) {
                    notifications[notificationIndex].read = true;
                    this.classList.add('text-muted');
                    this.querySelector('.notification-unread-indicator')?.remove();
                    updateNotificationCount();
                }
            });
        });
    }
    
    // Check for new notifications (in a real app, this would be an API call)
    function checkForNewNotifications() {
        // Simulate API call to get notifications
        // In a real application, you would fetch this data from your API
        
        // After receiving new notifications, update UI
        updateNotificationCount();
        renderNotifications();
    }
    
    // Initialize
    checkForNewNotifications();
    
    // Set up periodic checking (e.g., every 5 minutes)
    // In a real application, you might use WebSockets instead for real-time updates
    const notificationCheckInterval = 5 * 60 * 1000; // 5 minutes
    setInterval(checkForNewNotifications, notificationCheckInterval);
    
    // Toggle sidebar collapse from header button
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            
            // For mobile
            if (window.innerWidth < 768) {
                sidebar.classList.toggle('show');
                document.getElementById('sidebarOverlay').classList.toggle('show');
                document.body.classList.toggle('sidebar-expanded');
            } 
            // For desktop
            else {
                document.body.classList.toggle('sidebar-collapsed');
                
                // Save preference to localStorage
                const isCollapsed = document.body.classList.contains('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            }
        });
    }
});