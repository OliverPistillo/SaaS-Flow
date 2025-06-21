const { syncDatabase } = require('../models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Inizializzazione database...');
    
    // Sincronizza il database (crea le tabelle se non esistono)
    await syncDatabase(false); // false = non eliminare dati esistenti
    
    console.log('✅ Database inizializzato con successo');
    
    // Qui potresti aggiungere dati di seed se necessario
    // await seedDatabase();
    
  } catch (error) {
    console.error('❌ Errore inizializzazione database:', error);
    process.exit(1);
  }
};

// Esegui solo se chiamato direttamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };

