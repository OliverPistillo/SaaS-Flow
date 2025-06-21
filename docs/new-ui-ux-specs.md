# Nuove Specifiche UI/UX e Funzionalità per Do-Flow

Questo documento riassume le nuove specifiche UI/UX e le funzionalità aggiuntive per l'applicazione Do-Flow, basate sull'allegato fornito dall'utente. L'obiettivo è integrare un design più dettagliato, temi White/Dark Mood, funzionalità finanziarie e HR avanzate, e una Chat AI.

## 1. Temi White/Dark Mood

L'applicazione dovrà supportare due temi principali:
- **White Mood**: Un tema chiaro con sfondi bianchi o chiari e testo scuro.
- **Dark Mood**: Un tema scuro con sfondi scuri e testo chiaro, per ridurre l'affaticamento visivo.

Sarà necessario implementare un meccanismo per permettere all'utente di passare da un tema all'altro.

## 2. Schermate di Autenticazione e Benvenuto

### Log In Screen
- **Layout**: Pulito e moderno, con campi per Email/Phone e Password.
- **Opzioni**: 


  - **"Remember for 30 Days"**: Checkbox per mantenere l'accesso.
  - **"Forget Password?"**: Link per il recupero password.
  - **"Don’t have an Account? Sign Up Free"**: Link alla pagina di registrazione.
  - **Opzioni di Login Social**: Bottoni per Google e Facebook.

### Sign Up Account
- **Layout**: Campi per First Name, Last Name, User Name, Email/Phone, Password.
- **Accordo Termini**: Checkbox "I agree to the Trams & Condition".
- **Opzioni di Registrazione Social**: Bottoni per Google e Facebook.
- **"Already have an account? Sign in"**: Link alla pagina di login.

### Welcome Screen
- **Messaggio di Benvenuto**: "Welcome Simi" (o nome utente).
- **Verifica Email**: Messaggi e flussi per la verifica dell'email:
  - "Verify Your E-mail"
  - "Confirm Your Email to Access Your Learning Resources!"
  - "Confirm Your Email to Access Incredible Learning Tools!"
  - "Welcome Back! Verify Your Email to Access Your Learning Portal!"
  - Campo per inserire OTP/Codice.
  - Opzione "Resend Code" con timer.
  - Messaggio di successo: "Congratulation Your details have been successfully recorded. The educational platform is currently being enhanced. Please give us a moment to ensure it provides accurate responses for our clients."

## 3. Dashboard Principale (Overview)

- **Layout**: Panoramica con dati finanziari e HR chiave.
- **Sezioni**: 
  - **Income Monthly**: Valore totale.
  - **Expense Monthly**: Valore totale.
  - **Analytics Yearly**: Grafico/valore annuale.
  - **Overview**: Riepilogo generale.
  - **Transactions**: Lista delle transazioni recenti con "See all" link.
  - **Reports**: Link alla sezione report.
- **Indicatori di Performance**: 
  - "Increase your Expanse 15% last 7 days"
  - "Increase your income 15% last 7 days"

## 4. Modulo Finanziario

### Financial Plan
- **Valori Chiave**: $12,153.00 (ripetuto più volte, indica valori importanti).
- **Sezioni**: 
  - Annual Revenue (2024)
  - Total Costs (2024)
  - Annual Saving (2024)
  - Vat/Tax (2024)

### Accounts
- **Panoramica**: "You can add your daily income and expanse".
- **Lista Account**: Visualizzazione degli account con ID, nome, saldo.
- **Add Accounts**: Bottone per aggiungere nuovi account.
- **Dettagli Transazioni**: 
  - T-ID, Category, Name, Details, Amount, Image, Transaction, Account, Edit.
  - Esempi di transazioni: Salary, Car Rent, Office Rent, Equipment's.
  - Tipo: Bank, Cash.
  - Income/Expanse.

### Income/Expense/Savings Input
- **Form di Inserimento**: Campi per:
  - Amount
  - Payment Method (Card, Bank, Cash)
  - Income Categories (Buy Car, Salary, etc.)
  - Client Name / Company, Received Date
  - Notes: Campo di testo dettagliato per le note.
  - Upload Proof (optional): Caricamento file (Max file size 50MB).
- **Flusso Guidato**: Messaggi come "Let's take a moment to add your income so we can better understand your financial situation."

### Reports
- **Sezioni Report**: 
  - Overview
  - Cost Analysis
  - Cash Flow
  - Taxes & Deadlines
  - Income & Expense Report (Yearly)
  - Income Analytics (Week, Yearly)
  - Category Analytics (Yearly)
- **Visualizzazioni**: Grafici a barre per Income/Expense/Savings con valori (0, 50K, 100K, 150K, 200K).
- **Dettagli Report**: Esempio "Atlas Tech Ltd. Income Details".

## 5. Modulo HR

### HR Test (AI Test)
- **Interfaccia**: Simile a una chat o un form guidato.
- **Input**: Richiesta di ruolo e difficoltà per il test attitudinale.
- **Output**: Risultati del test, valutazione delle competenze, insights personalizzati.

## 6. Chat AI

- **Interfaccia Chat**: Campo di input per domande e risposte AI.
- **Esempi di Interazione**: 
  - Utente: "I want to add an expense"
  - AI: "Sure thing! 😊 What’s the expense for?"
  - Utente: "Office rent"
  - AI: "Got it. How much did you pay for office rent?"
  - Utente: "$800"
  - AI: "And how did you pay it? (Bank, card, cash, etc.)"
  - Utente: "Bank transfer"
  - AI: "Perfect. Do you want to add any notes for this expense?"
  - Utente: "Rent for April"
  - AI: "All set! 📝 Your expense for $800 (Office Rent) has been recorded. Do you want to add another transaction?"
- **Funzionalità**: Assistenza vocale o testuale per l'inserimento di dati finanziari e HR, generazione di report, risposte a domande.

## 7. Altre Sezioni e Funzionalità

- **Profile**: Pagina profilo utente con opzioni di Log Out.
- **Upgrade**: Sezione per l'upgrade dell'account.
- **Search**: Funzionalità di ricerca per transazioni ("Search your bill").
- **Notes**: Sezione per note generiche.
- **Client Management**: Sezione per aggiungere e gestire i dettagli dei clienti.
  - Campi: Client Name / Company, Received Date, Email, Address, Contact.
  - Opzione "Save client details".

## 8. Considerazioni Generali

- **Design System**: Mantenere la coerenza visiva con il design esistente di Do-Flow e le nuove specifiche.
- **Responsive Design**: Tutte le schermate devono essere ottimizzate per dispositivi mobile e desktop.
- **Accessibilità**: Assicurare che l'applicazione sia accessibile a tutti gli utenti.
- **Performance**: Ottimizzare le prestazioni per un'esperienza utente fluida.

Questo documento servirà da guida per l'implementazione delle prossime fasi di sviluppo.

