class NotesApp {
  constructor() {
    this.notes = this.loadNotes()
    this.currentEditId = null
    this.selectedColor = "#6366f1"
    this.currentView = "grid"
    this.currentSort = "newest"
    this.deleteNoteId = null
    this.initializeElements()
    this.bindEvents()
    this.renderNotes()
    this.initializeTheme()
  }

  initializeElements() {
    // Conteneurs principaux
    this.notesContainer = document.getElementById("notesContainer")
    this.noNotesMessage = document.getElementById("noNotesMessage")

    // Recherche
    this.searchInput = document.getElementById("searchInput")
    this.clearSearchBtn = document.getElementById("clearSearch")

    // Boutons d'action
    this.addBtn = document.getElementById("addBtn")
    this.emptyAddBtn = document.getElementById("emptyAddBtn")

    // Options de vue
    this.gridViewBtn = document.getElementById("gridViewBtn")
    this.listViewBtn = document.getElementById("listViewBtn")
    this.sortSelect = document.getElementById("sortSelect")

    // Modal d'édition
    this.noteModal = document.getElementById("noteModal")
    this.modalTitle = document.getElementById("modalTitle")
    this.noteTitle = document.getElementById("noteTitle")
    this.noteContent = document.getElementById("noteContent")
    this.saveBtn = document.getElementById("saveBtn")
    this.cancelBtn = document.getElementById("cancelBtn")
    this.closeModal = document.getElementById("closeModal")
    this.colorOptions = document.querySelectorAll(".color-option")

    // Toast de notification
    this.toast = document.getElementById("toast")
    this.toastMessage = document.getElementById("toastMessage")

    // Modal de confirmation
    this.confirmDialog = document.getElementById("confirmDialog")
    this.confirmBtn = document.getElementById("confirmBtn")
    this.cancelConfirmBtn = document.getElementById("cancelConfirmBtn")
    this.confirmTitle = document.getElementById("confirmTitle")
    this.confirmMessage = document.getElementById("confirmMessage")

    // Thème
    this.themeSwitch = document.getElementById("themeSwitch")
  }

