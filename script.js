class NotesApp {
    constructor() {
        // ... autres propriétés ...
        this.currentSearchQuery = '';
        this.currentDateFilter = null;

        // Initialiser les boutons de filtre
        this.dateFilters = document.querySelectorAll('.date-filter');
    }

    bindEvents() {
  
        
        // Filtres de date
        this.dateFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                this.dateFilters.forEach(btn => btn.classList.remove('active'));
                const filter = e.target.dataset.filter;
                if (filter === 'all') {
                    this.currentDateFilter = null;
                } else {
                    this.currentDateFilter = filter;
                    e.target.classList.add('active');
                }
                this.renderNotes();
            });
        });
    }

    checkDateFilter(noteDate) {
        if (!this.currentDateFilter) return true;
        
        const noteDateObj = new Date(noteDate);
        const now = new Date();
        const timeDiff = now - noteDateObj;

        switch (this.currentDateFilter) {
            case 'day':
                return timeDiff <= 86400000; // 24 heures
            case 'week':
                return timeDiff <= 604800000; // 7 jours
            case 'month':
                return timeDiff <= 2592000000; // 30 jours
            default:
                return true;
        }
    }

    searchNotes(query) {
        this.currentSearchQuery = query;
        this.renderNotes();
    }

    renderNotes() {
        const filteredNotes = this.notes.filter(note => {
            const matchesSearch = note.title.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
                                note.content.toLowerCase().includes(this.currentSearchQuery.toLowerCase());
            const matchesDate = this.checkDateFilter(note.createdAt);
            return matchesSearch && matchesDate;
        });
        
        const sortedNotes = this.sortNotes(filteredNotes);
        // ... reste du code existant ...
    }

    // Ajoutez cette méthode pour les tests
    runTests() {
        // Tests de recherche
        console.log("Test recherche par titre:");
        this.currentSearchQuery = "Bienvenue";
        let results = this.notes.filter(n => 
            n.title.includes(this.currentSearchQuery) || 
            n.content.includes(this.currentSearchQuery)
        );
        console.log(`${results.length} notes trouvées (attendu: 1)`);

        // Tests de filtre
        console.log("Test filtre journalier:");
        this.currentDateFilter = 'day';
        let filtered = this.notes.filter(n => this.checkDateFilter(n.createdAt));
        console.log(`${filtered.length} notes aujourd'hui`);

        // Réinitialisation
        this.currentSearchQuery = '';
        this.currentDateFilter = null;
    }
}
