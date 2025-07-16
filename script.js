const proxyForm = document.getElementById('proxy-form');
const proxyInput = document.getElementById('proxy-input');
const proxyIframe = document.getElementById('proxy-iframe');

// Ensure __uv$config is available
if (typeof __uv$config === 'undefined') {
    console.error('__uv$config is not defined. Make sure uv.config.js is loaded.');
} else {
    // Register the service worker
    navigator.serviceWorker.register('/uv.sw.js', {
        scope: __uv$config.prefix
    }).then(() => {
        console.log('Service worker registered successfully.');
        // Load Google on initial page load
        loadUrl('https://www.google.com');
    }).catch(error => {
        console.error('Service worker registration failed:', error);
    });
}


proxyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let url = proxyInput.value.trim();
    loadUrl(url);
});

function loadUrl(url) {
    if (!url) return;

    // Check if it's a valid URL, otherwise treat it as a search query
    if (!/^(https?:\/\/)/.test(url) && !/\./.test(url)) {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    } else if (!/^(https?:\/\/)/.test(url)) {
        url = 'https://' + url;
    }
    
    // Update the input bar to show the full URL
    proxyInput.value = url;

    // Construct the proxied URL using Ultraviolet's encoding
    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
    
    // Load the URL in the iframe
    proxyIframe.src = encodedUrl;
}

