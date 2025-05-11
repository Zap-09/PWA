const note = document.getElementById('note');
const save = document.getElementById('save');

// Load saved note
note.value = localStorage.getItem('note') || '';

save.addEventListener('click', () => {
  localStorage.setItem('note', note.value);
  alert('Note saved!');
});