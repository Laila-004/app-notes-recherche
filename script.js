class NotesApp {
    constructor() {
        // Stockage des paramètres actuels de l'application
        this.currentSearchQuery = ''; // Terme de recherche courant
        this.currentDateFilter = null; // Filtre temporel actif (day/week/month)
        
        // Sélection des éléments DOM des filtres de date
        this.dateFilters = document.querySelectorAll('.date-filter');
    }

    // Méthode pour lier les événements UI
    bindEvents() {
        // Gestion des clics sur les boutons de filtre temporel
        this.dateFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                // Réinitialisation de l'état actif sur tous les boutons
                this.dateFilters.forEach(btn => btn.classList.remove('active'));
                
                // Récupération du filtre depuis l'attribut data-filter
                const filter = e.target.dataset.filter;
                
                if (filter === 'all') {
                    // Désactivation du filtre temporel
                    this.currentDateFilter = null;
                } else {
                    // Activation du filtre sélectionné
                    this.currentDateFilter = filter;
                    e.target.classList.add('active'); // Mise en visuel de l'état actif
                }
                
                // Actualisation de l'affichage des notes
                this.renderNotes();
            });
        });
    }

    // Vérifie si une note correspond au filtre temporel
    checkDateFilter(noteDate) {
        if (!this.currentDateFilter) return true; // Aucun filtre activé
        
        const noteDateObj = new Date(noteDate); // Conversion en objet Date
        const now = new Date(); // Date actuelle
        const timeDiff = now - noteDateObj; // Différence en millisecondes

        // Comparaison selon le filtre sélectionné
        switch (this.currentDateFilter) {
            case 'day':
                return timeDiff <= 86400000; // 24h en ms (24 * 60 * 60 * 1000)
            case 'week':
                return timeDiff <= 604800000; // 7j en ms (7 * 24 * 60 * 60 * 1000)
            case 'month':
                return timeDiff <= 2592000000; // ~30j en ms (30 * 24 * 60 * 60 * 1000)
            default:
                return true; // Cas par défaut (ne devrait pas se produire)
        }
    }

    // Gestion de la recherche de notes
    searchNotes(query) {
        this.currentSearchQuery = query.toLowerCase(); // Normalisation de la requête
        this.renderNotes(); // Actualisation de l'affichage
    }

    // Méthode principale de rendu des notes
    renderNotes() {
        // Filtrage combiné recherche + date
        const filteredNotes = this.notes.filter(note => {
            const matchesSearch = 
                note.title.toLowerCase().includes(this.currentSearchQuery) ||
                note.content.toLowerCase().includes(this.currentSearchQuery);
            
            const matchesDate = this.checkDateFilter(note.createdAt);
            
            return matchesSearch && matchesDate; // Les deux conditions doivent être vraies
        });
        
        // Tri des notes selon une méthode non visible (probablement par date)
        const sortedNotes = this.sortNotes(filteredNotes);
        
       
    }

    // Méthode de test pour vérifier le fonctionnement
    runTests() {
        // Test 1: Recherche par terme spécifique
        console.log("Test recherche par titre:");
        this.currentSearchQuery = "Bienvenue";
        let results = this.notes.filter(n => 
            n.title.includes(this.currentSearchQuery) || 
            n.content.includes(this.currentSearchQuery)
        );
        console.log(`${results.length} notes trouvées (attendu: 1)`);

        // Test 2: Filtrage des notes récentes (24h)
        console.log("Test filtre journalier:");
        this.currentDateFilter = 'day';
        let filtered = this.notes.filter(n => this.checkDateFilter(n.createdAt));
        console.log(`${filtered.length} notes aujourd'hui`);

        // Réinitialisation des paramètres après test
        this.currentSearchQuery = '';
        this.currentDateFilter = null;
    }
}
