from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
import os
from datetime import datetime, timedelta

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=['*'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# In-memory storage for demo purposes
transactions = []
clients = []
accounts = []
chat_messages = []
user_preferences = {}

# Health check endpoint
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0',
        'service': 'Do-Flow Enhanced Backend API'
    })

# ==================== TRANSACTIONS API ====================

@app.route('/api/v1/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions with filtering options"""
    transaction_type = request.args.get('type')  # income, expense, savings
    category = request.args.get('category')
    limit = request.args.get('limit', 50, type=int)
    
    filtered_transactions = transactions.copy()
    
    if transaction_type:
        filtered_transactions = [t for t in filtered_transactions if t['type'] == transaction_type]
    
    if category:
        filtered_transactions = [t for t in filtered_transactions if t['category'].lower() == category.lower()]
    
    # Sort by date (newest first) and limit
    filtered_transactions.sort(key=lambda x: x['createdAt'], reverse=True)
    filtered_transactions = filtered_transactions[:limit]
    
    return jsonify({
        'success': True,
        'data': filtered_transactions,
        'total': len(filtered_transactions)
    })

@app.route('/api/v1/transactions', methods=['POST'])
def create_transaction():
    """Create a new transaction"""
    data = request.get_json()
    
    # Generate transaction ID
    transaction_id = f"T{len(transactions) + 1:04d}"
    
    transaction = {
        'id': str(uuid.uuid4()),
        'transactionId': transaction_id,
        'category': data.get('category', ''),
        'name': data.get('name', ''),
        'details': data.get('details', ''),
        'amount': float(data.get('amount', 0)),
        'type': data.get('type', 'expense'),  # income, expense, savings
        'paymentMethod': data.get('paymentMethod', 'bank'),  # bank, cash, card
        'imageUrl': data.get('imageUrl', ''),
        'notes': data.get('notes', ''),
        'receivedDate': data.get('receivedDate', datetime.now().isoformat()),
        'clientId': data.get('clientId'),
        'accountId': data.get('accountId'),
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    transactions.append(transaction)
    
    return jsonify({
        'success': True,
        'data': transaction,
        'message': f'Transaction {transaction_id} created successfully'
    }), 201

@app.route('/api/v1/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    """Update an existing transaction"""
    data = request.get_json()
    
    for i, transaction in enumerate(transactions):
        if transaction['transactionId'] == transaction_id:
            # Update fields
            for key, value in data.items():
                if key in transaction:
                    transaction[key] = value
            
            transaction['updatedAt'] = datetime.now().isoformat()
            transactions[i] = transaction
            
            return jsonify({
                'success': True,
                'data': transaction,
                'message': 'Transaction updated successfully'
            })
    
    return jsonify({
        'success': False,
        'message': 'Transaction not found'
    }), 404

@app.route('/api/v1/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Delete a transaction"""
    global transactions
    
    transactions = [t for t in transactions if t['transactionId'] != transaction_id]
    
    return jsonify({
        'success': True,
        'message': 'Transaction deleted successfully'
    })

# ==================== CLIENTS API ====================

@app.route('/api/v1/clients', methods=['GET'])
def get_clients():
    """Get all clients"""
    return jsonify({
        'success': True,
        'data': clients
    })

@app.route('/api/v1/clients', methods=['POST'])
def create_client():
    """Create a new client"""
    data = request.get_json()
    
    # Generate client ID
    client_id = f"CL-{len(clients) + 1001}"
    
    client = {
        'id': str(uuid.uuid4()),
        'clientId': client_id,
        'name': data.get('name', ''),
        'email': data.get('email', ''),
        'phone': data.get('phone', ''),
        'address': data.get('address', ''),
        'contact': data.get('contact', ''),
        'companyType': data.get('companyType', ''),
        'notes': data.get('notes', ''),
        'isActive': True,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    clients.append(client)
    
    return jsonify({
        'success': True,
        'data': client,
        'message': f'Client {client_id} created successfully'
    }), 201

@app.route('/api/v1/clients/<client_id>', methods=['GET'])
def get_client(client_id):
    """Get a specific client"""
    for client in clients:
        if client['clientId'] == client_id:
            return jsonify({
                'success': True,
                'data': client
            })
    
    return jsonify({
        'success': False,
        'message': 'Client not found'
    }), 404

@app.route('/api/v1/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    """Update a client"""
    data = request.get_json()
    
    for i, client in enumerate(clients):
        if client['clientId'] == client_id:
            # Update fields
            for key, value in data.items():
                if key in client:
                    client[key] = value
            
            client['updatedAt'] = datetime.now().isoformat()
            clients[i] = client
            
            return jsonify({
                'success': True,
                'data': client,
                'message': 'Client updated successfully'
            })
    
    return jsonify({
        'success': False,
        'message': 'Client not found'
    }), 404

# ==================== ACCOUNTS API ====================

@app.route('/api/v1/accounts', methods=['GET'])
def get_accounts():
    """Get all accounts"""
    return jsonify({
        'success': True,
        'data': accounts
    })

@app.route('/api/v1/accounts', methods=['POST'])
def create_account():
    """Create a new account"""
    data = request.get_json()
    
    account = {
        'id': str(uuid.uuid4()),
        'name': data.get('name', ''),
        'type': data.get('type', 'bank'),  # bank, cash, card, savings
        'balance': float(data.get('balance', 0)),
        'accountNumber': data.get('accountNumber', ''),
        'bankName': data.get('bankName', ''),
        'description': data.get('description', ''),
        'isActive': True,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    accounts.append(account)
    
    return jsonify({
        'success': True,
        'data': account,
        'message': 'Account created successfully'
    }), 201

# ==================== ANALYTICS API ====================

@app.route('/api/v1/analytics/overview', methods=['GET'])
def get_analytics_overview():
    """Get analytics overview"""
    # Calculate totals from transactions
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    total_savings = sum(t['amount'] for t in transactions if t['type'] == 'savings')
    
    # Calculate monthly data
    monthly_data = []
    months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
    
    for i, month in enumerate(months):
        # Simulate monthly data
        income = total_income / 12 + (i * 1000)
        expense = total_expenses / 12 + (i * 800)
        savings = total_savings / 12 + (i * 200)
        
        monthly_data.append({
            'month': month,
            'income': round(income, 2),
            'expense': round(expense, 2),
            'savings': round(savings, 2)
        })
    
    overview = {
        'summary': {
            'totalIncome': round(total_income, 2),
            'totalExpenses': round(total_expenses, 2),
            'totalSavings': round(total_savings, 2),
            'netProfit': round(total_income - total_expenses, 2),
            'profitMargin': round(((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0, 1)
        },
        'monthlyData': monthly_data,
        'categoryBreakdown': {
            'income': {
                'salary': 52.1,
                'freelance': 22.8,
                'investments': 13.9,
                'other': 11.2
            },
            'expenses': {
                'rent': 35.0,
                'food': 20.0,
                'transport': 15.0,
                'utilities': 12.0,
                'other': 18.0
            }
        },
        'recentTransactions': transactions[-5:] if transactions else []
    }
    
    return jsonify({
        'success': True,
        'data': overview
    })

@app.route('/api/v1/analytics/reports', methods=['GET'])
def get_reports():
    """Get financial reports"""
    report_type = request.args.get('type', 'overview')
    period = request.args.get('period', 'yearly')
    
    if report_type == 'balance_sheet':
        report_data = {
            'assets': {
                'cash': 15000,
                'accounts_receivable': 8500,
                'inventory': 12000,
                'equipment': 25000,
                'total': 60500
            },
            'liabilities': {
                'accounts_payable': 5000,
                'loans': 15000,
                'total': 20000
            },
            'equity': {
                'retained_earnings': 40500,
                'total': 40500
            }
        }
    elif report_type == 'income_statement':
        report_data = {
            'revenue': 285000,
            'cost_of_goods_sold': 120000,
            'gross_profit': 165000,
            'operating_expenses': 95000,
            'operating_income': 70000,
            'net_income': 65000
        }
    else:
        # Overview report
        report_data = {
            'annual_revenue_2024': 285000,
            'total_costs_2024': 195000,
            'annual_saving_2024': 90000,
            'vat_tax_2024': 28500,
            'growth_metrics': {
                'revenue_growth': 15.2,
                'expense_growth': 8.7,
                'profit_growth': 22.1
            }
        }
    
    return jsonify({
        'success': True,
        'data': {
            'type': report_type,
            'period': period,
            'report': report_data,
            'generated_at': datetime.now().isoformat()
        }
    })

# ==================== USER PREFERENCES API ====================

@app.route('/api/v1/preferences', methods=['GET'])
def get_user_preferences():
    """Get user preferences"""
    user_id = request.args.get('userId', 'default')
    
    if user_id not in user_preferences:
        user_preferences[user_id] = {
            'theme': 'light',
            'language': 'it',
            'currency': 'EUR',
            'dateFormat': 'DD/MM/YYYY',
            'notifications': {
                'email': True,
                'push': True,
                'sms': False
            },
            'rememberLogin': False
        }
    
    return jsonify({
        'success': True,
        'data': user_preferences[user_id]
    })

@app.route('/api/v1/preferences', methods=['PUT'])
def update_user_preferences():
    """Update user preferences"""
    data = request.get_json()
    user_id = data.get('userId', 'default')
    
    if user_id not in user_preferences:
        user_preferences[user_id] = {}
    
    # Update preferences
    for key, value in data.items():
        if key != 'userId':
            user_preferences[user_id][key] = value
    
    return jsonify({
        'success': True,
        'data': user_preferences[user_id],
        'message': 'Preferences updated successfully'
    })

# ==================== DEMO DATA INITIALIZATION ====================

def initialize_demo_data():
    """Initialize demo data for testing"""
    global transactions, clients, accounts
    
    # Demo clients
    demo_clients = [
        {
            'id': str(uuid.uuid4()),
            'clientId': 'CL-1001',
            'name': 'Atlas Tech Ltd.',
            'email': 'contact@atlastech.com',
            'phone': '0024654584',
            'address': 'Dhanmondi Branch 2',
            'contact': 'John Smith',
            'companyType': 'Technology',
            'notes': 'Regular client for software services',
            'isActive': True,
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'clientId': 'CL-1002',
            'name': 'General Electric',
            'email': 'info@ge.com',
            'phone': '541515695',
            'address': 'Industrial District',
            'contact': 'Sarah Johnson',
            'companyType': 'Manufacturing',
            'notes': 'Equipment supplier',
            'isActive': True,
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
    ]
    
    # Demo accounts
    demo_accounts = [
        {
            'id': str(uuid.uuid4()),
            'name': 'Main Bank Account',
            'type': 'bank',
            'balance': 25000.00,
            'accountNumber': 'ACC-001',
            'bankName': 'Primary Bank',
            'description': 'Main business account',
            'isActive': True,
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'name': 'Cash Register',
            'type': 'cash',
            'balance': 2500.00,
            'accountNumber': '',
            'bankName': '',
            'description': 'Daily cash operations',
            'isActive': True,
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
    ]
    
    # Demo transactions
    demo_transactions = [
        {
            'id': str(uuid.uuid4()),
            'transactionId': '1s5gf1',
            'category': 'Salary',
            'name': 'Starbucks',
            'details': 'Dhanmondi Branch 2 Rent',
            'amount': 33200.00,
            'type': 'income',
            'paymentMethod': 'bank',
            'imageUrl': '',
            'notes': 'Monthly salary payment',
            'receivedDate': datetime.now().isoformat(),
            'clientId': demo_clients[0]['id'],
            'accountId': demo_accounts[0]['id'],
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'transactionId': 'dsrg515',
            'category': 'Office Rent',
            'name': 'Pizza Hut',
            'details': 'Dhanmondi Branch 2 Rent',
            'amount': 12200.00,
            'type': 'expense',
            'paymentMethod': 'bank',
            'imageUrl': '',
            'notes': 'Monthly office rent',
            'receivedDate': datetime.now().isoformat(),
            'clientId': None,
            'accountId': demo_accounts[0]['id'],
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        },
        {
            'id': str(uuid.uuid4()),
            'transactionId': '452hd',
            'category': 'Car Rent',
            'name': 'Car Rent',
            'details': 'Dhanmondi Branch 2 Rent',
            'amount': 1200.00,
            'type': 'expense',
            'paymentMethod': 'cash',
            'imageUrl': '',
            'notes': 'Vehicle rental for business',
            'receivedDate': datetime.now().isoformat(),
            'clientId': None,
            'accountId': demo_accounts[1]['id'],
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
    ]
    
    clients.extend(demo_clients)
    accounts.extend(demo_accounts)
    transactions.extend(demo_transactions)

# Initialize demo data on startup
initialize_demo_data()

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint non trovato',
        'message': 'La risorsa richiesta non esiste'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Errore interno del server',
        'message': 'Si è verificato un errore imprevisto'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

