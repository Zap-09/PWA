document.getElementById('open-folder').addEventListener('click', async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';

    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'file' && name.endsWith('.cbz')) {
        const button = document.createElement('button');
        button.textContent = name;
        button.addEventListener('click', async () => {
          const file = await handle.getFile();
          const arrayBuffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);

          const imageFiles = Object.keys(zip.files)
            .filter(filename => /\.(jpe?g|png|gif)$/i.test(filename))
            .sort();

          const imageUrls = [];

          for (const filename of imageFiles) {
            const blob = await zip.files[filename].async('blob');
            const url = URL.createObjectURL(blob);
            imageUrls.push(url);
          }

          // Open a new tab and inject HTML
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>${file.name}</title>
                  <link rel="stylesheet" href="new.css"/>
                </head>
                <body>
                  <h1>${file.name}</h1>
                  ${imageUrls.map(url => `<img src="${url}" />`).join('')}
                </body>
              </html>
            `);
            newWindow.document.close();
          } else {
            alert('Pop-up blocked! Please allow pop-ups for this site.');
          }
        });
        fileList.appendChild(button);
      }
    }
  } catch (err) {
    console.error('Error accessing directory:', err);
  }
});


let deferredPrompt; // This will hold the beforeinstallprompt event

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default installation prompt
  e.preventDefault();
  // Save the event for later use
  deferredPrompt = e;

  // Show the custom "Install" button
  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'block';

  // Add click listener to show the install prompt when the button is clicked
  installBtn.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      // Reset the deferredPrompt variable
      deferredPrompt = null;
    });
  });
});

// Optionally, you can handle the event if the user already has the app installed
window.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed');
  // Hide the install button after installation
  document.getElementById('installBtn').style.display = 'none';
});
