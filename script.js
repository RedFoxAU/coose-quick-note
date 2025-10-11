// Note manager class
class NoteManager {
    constructor() {
        this.notes = this.loadNotes();
        this.draggedElement = null;
        this.init();
    }

    init() {
        this.renderNotes();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const addBtn = document.getElementById('addNoteBtn');
        const noteInput = document.getElementById('noteInput');

        addBtn.addEventListener('click', () => this.addNote());
        noteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addNote();
            }
        });
    }

    addNote() {
        const noteInput = document.getElementById('noteInput');
        const content = noteInput.value.trim();

        if (!content) {
            alert('Please enter a note');
            return;
        }

        const note = {
            id: Date.now(),
            content: content,
            timestamp: new Date().toLocaleString(),
            order: this.notes.length
        };

        this.notes.push(note);
        this.saveNotes();
        this.renderNotes();
        noteInput.value = '';
        noteInput.focus();
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.updateOrder();
            this.saveNotes();
            this.renderNotes();
        }
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;

        const noteElement = document.querySelector(`[data-id="${id}"]`);
        const contentElement = noteElement.querySelector('.note-content');
        const actionsElement = noteElement.querySelector('.note-actions');

        const currentContent = note.content;
        contentElement.innerHTML = `<textarea class="note-edit-textarea">${currentContent}</textarea>`;

        actionsElement.innerHTML = `
            <button class="note-btn save-btn" onclick="noteManager.saveEdit(${id})">Save</button>
            <button class="note-btn cancel-btn" onclick="noteManager.cancelEdit(${id})">Cancel</button>
        `;

        noteElement.draggable = false;
    }

    saveEdit(id) {
        const noteElement = document.querySelector(`[data-id="${id}"]`);
        const textarea = noteElement.querySelector('.note-edit-textarea');
        const newContent = textarea.value.trim();

        if (!newContent) {
            alert('Note cannot be empty');
            return;
        }

        const note = this.notes.find(n => n.id === id);
        note.content = newContent;
        this.saveNotes();
        this.renderNotes();
    }

    cancelEdit(id) {
        this.renderNotes();
    }

    updateOrder() {
        this.notes.forEach((note, index) => {
            note.order = index;
        });
    }

    loadNotes() {
        const saved = localStorage.getItem('cooseNotes');
        return saved ? JSON.parse(saved) : [];
    }

    saveNotes() {
        localStorage.setItem('cooseNotes', JSON.stringify(this.notes));
    }

    renderNotes() {
        const container = document.getElementById('notesContainer');

        if (this.notes.length === 0) {
            container.innerHTML = '<div class="empty-state">No notes yet. Add your first note above!</div>';
            return;
        }

        const sortedNotes = [...this.notes].sort((a, b) => a.order - b.order);

        container.innerHTML = sortedNotes.map(note => `
            <div class="note" draggable="true" data-id="${note.id}">
                <div class="note-header">
                    <span class="note-order">#${note.order + 1}</span>
                    <span class="note-timestamp">${note.timestamp}</span>
                </div>
                <div class="note-content">${this.escapeHtml(note.content)}</div>
                <div class="note-actions">
                    <button class="note-btn edit-btn" onclick="noteManager.editNote(${note.id})">Edit</button>
                    <button class="note-btn delete-btn" onclick="noteManager.deleteNote(${note.id})">Delete</button>
                </div>
            </div>
        `).join('');

        this.attachDragListeners();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    attachDragListeners() {
        const noteElements = document.querySelectorAll('.note');

        noteElements.forEach(noteElement => {
            noteElement.addEventListener('dragstart', (e) => {
                this.draggedElement = noteElement;
                noteElement.classList.add('dragging');
            });

            noteElement.addEventListener('dragend', () => {
                noteElement.classList.remove('dragging');
            });

            noteElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = document.querySelector('.dragging');
                if (!draggingElement || draggingElement === noteElement) return;

                const container = document.getElementById('notesContainer');
                const afterElement = this.getDragAfterElement(container, e.clientY);

                if (afterElement == null) {
                    container.appendChild(draggingElement);
                } else {
                    container.insertBefore(draggingElement, afterElement);
                }
            });

            noteElement.addEventListener('drop', (e) => {
                e.preventDefault();
                this.updateNotesOrder();
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateNotesOrder() {
        const noteElements = document.querySelectorAll('.note');
        const newOrder = [];

        noteElements.forEach((element, index) => {
            const id = parseInt(element.getAttribute('data-id'));
            const note = this.notes.find(n => n.id === id);
            if (note) {
                note.order = index;
                newOrder.push(note);
            }
        });

        this.notes = newOrder;
        this.saveNotes();
        this.renderNotes();
    }
}

// Initialize the note manager
let noteManager;
document.addEventListener('DOMContentLoaded', () => {
    noteManager = new NoteManager();
});