  bindEvents() {
    // Boutons d'ajout
    this.addBtn.addEventListener("click", () => this.openModal())

    // Actions du modal
    this.saveBtn.addEventListener("click", () => this.saveNote())
    this.cancelBtn.addEventListener("click", () => this.closeModalHandler())
    this.closeModal.addEventListener("click", () => this.closeModalHandler())

    // Recherche
    this.searchInput.addEventListener("input", (e) => this.searchNotes(e.target.value))
    this.clearSearchBtn.addEventListener("click", () => {
      this.searchInput.value = ""
      this.searchNotes("")
      this.searchInput.focus()
    })

    // Options de vue
    this.gridViewBtn.addEventListener("click", () => this.changeView("grid"))
    this.listViewBtn.addEventListener("click", () => this.changeView("list"))
    this.sortSelect.addEventListener("change", () => {
      this.currentSort = this.sortSelect.value
      this.renderNotes()
    })

    // Sélection de couleur
    this.colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        this.colorOptions.forEach((opt) => opt.classList.remove("selected"))
        option.classList.add("selected")
        this.selectedColor = option.dataset.color
      })
    })

    // Actions de confirmation
    this.confirmBtn.addEventListener("click", () => {
      if (this.deleteNoteId) {
        this.deleteNoteConfirmed(this.deleteNoteId)
        this.closeConfirmDialog()
      }
    })
    this.cancelConfirmBtn.addEventListener("click", () => this.closeConfirmDialog())

    // Thème
    this.themeSwitch.addEventListener("change", () => this.toggleTheme())

    // Fermer les modals en cliquant à l'extérieur
    this.noteModal.addEventListener("click", (e) => {
      if (e.target === this.noteModal) this.closeModalHandler()
    })

    this.confirmDialog.addEventListener("click", (e) => {
      if (e.target === this.confirmDialog) this.closeConfirmDialog()
    })

    // Raccourci clavier Échap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.noteModal.classList.contains("show")) this.closeModalHandler()
        if (this.confirmDialog.classList.contains("show")) this.closeConfirmDialog()
      }
    })
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark")
      this.themeSwitch.checked = true
    }
  }

  toggleTheme() {
    if (this.themeSwitch.checked) {
      document.documentElement.setAttribute("data-theme", "dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.setAttribute("data-theme", "light")
      localStorage.setItem("theme", "light")
    }
  }

  changeView(view) {
    this.currentView = view
    if (view === "grid") {
      this.notesContainer.className = "notes-grid"
      this.gridViewBtn.classList.add("active")
      this.listViewBtn.classList.remove("active")
    } else {
      this.notesContainer.className = "notes-list"
      this.listViewBtn.classList.add("active")
      this.gridViewBtn.classList.remove("active")
    }
    this.renderNotes()
  }

  loadNotes() {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      return JSON.parse(savedNotes)
    }
    return [
      {
        id: "1",
        title: "Bienvenue sur NoteFlow ✨",
        content:
          "Voici quelques fonctionnalités de l'application :\n\n• Créez des notes colorées 🎨\n• Recherchez facilement vos notes 🔍\n• Organisez avec la vue liste ou grille 📋\n• Profitez du mode sombre 🌙\n• Triez vos notes par date ou titre 📊",
        createdAt: new Date().toISOString(),
        color: "#6366f1",
      },
      {
        id: "2",
        title: "Idées de design 🎨",
        content:
          "Interface minimaliste avec thème sombre/clair\n\n• Couleurs harmonieuses\n• Typography moderne\n• Responsive design\n• Animations fluides\n• Expérience utilisateur optimale",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        color: "#ec4899",
      },
      {
        id: "3",
        title: "Tâches à faire 📝",
        content:
          "Fonctionnalités à implémenter :\n\n• Fonction de recherche avancée\n• Filtres par catégorie\n• Tri par date et titre\n• Exportation des notes\n• Synchronisation cloud",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        color: "#14b8a6",
      },
    ]
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes))
  }

  openModal(note = null) {
    this.currentEditId = note ? note.id : null

    if (note) {
      this.modalTitle.textContent = "Modifier la note"
      this.noteTitle.value = note.title
      this.noteContent.value = note.content
      this.selectedColor = note.color || "#6366f1"

      this.colorOptions.forEach((option) => {
        if (option.dataset.color === this.selectedColor) {
          option.classList.add("selected")
        } else {
          option.classList.remove("selected")
        }
      })
    } else {
      this.modalTitle.textContent = "Ajouter une note"
      this.noteTitle.value = ""
      this.noteContent.value = ""
      this.selectedColor = "#6366f1"

      this.colorOptions.forEach((option) => {
        if (option.dataset.color === "#6366f1") {
          option.classList.add("selected")
        } else {
          option.classList.remove("selected")
        }
      })
    }

    this.noteModal.classList.add("show")
    setTimeout(() => this.noteTitle.focus(), 100)
  }

  closeModalHandler() {
    this.noteModal.classList.remove("show")
    this.currentEditId = null
  }

  saveNote() {
    const title = this.noteTitle.value.trim()
    const content = this.noteContent.value.trim()

    if (!title) {
      this.showToast("Le titre ne peut pas être vide", "error")
      this.noteTitle.focus()
      return
    }

    if (this.currentEditId) {
      const noteIndex = this.notes.findIndex((note) => note.id === this.currentEditId)
      if (noteIndex !== -1) {
        this.notes[noteIndex] = {
          ...this.notes[noteIndex],
          title,
          content,
          color: this.selectedColor,
          updatedAt: new Date().toISOString(),
        }
        this.showToast("Note modifiée avec succès! ✅")
      }
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        color: this.selectedColor,
        createdAt: new Date().toISOString(),
      }
      this.notes.unshift(newNote)
      this.showToast("Note ajoutée avec succès! 🎉")
    }

    this.saveNotes()
    this.renderNotes()
    this.closeModalHandler()
  }

  deleteNote(id) {
    this.deleteNoteId = id
    const note = this.notes.find((note) => note.id === id)

    if (note) {
      this.confirmTitle.textContent = `Supprimer "${note.title}"`
      this.confirmMessage.textContent = "Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible."
      this.confirmDialog.classList.add("show")
    }
  }

  deleteNoteConfirmed(id) {
    this.notes = this.notes.filter((note) => note.id !== id)
    this.saveNotes()
    this.renderNotes()
    this.showToast("Note supprimée avec succès! 🗑️")
  }

  closeConfirmDialog() {
    this.confirmDialog.classList.remove("show")
    this.deleteNoteId = null
  }

  searchNotes(query) {
    const filteredNotes = this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()),
    )
    this.renderNotes(filteredNotes, query)
  }

  sortNotes(notes) {
    const sortedNotes = [...notes]
    switch (this.currentSort) {
      case "newest":
        sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "title":
        sortedNotes.sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    return sortedNotes
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  showToast(message, type = "success") {
    this.toastMessage.textContent = message
    const iconElement = this.toast.querySelector(".toast-icon i")

    if (type === "success") {
      iconElement.className = "fas fa-check-circle"
      iconElement.style.color = "var(--success)"
    } else if (type === "error") {
      iconElement.className = "fas fa-exclamation-circle"
      iconElement.style.color = "var(--danger)"
    }

    this.toast.classList.add("show")
    setTimeout(() => this.toast.classList.remove("show"), 3000)
  }

  renderNotes(notesToRender = null, searchQuery = "") {
    let notes = notesToRender || this.notes
    notes = this.sortNotes(notes)

    if (notes.length === 0) {
      this.notesContainer.style.display = "none"
      this.noNotesMessage.style.display = "block"

      if (searchQuery) {
        this.noNotesMessage.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>Aucune note trouvée pour "${this.escapeHtml(searchQuery)}"</p>
            <button onclick="app.searchInput.value=''; app.searchNotes('')" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              <span>Effacer la recherche</span>
            </button>
          </div>
        `
      } else {
        this.noNotesMessage.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <p>Aucune note pour le moment</p>
            <button onclick="app.openModal()" class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Créer ma première note</span>
            </button>
          </div>
        `
      }
      return
    }

    this.noNotesMessage.style.display = "none"
    this.notesContainer.style.display = "grid"

    this.notesContainer.innerHTML = notes
      .map(
        (note) => `
          <div class="note-card" data-id="${note.id}" data-color="${note.color || "#6366f1"}">
            <div class="note-header">
              <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
              <div class="note-actions">
                <button class="note-btn edit" onclick="app.openModal(app.notes.find(n => n.id === '${note.id}'))">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="note-btn delete" onclick="app.deleteNote('${note.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="note-content">${this.escapeHtml(note.content)}</div>
            <div class="note-footer">
              <div class="note-date">
                <i class="fas fa-calendar-alt"></i>
                <span>${this.formatDate(note.createdAt)}</span>
              </div>
              ${
                note.updatedAt
                  ? `
                <div class="note-updated">
                  <i class="fas fa-edit"></i>
                  <span>Modifiée</span>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `,
      )
      .join("")
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

// Initialiser l'application
document.addEventListener("DOMContentLoaded", () => {
  window.app = new NotesApp()
})
