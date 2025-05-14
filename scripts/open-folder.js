// Open folder and process .cbz files
document.getElementById('open-folder').addEventListener('click', async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();

    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'file' && name.endsWith('.cbz')) {
        const file = await handle.getFile();
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        await saveToLibrary(file, zip);
      }
    }

    alert('Library updated. Go to the Library page to view your comics.');
  } catch (err) {
    console.error('Error accessing directory:', err);
  }
});

// Setup IndexedDB
const dbPromise = indexedDB.open("CBZLibrary", 1);

dbPromise.onupgradeneeded = function (event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("cbzFiles")) {
    db.createObjectStore("cbzFiles", { keyPath: "name" });
  }
};

// Save file metadata to IndexedDB
// Natural sort function (Windows-like sorting)
function naturalSort(a, b) {
  const regExp = /(\d+)|(\D+)/g;

  // Split the filenames into chunks of numbers and non-numbers
  const chunksA = a.match(regExp);
  const chunksB = b.match(regExp);

  // Compare each chunk sequentially
  for (let i = 0; i < Math.max(chunksA.length, chunksB.length); i++) {
    const chunkA = chunksA[i] || "";
    const chunkB = chunksB[i] || "";

    if (chunkA === chunkB) continue;

    // If the chunk is a number, compare as a number
    if (!isNaN(chunkA) && !isNaN(chunkB)) {
      return parseInt(chunkA) - parseInt(chunkB);
    }

    // Otherwise, compare as strings
    return chunkA.localeCompare(chunkB);
  }

  return 0; // Return 0 if all chunks are equal
}

// Save file metadata to IndexedDB
async function saveToLibrary(file, zip) {
  const imageFileNames = Object.keys(zip.files)
    .filter(name => /\.(jpe?g|png|gif)$/i.test(name))
    .sort(naturalSort); // Use natural sort here

  if (imageFileNames.length === 0) return;

  const firstImage = imageFileNames[0];
  const blob = await zip.files[firstImage].async("blob");

  const thumbnail = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  const dbReq = indexedDB.open("CBZLibrary");
  dbReq.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("cbzFiles", "readwrite");
    const store = tx.objectStore("cbzFiles");

    store.put({
      name: file.name,
      thumbnail,
      lastModified: file.lastModified
    });

    tx.oncomplete = () => db.close();
  };
}


