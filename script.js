class NotesApp {
  constructor() {
    this.notes = this.loadNotes()
    this.currentEditId = null
    this.selectedColor = "#6366f1"
    this.currentView = "grid"
    this.currentSort = "newest"
    this.deleteNoteId = null
    this.currentDateFilter = "all"
    this.initializeElements()
    this.bindEvents()
    this.renderNotes()
    this.initializeTheme()
  }

  initializeElements() {
    this.notesContainer = document.getElementById("notesContainer")
    this.noNotesMessage = document.getElementById("noNotesMessage")

    this.searchInput = document.getElementById("searchInput")
    this.clearSearchBtn = document.getElementById("clearSearch")

    this.addBtn = document.getElementById("addBtn")
    this.emptyAddBtn = document.getElementById("emptyAddBtn")

    this.gridViewBtn = document.getElementById("gridViewBtn")
    this.listViewBtn = document.getElementById("listViewBtn")
    this.sortSelect = document.getElementById("sortSelect")

    this.noteModal = document.getElementById("noteModal")
    this.modalTitle = document.getElementById("modalTitle")
    this.noteTitle = document.getElementById("noteTitle")
    this.noteContent = document.getElementById("noteContent")
    this.saveBtn = document.getElementById("saveBtn")
    this.cancelBtn = document.getElementById("cancelBtn")
    this.closeModal = document.getElementById("closeModal")
    this.colorOptions = document.querySelectorAll(".color-option")

    this.toast = document.getElementById("toast")
    this.toastMessage = document.getElementById("toastMessage")

    this.confirmDialog = document.getElementById("confirmDialog")
    this.confirmBtn = document.getElementById("confirmBtn")
    this.cancelConfirmBtn = document.getElementById("cancelConfirmBtn")
    this.confirmTitle = document.getElementById("confirmTitle")
    this.confirmMessage = document.getElementById("confirmMessage")

    this.themeSwitch = document.getElementById("themeSwitch")

    this.dateFilters = document.getElementById("dateFilters")
  }

  bindEvents() {
    this.addBtn.addEventListener("click", () => this.openModal())

    this.saveBtn.addEventListener("click", () => this.saveNote())
    this.cancelBtn.addEventListener("click", () => this.closeModalHandler())
    this.closeModal.addEventListener("click", () => this.closeModalHandler())

    this.searchInput.addEventListener("input", (e) => this.searchNotes(e.target.value))
    this.clearSearchBtn.addEventListener("click", () => {
      this.searchInput.value = ""
      this.searchNotes("")
      this.searchInput.focus()
    })

    this.gridViewBtn.addEventListener("click", () => this.changeView("grid"))
    this.listViewBtn.addEventListener("click", () => this.changeView("list"))
    this.sortSelect.addEventListener("change", () => {
      this.currentSort = this.sortSelect.value
      this.renderNotes()
    })

    this.colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        this.colorOptions.forEach((opt) => opt.classList.remove("selected"))
        option.classList.add("selected")
        this.selectedColor = option.dataset.color
      })
    })

    this.confirmBtn.addEventListener("click", () => {
      if (this.deleteNoteId) {
        this.deleteNoteConfirmed(this.deleteNoteId)
        this.closeConfirmDialog()
      }
    })
    this.cancelConfirmBtn.addEventListener("click", () => this.closeConfirmDialog())

    this.themeSwitch.addEventListener("change", () => this.toggleTheme())

    this.noteModal.addEventListener("click", (e) => {
      if (e.target === this.noteModal) this.closeModalHandler()
    })

    this.confirmDialog.addEventListener("click", (e) => {
      if (e.target === this.confirmDialog) this.closeConfirmDialog()
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.noteModal.classList.contains("show")) this.closeModalHandler()
        if (this.confirmDialog.classList.contains("show")) this.closeConfirmDialog()
      }
    })

    if (this.dateFilters) {
      this.dateFilters.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          this.currentDateFilter = btn.dataset.filter
          this.dateFilters.querySelectorAll("button").forEach(b => b.classList.remove("active"))
          btn.classList.add("active")
          this.renderNotes()
        })
      })
    }
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
        option.classList.toggle("selected", option.dataset.color === this.selectedColor)
      })
    } else {
      this.modalTitle.textContent = "Ajouter une note"
      this.noteTitle.value = ""
      this.noteContent.value = ""
      this.selectedColor = "#6366f1"

      this.colorOptions.forEach((option) => {
        option.classList.toggle("selected", option.dataset.color === "#6366f1")
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
        this.showToast("Note modifiée avec succès", "success")
      }
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        color: this.selectedColor,
      }
      this.notes.push(newNote)
      this.showToast("Note ajoutée avec succès", "success")
    }

    this.saveNotes()
    this.closeModalHandler()
    this.renderNotes()
  }

  renderNotes(filteredNotes = null) {
    // Appliquer filtre par date si demandé
    let notesToRender = filteredNotes || [...this.notes]

    if (this.currentDateFilter !== "all") {
      const now = new Date()
      let startDate

      if (this.currentDateFilter === "week") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      } else if (this.currentDateFilter === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      }

      notesToRender = notesToRender.filter(note => new Date(note.createdAt) >= startDate)
    }

    // Appliquer tri
    notesToRender.sort((a, b) => {
      switch (this.currentSort) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "titleAsc":
          return a.title.localeCompare(b.title)
        case "titleDesc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    this.notesContainer.innerHTML = ""

    if (notesToRender.length === 0) {
      this.noNotesMessage.style.display = "block"
      this.emptyAddBtn.style.display = "inline-block"
      this.addBtn.style.display = "none"
      return
    } else {
      this.noNotesMessage.style.display = "none"
      this.emptyAddBtn.style.display = "none"
      this.addBtn.style.display = "inline-block"
    }

    notesToRender.forEach((note) => {
      const noteEl = document.createElement("div")
      noteEl.className = "note"
      noteEl.style.borderColor = note.color || "#6366f1"

      if (this.currentView === "list") {
        noteEl.classList.add("note-list")
      }

      noteEl.innerHTML = `
        <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
        <p class="note-content">${this.escapeHtml(note.content)}</p>
        <p class="note-date">${this.formatDate(note.createdAt)}</p>
        <div class="note-actions">
          <button class="edit-btn" title="Modifier la note">✏️</button>
          <button class="delete-btn" title="Supprimer la note">🗑️</button>
        </div>
      `

      const editBtn = noteEl.querySelector(".edit-btn")
      const deleteBtn = noteEl.querySelector(".delete-btn")

      editBtn.addEventListener("click", () => this.editNote(note.id))
      deleteBtn.addEventListener("click", () => this.confirmDeleteNote(note.id))

      this.notesContainer.appendChild(noteEl)
    })
  }

  editNote(id) {
    const note = this.notes.find(n => n.id === id)
    if (note) {
      this.openModal(note)
    }
  }

  confirmDeleteNote(id) {
    this.deleteNoteId = id
    this.confirmTitle.textContent = "Confirmer la suppression"
    this.confirmMessage.textContent = "Voulez-vous vraiment supprimer cette note ?"
    this.confirmDialog.classList.add("show")
  }

  deleteNoteConfirmed(id) {
    this.notes = this.notes.filter(note => note.id !== id)
    this.saveNotes()
    this.renderNotes()
    this.showToast("Note supprimée avec succès", "success")
  }

  closeConfirmDialog() {
    this.confirmDialog.classList.remove("show")
    this.deleteNoteId = null
  }

  searchNotes(query) {
    const filtered = this.notes.filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    )
    this.renderNotes(filtered)
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }

  showToast(message, type = "success") {
    this.toastMessage.textContent = message
    this.toast.className = `toast ${type} show`
    clearTimeout(this.toastTimeout)
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove("show")
    }, 3000)
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new NotesApp()
})
