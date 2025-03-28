// part_list.js - JavaScript for parts list page

document.addEventListener('DOMContentLoaded', function() {
    // Toggle between list and grid views
    const listViewBtn = document.getElementById('list-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listView = document.getElementById('list-view');
    const gridView = document.getElementById('grid-view');
    
    if (listViewBtn && gridViewBtn && listView && gridView) {
        // Check if there's a saved preference
        const viewPreference = localStorage.getItem('partsViewPreference');
        if (viewPreference === 'grid') {
            showGridView();
        }
        
        listViewBtn.addEventListener('click', function() {
            showListView();
        });
        
        gridViewBtn.addEventListener('click', function() {
            showGridView();
        });
        
        function showListView() {
            listView.style.display = 'block';
            gridView.style.display = 'none';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            localStorage.setItem('partsViewPreference', 'list');
        }
        
        function showGridView() {
            listView.style.display = 'none';
            gridView.style.display = 'block';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            localStorage.setItem('partsViewPreference', 'grid');
        }
    }
});