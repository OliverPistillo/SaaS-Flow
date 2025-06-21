# do-flow-api/src/main.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import uuid
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
import bcrypt

app = Flask(__name__)
CORS(app, origins=['*'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Configuration
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET', 'your-secret-key-here')

# In-memory storage for demo purposes
transactions = []
clients = []
accounts = []
users = []
chat_messages = []
user_preferences = {}

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]  # Remove 'Bearer ' prefix
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['userId']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

# Authentication endpoints
@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    email_or_phone = data.get('emailOrPhone')
    password = data.get('password')
    
    if not email_or_phone or not password:
        return jsonify({
            'success': False,
            'message': 'Email/telefono e password sono richiesti'
        }), 400
    
    # Find user (demo user for testing)
    demo_user = {
        'id': 'user-1',
        'email': 'admin@doflow.com',
        'password': 'password123',  # In real app, this would be hashed
        'firstName': 'Admin',
        'lastName': 'User',
        'role': 'admin'
    }
    
    if email_or_phone in [demo_user['email'], 'admin'] and password == demo_user['password']:
        # Generate JWT token
        token = jwt.encode({
            'userId': demo_user['id'],
            'email': demo_user['email'],
            'role': demo_user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Login effettuato con successo',
            'data': {
                'user': {
                    'id': demo_user['id'],
                    'email': demo_user['email'],
                    'firstName': demo_user['firstName'],
                    'lastName': demo_user['lastName'],
                    'role': demo_user['role']
                },
                'token': token
            }
        })
    
    return jsonify({
        'success': False,
        'message': 'Credenziali non valide'
    }), 401

@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    """User registration"""
    data = request.get_json()
    
    # For demo purposes, create a simple user
    user_id = str(uuid.uuid4())
    
    # Generate JWT token
    token = jwt.encode({
        'userId': user_id,
        'email': data.get('email'),
        'role': 'admin',
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'success': True,
        'message': 'Registrazione completata con successo',
        'data': {
            'user': {
                'id': user_id,
                'email': data.get('email'),
                'firstName': data.get('firstName'),
                'lastName': data.get('lastName'),
                'role': 'admin'
            },
            'company': {
                'id': str(uuid.uuid4()),
                'name': data.get('companyName'),
                'industry': data.get('industry')
            },
            'token': token
        }
    }), 201

# Health check endpoint (no auth required)
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0',
        'service': 'Do-Flow Enhanced Backend API'
    })

# Protected routes with authentication
@app.route('/api/v1/transactions', methods=['GET'])
@token_required
def get_transactions(current_user_id):
    """Get all transactions with filtering options"""
    transaction_type = request.args.get('type')
    category = request.args.get('category')
    limit = request.args.get('limit', 50, type=int)
    
    filtered_transactions = transactions.copy()
    
    if transaction_type:
        filtered_transactions = [t for t in filtered_transactions if t['type'] == transaction_type]
    
    if category:
        filtered_transactions = [t for t in filtered_transactions if t['category'].lower() == category.lower()]
    
    filtered_transactions.sort(key=lambda x: x['createdAt'], reverse=True)
    filtered_transactions = filtered_transactions[:limit]
    
    return jsonify({
        'success': True,
        'data': filtered_transactions,
        'total': len(filtered_transactions)
    })

# Add @token_required to all other endpoints...
# (Rest of the original endpoints with authentication added)

# Demo data includes authentication test user
def initialize_demo_data():
    """Initialize demo data including test user"""
    global transactions, clients, accounts, users
    
    # Demo user for testing
    demo_user = {
        'id': 'user-1',
        'email': 'admin@doflow.com',
        'firstName': 'Admin',
        'lastName': 'User',
        'role': 'admin',
        'companyId': 'company-1'
    }
    users.append(demo_user)
    
    # ... rest of original demo data initialization

# Initialize demo data on startup
initialize_demo_data()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)