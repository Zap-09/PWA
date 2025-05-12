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
