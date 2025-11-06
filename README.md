# 📝 Quick Priority Notes

A lightweight, production-ready drag-and-drop priority note manager. Perfect for organizing tasks and ideas with instant persistence.

## ✨ Features

- **🎯 Drag & Drop Reordering** - Easily reorganize notes by priority
- **✏️ Double-Click Editing** - Quick inline editing with auto-save
- **💾 Auto-Save** - Notes persist automatically using localStorage
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **⚡ Zero Dependencies** - Pure vanilla JavaScript, HTML, and CSS
- **🚀 Production Ready** - Optimized and ready for deployment

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/RedFoxAU/coose-quick-note.git
cd coose-quick-note
```

2. Open `index.html` in your browser or run a local server:
```bash
python3 -m http.server 8000
```

3. Navigate to `http://localhost:8000`

## 📖 Usage

- **Add Note**: Click the "+ Add Note" button
- **Edit Note**: Double-click on any note content to edit
- **Reorder**: Click and drag notes to change priority
- **Delete**: Click the trash icon on any note
- **Clear All**: Remove all notes at once

## 🌐 Deploy to Cloudflare Pages

### Automatic Deployment

1. Push your code to GitHub
2. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Click "Create a project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: (leave empty - static site)
   - **Build output directory**: `/`
   - **Root directory**: `/`

6. Click "Save and Deploy"

Your site will be automatically deployed and available at `https://your-project.pages.dev`

### Custom Domain

1. In Cloudflare Pages dashboard, go to your project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to add your domain

### Continuous Deployment

Once set up, every push to your main branch will automatically deploy to production!

## 📁 Project Structure

```
coose-quick-note/
├── index.html      # Main HTML structure
├── styles.css      # Modern, responsive styling
├── script.js       # Drag-and-drop & localStorage logic
├── package.json    # Project metadata
├── README.md       # Documentation
└── .gitignore      # Git ignore rules
```

## 🛠️ Technical Details

- **Storage**: Browser localStorage (no backend required)
- **Framework**: Vanilla JavaScript (no dependencies)
- **Styling**: Modern CSS with CSS variables
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## 🔒 Privacy

All data is stored locally in your browser. No data is sent to any server.

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
