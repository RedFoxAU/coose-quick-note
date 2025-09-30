// State management
let notes = [];
const STORAGE_KEY = 'quickNotes';

// DOM elements
const notesContainer = document.getElementById('notesContainer');
const addNoteBtn = document.getElementById('addNoteBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderNotes();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    addNoteBtn.addEventListener('click', addNote);
    clearAllBtn.addEventListener('click', clearAllNotes);
}

// Load notes from localStorage
function loadNotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            notes = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading notes:', e);
            notes = [];
        }
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Add new note
function addNote() {
    const newNote = {
        id: Date.now(),
        content: 'Double-click to edit this note',
        timestamp: new Date().toISOString()
    };
    notes.unshift(newNote);
    saveNotes();
    renderNotes();
}

// Delete note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

// Update note content
function updateNoteContent(id, content) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.content = content;
        note.timestamp = new Date().toISOString();
        saveNotes();
    }
}

// Clear all notes
function clearAllNotes() {
    if (notes.length === 0) return;
    
    if (confirm('Are you sure you want to delete all notes?')) {
        notes = [];
        saveNotes();
        renderNotes();
    }
}

// Render notes
function renderNotes() {
    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2>No notes yet</h2>
                <p>Click "Add Note" to get started</p>
            </div>
        `;
        return;
    }

    notesContainer.innerHTML = notes.map((note, index) => createNoteElement(note, index)).join('');
    
    // Setup drag and drop for each note
    const noteElements = notesContainer.querySelectorAll('.note-item');
    noteElements.forEach(element => {
        setupNoteDragDrop(element);
        setupNoteEdit(element);
    });
}

// Create note element HTML
function createNoteElement(note, index) {
    const date = new Date(note.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="note-item" draggable="true" data-note-id="${note.id}">
            <div class="note-header">
                <div class="note-priority">
                    <span class="priority-number">${index + 1}</span>
                    <span>Priority ${index + 1}</span>
                </div>
                <div class="note-actions">
                    <button class="icon-btn delete-btn" data-note-id="${note.id}" title="Delete note">🗑️</button>
                </div>
            </div>
            <div class="note-content" contenteditable="false">${escapeHtml(note.content)}</div>
            <div class="note-timestamp">Last updated: ${formattedDate}</div>
        </div>
    `;
}

// Setup drag and drop for a note
function setupNoteDragDrop(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
}

// Setup double-click editing for a note
function setupNoteEdit(element) {
    const contentDiv = element.querySelector('.note-content');
    const deleteBtn = element.querySelector('.delete-btn');
    
    // Double-click to edit
    contentDiv.addEventListener('dblclick', (e) => {
        e.preventDefault();
        startEditing(element);
    });
    
    // Delete button
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const noteId = parseInt(element.dataset.noteId);
        deleteNote(noteId);
    });
}

// Start editing a note
function startEditing(element) {
    const contentDiv = element.querySelector('.note-content');
    const originalContent = contentDiv.textContent;
    
    contentDiv.contentEditable = 'true';
    contentDiv.classList.add('editing');
    contentDiv.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(contentDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Save on blur
    const saveEdit = () => {
        contentDiv.contentEditable = 'false';
        contentDiv.classList.remove('editing');
        
        const newContent = contentDiv.textContent.trim();
        if (newContent && newContent !== originalContent) {
            const noteId = parseInt(element.dataset.noteId);
            updateNoteContent(noteId, newContent);
            renderNotes();
        } else if (!newContent) {
            contentDiv.textContent = originalContent;
        }
    };
    
    contentDiv.addEventListener('blur', saveEdit, { once: true });
    
    // Save on Enter, cancel on Escape
    contentDiv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            contentDiv.blur();
        } else if (e.key === 'Escape') {
            contentDiv.textContent = originalContent;
            contentDiv.blur();
        }
    });
}

// Drag and drop handlers
let draggedElement = null;
let draggedIndex = null;

function handleDragStart(e) {
    draggedElement = this;
    draggedIndex = Array.from(notesContainer.children).indexOf(this);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Remove drag-over class from all elements
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const allItems = Array.from(notesContainer.children);
        const dropIndex = allItems.indexOf(this);
        
        // Reorder notes array
        const [movedNote] = notes.splice(draggedIndex, 1);
        notes.splice(dropIndex, 0, movedNote);
        
        // Save and re-render
        saveNotes();
        renderNotes();
    }
    
    return false;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
