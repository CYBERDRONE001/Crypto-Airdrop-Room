document.addEventListener('DOMContentLoaded', function() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    const currentDate = new Date().toLocaleDateString();
    lastUpdatedElement.textContent = currentDate;

    const modal = document.getElementById("addPostModal");
    const postsContainer = document.getElementById("postsContainer");

    // Load saved theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Open modal function
    window.openModal = function() {
        modal.style.display = "block";
    }

    // Close modal function
    window.closeModal = function() {
        modal.style.display = "none";
    }

    // Handle Add Post Form Submission
    const addPostForm = document.getElementById('addPostForm');

    addPostForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const title = document.getElementById('postTitle').value;
        const description = document.getElementById('postDescription').value;
        const link = document.getElementById('postLink').value;
        const telegram = document.getElementById('postTelegram').value;
        const imageInput = document.getElementById('postImage');
        const image = imageInput.files[0];

        // Create a new post object
        const newPost = {
            title,
            description,
            link,
            telegram,
            views: 0,
            image: image ? URL.createObjectURL(image) : null // Create a URL for the image if provided
        };

        // Save post to localStorage
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));

        // Add post to the page
        addPostToPage(newPost);

        // Close the modal and reset the form
        closeModal();
        addPostForm.reset();
    });

    // Load existing posts from localStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => addPostToPage(post));

    // Function to add a post to the page
    function addPostToPage(post) {
        const postElement = document.createElement('div');
        postElement.classList.add('content-section', 'post-content');
        postElement.innerHTML = `
            <div class="post-body">
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
                <h2>${post.title}</h2>
                <p>${post.description}</p>
                <a href="${post.link}" target="_blank" class="download-button">Check it out</a>
                <div class="post-view-count">Views: ${post.views}</div>
            </div>
            <div class="post-options">
                <button class="post-menu-button">&#x2022;&#x2022;&#x2022;</button>
                <div class="post-menu">
                    <button onclick="deletePost(this)">Delete</button>
                    <button onclick="reportPost(this)">Report</button>
                </div>
                <button onclick="incrementView(this)">View</button>
            </div>
            <div class="post-author">Posted by: ${post.telegram}</div>
        `;

        // Append the new post to the posts container
        postsContainer.prepend(postElement);

        // Add functionality to toggle the menu visibility
        const menuButton = postElement.querySelector('.post-menu-button');
        const menu = postElement.querySelector('.post-menu');

        menuButton.addEventListener('click', function() {
            // Toggle visibility of the menu
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Function to delete a post
    window.deletePost = function(button) {
        const postElement = button.closest('.content-section');
        const postIndex = Array.from(postsContainer.children).indexOf(postElement);

        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.splice(postIndex, 1);
        localStorage.setItem('posts', JSON.stringify(posts));

        postElement.remove();
    }

    // Function to report a post
    window.reportPost = function(button) {
        // Implement reporting logic here
        alert('Post reported.'); // Placeholder alert for demo purposes
    }

    // Function to increment view count
    window.incrementView = function(button) {
        const postElement = button.closest('.content-section');
        const postIndex = Array.from(postsContainer.children).indexOf(postElement);

        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts[postIndex].views++;
        localStorage.setItem('posts', JSON.stringify(posts));

        postElement.querySelector('.post-view-count').textContent = `Views: ${posts[postIndex].views}`;
    }

    // Handle side navigation
    window.openNav = function() {
        document.getElementById("sideNav").style.left = "0";
        document.getElementById("main").style.marginLeft = "250px";
    }

    window.closeNav = function() {
        document.getElementById("sideNav").style.left = "-250px";
        document.getElementById("main").style.marginLeft = "0";
    }

    // Toggle theme functionality
    const themeToggleButton = document.createElement('button');
    themeToggleButton.textContent = '☀️';
    themeToggleButton.classList.add('theme-toggle-button');
    document.body.appendChild(themeToggleButton);

    themeToggleButton.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙'; // Toggle button icon based on theme
    });
});