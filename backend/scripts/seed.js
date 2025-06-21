const { Company, User, Employee, FinancialData, Assessment } = require('../models');
const { hashPassword } = require('../utils/security');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database con dati di esempio...');

    // Crea azienda di esempio
    const company = await Company.create({
      name: 'Do-Flow Demo Company',
      industry: 'Tecnologia',
      address: 'Via Roma 123, Milano, Italia',
      phone: '+39 02 1234567',
      website: 'https://demo.do-flow.com',
      vatNumber: 'IT12345678901',
      settings: {
        currency: 'EUR',
        timezone: 'Europe/Rome',
        language: 'it',
        fiscalYearStart: '01-01'
      }
    });

    console.log(`✅ Azienda creata: ${company.name}`);

    // Crea utente admin
    const adminPassword = await hashPassword('admin123');
    const adminUser = await User.create({
      email: 'admin@do-flow.demo',
      password: adminPassword,
      firstName: 'Mario',
      lastName: 'Rossi',
      role: 'admin',
      position: 'CEO',
      department: 'Direzione',
      companyId: company.id
    });

    console.log(`✅ Utente admin creato: ${adminUser.email}`);

    // Crea alcuni dipendenti
    const employees = await Employee.bulkCreate([
      {
        firstName: 'Giulia',
        lastName: 'Bianchi',
        email: 'giulia.bianchi@do-flow.demo',
        position: 'Sviluppatore Senior',
        department: 'IT',
        hireDate: '2023-01-15',
        salary: 45000,
        companyId: company.id
      },
      {
        firstName: 'Marco',
        lastName: 'Verdi',
        email: 'marco.verdi@do-flow.demo',
        position: 'Marketing Manager',
        department: 'Marketing',
        hireDate: '2023-03-01',
        salary: 40000,
        companyId: company.id
      },
      {
        firstName: 'Sara',
        lastName: 'Neri',
        email: 'sara.neri@do-flow.demo',
        position: 'HR Specialist',
        department: 'Risorse Umane',
        hireDate: '2023-02-10',
        salary: 35000,
        companyId: company.id
      }
    ]);

    console.log(`✅ ${employees.length} dipendenti creati`);

    // Crea dati finanziari di esempio (ultimi 6 mesi)
    const financialRecords = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      // Simula dati finanziari realistici
      const baseRevenue = 50000 + (Math.random() * 20000);
      const baseExpenses = 30000 + (Math.random() * 15000);
      
      financialRecords.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        category: 'Operazioni Mensili',
        description: `Dati finanziari per ${date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`,
        companyId: company.id,
        createdBy: adminUser.id
      });
    }

    await FinancialData.bulkCreate(financialRecords);
    console.log(`✅ ${financialRecords.length} record finanziari creati`);

    // Crea alcuni assessment di esempio
    const assessments = [];
    for (const employee of employees) {
      const testTypes = ['cognitive', 'personality', 'technical'];
      const randomTestType = testTypes[Math.floor(Math.random() * testTypes.length)];
      
      assessments.push({
        employeeId: employee.id,
        companyId: company.id,
        testType: randomTestType,
        responses: [
          { questionId: 'q1', answer: 'A' },
          { questionId: 'q2', answer: 'B' },
          { questionId: 'q3', answer: 'C' }
        ],
        overallScore: Math.floor(Math.random() * 30) + 70, // Score tra 70-100
        insights: [
          'Eccellenti capacità analitiche',
          'Buona collaborazione in team',
          'Potenziale di crescita elevato'
        ],
        conductedBy: adminUser.id,
        completedAt: new Date()
      });
    }

    await Assessment.bulkCreate(assessments);
    console.log(`✅ ${assessments.length} assessment creati`);

    console.log('🎉 Seeding completato con successo!');
    console.log('\n📋 Credenziali di accesso:');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: admin123');
    console.log(`Azienda: ${company.name}`);

  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
    throw error;
  }
};

// Esegui solo se chiamato direttamente
if (require.main === module) {
  const { syncDatabase } = require('../models');
  
  const runSeed = async () => {
    await syncDatabase(true); // true = ricrea le tabelle
    await seedDatabase();
    process.exit(0);
  };
  
  runSeed().catch(error => {
    console.error('Errore:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase };

