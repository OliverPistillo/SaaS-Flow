# chat-ai-service\main.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=['*'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# In-memory storage for chat messages
chat_sessions = {}

@app.route('/api/v1/chat/message', methods=['POST'])
def send_chat_message():
    """Send a message to the AI chat"""
    data = request.get_json()
    
    user_message = data.get('message', '').strip()
    session_id = data.get('sessionId', 'default')
    user_id = data.get('userId', 'user')
    
    if not user_message:
        return jsonify({
            'success': False,
            'message': 'Message cannot be empty'
        }), 400
    
    # Initialize session if not exists
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    
    # Add user message
    user_msg = {
        'id': str(uuid.uuid4()),
        'message': user_message,
        'sender': 'user',
        'timestamp': datetime.now().isoformat(),
        'messageType': 'text'
    }
    chat_sessions[session_id].append(user_msg)
    
    # Generate AI response based on message content
    ai_response = generate_ai_response(user_message, session_id)
    
    # Add AI response
    ai_msg = {
        'id': str(uuid.uuid4()),
        'message': ai_response['message'],
        'sender': 'ai',
        'timestamp': datetime.now().isoformat(),
        'messageType': ai_response.get('type', 'text'),
        'context': ai_response.get('context', {})
    }
    chat_sessions[session_id].append(ai_msg)
    
    return jsonify({
        'success': True,
        'data': {
            'userMessage': user_msg,
            'aiResponse': ai_msg,
            'sessionId': session_id
        }
    })

@app.route('/api/v1/chat/history/<session_id>', methods=['GET'])
def get_chat_history(session_id):
    """Get chat history for a session"""
    history = chat_sessions.get(session_id, [])
    
    return jsonify({
        'success': True,
        'data': {
            'sessionId': session_id,
            'messages': history,
            'total': len(history)
        }
    })

@app.route('/api/v1/chat/sessions', methods=['GET'])
def get_chat_sessions():
    """Get all chat sessions"""
    sessions = []
    for session_id, messages in chat_sessions.items():
        if messages:
            last_message = messages[-1]
            sessions.append({
                'sessionId': session_id,
                'lastMessage': last_message['message'][:50] + '...' if len(last_message['message']) > 50 else last_message['message'],
                'lastActivity': last_message['timestamp'],
                'messageCount': len(messages)
            })
    
    return jsonify({
        'success': True,
        'data': sessions
    })

def generate_ai_response(user_message, session_id):
    """Generate AI response based on user message"""
    message_lower = user_message.lower()
    
    # Expense tracking flow
    if any(keyword in message_lower for keyword in ['add expense', 'expense', 'spesa', 'costo']):
        return handle_expense_flow(user_message, session_id)
    
    # Income tracking flow
    elif any(keyword in message_lower for keyword in ['add income', 'income', 'entrata', 'ricavo']):
        return handle_income_flow(user_message, session_id)
    
    # Report generation
    elif any(keyword in message_lower for keyword in ['report', 'rapporto', 'analisi']):
        return {
            'message': '📊 Che tipo di report vorresti generare? Posso creare report per:\n• Entrate e uscite mensili\n• Analisi delle categorie\n• Bilancio annuale\n• Cash flow',
            'type': 'report',
            'context': {'action': 'report_selection'}
        }
    
    # Account management
    elif any(keyword in message_lower for keyword in ['account', 'conto', 'saldo']):
        return {
            'message': '🏦 Posso aiutarti con la gestione degli account. Vuoi:\n• Vedere il saldo degli account\n• Aggiungere un nuovo account\n• Modificare un account esistente',
            'type': 'account',
            'context': {'action': 'account_management'}
        }
    
    # Client management
    elif any(keyword in message_lower for keyword in ['client', 'cliente', 'customer']):
        return {
            'message': '👥 Gestione clienti attiva! Posso aiutarti a:\n• Aggiungere un nuovo cliente\n• Cercare un cliente esistente\n• Modificare i dettagli di un cliente',
            'type': 'client',
            'context': {'action': 'client_management'}
        }
    
    # General help
    elif any(keyword in message_lower for keyword in ['help', 'aiuto', 'cosa puoi fare']):
        return {
            'message': '👋 Ciao! Sono il tuo assistente finanziario AI. Posso aiutarti con:\n\n💰 **Gestione Transazioni**\n• Aggiungere entrate e uscite\n• Categorizzare le spese\n• Tracciare i pagamenti\n\n📊 **Report e Analisi**\n• Generare report finanziari\n• Analizzare trend di spesa\n• Monitorare cash flow\n\n👥 **Gestione Clienti**\n• Aggiungere nuovi clienti\n• Gestire contatti\n• Tracciare pagamenti clienti\n\n🏦 **Account Management**\n• Gestire conti bancari\n• Monitorare saldi\n• Riconciliare transazioni\n\nCosa posso fare per te oggi?',
            'type': 'help'
        }
    
    # Default response
    else:
        return {
            'message': '🤔 Non sono sicuro di aver capito. Puoi dirmi cosa vorresti fare? Ad esempio:\n• "Aggiungi una spesa"\n• "Mostra il report mensile"\n• "Gestisci clienti"\n• "Aiuto" per vedere tutte le opzioni',
            'type': 'clarification'
        }

def handle_expense_flow(user_message, session_id):
    """Handle expense addition flow"""
    # Get conversation context
    history = chat_sessions.get(session_id, [])
    recent_messages = [msg for msg in history[-10:] if msg['sender'] == 'user']
    
    # Check if we're in an expense flow
    if len(recent_messages) >= 2:
        prev_message = recent_messages[-2]['message'].lower() if len(recent_messages) >= 2 else ''
        
        # If previous message was about expense category
        if 'expense for' in prev_message or 'spesa per' in prev_message:
            # This should be the amount
            try:
                amount = extract_amount(user_message)
                if amount:
                    return {
                        'message': f'Perfetto! Hai speso €{amount}. Come hai pagato? (Bonifico bancario, contanti, carta, ecc.)',
                        'type': 'expense_flow',
                        'context': {'step': 'payment_method', 'amount': amount}
                    }
            except:
                pass
        
        # If we're asking for payment method
        elif 'come hai pagato' in [msg['message'].lower() for msg in history[-3:] if msg['sender'] == 'ai']:
            payment_method = user_message.lower()
            return {
                'message': 'Ottimo! Vuoi aggiungere delle note per questa spesa?',
                'type': 'expense_flow',
                'context': {'step': 'notes', 'payment_method': payment_method}
            }
        
        # If we're asking for notes
        elif 'vuoi aggiungere delle note' in [msg['message'].lower() for msg in history[-3:] if msg['sender'] == 'ai']:
            notes = user_message
            return {
                'message': f'Tutto fatto! 📝 La tua spesa è stata registrata. Vuoi aggiungere un\'altra transazione?',
                'type': 'expense_complete',
                'context': {'step': 'complete', 'notes': notes}
            }
    
    # Initial expense flow
    return {
        'message': 'Perfetto! 😊 Per cosa è questa spesa?',
        'type': 'expense_flow',
        'context': {'step': 'category'}
    }

def handle_income_flow(user_message, session_id):
    """Handle income addition flow"""
    # Similar logic to expense flow but for income
    history = chat_sessions.get(session_id, [])
    recent_messages = [msg for msg in history[-10:] if msg['sender'] == 'user']
    
    if len(recent_messages) >= 2:
        prev_ai_messages = [msg['message'].lower() for msg in history[-5:] if msg['sender'] == 'ai']
        
        if any('da dove proviene' in msg for msg in prev_ai_messages):
            # This should be the amount
            try:
                amount = extract_amount(user_message)
                if amount:
                    return {
                        'message': f'Eccellente! Hai ricevuto €{amount}. Come hai ricevuto il pagamento?',
                        'type': 'income_flow',
                        'context': {'step': 'payment_method', 'amount': amount}
                    }
            except:
                pass
    
    # Initial income flow
    return {
        'message': 'Fantastico! 💰 Da dove proviene questa entrata?',
        'type': 'income_flow',
        'context': {'step': 'source'}
    }

def extract_amount(text):
    """Extract amount from text"""
    import re
    
    # Look for patterns like €100, $100, 100€, 100$, or just 100
    patterns = [
        r'[€$](\d+(?:[.,]\d{2})?)',
        r'(\d+(?:[.,]\d{2})?)[€$]',
        r'(\d+(?:[.,]\d{2})?)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            amount_str = match.group(1)
            # Replace comma with dot for float conversion
            amount_str = amount_str.replace(',', '.')
            try:
                return float(amount_str)
            except ValueError:
                continue
    
    return None

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)

