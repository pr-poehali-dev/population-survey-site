import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    '''Создает подключение к базе данных'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для работы с опросами - получение статистики и сохранение ответов
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            action = params.get('action', 'stats')
            survey_id = int(params.get('survey_id', 1))
            
            if action == 'stats':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('''
                        SELECT COUNT(*) as total_responses 
                        FROM survey_responses 
                        WHERE survey_id = %s
                    ''', (survey_id,))
                    total = cur.fetchone()['total_responses']
                    
                    cur.execute('''
                        SELECT 
                            answer_value,
                            COUNT(*) as count
                        FROM question_answers qa
                        JOIN survey_responses sr ON qa.response_id = sr.id
                        WHERE sr.survey_id = %s AND qa.question_id = 3
                        GROUP BY answer_value
                    ''', (survey_id,))
                    question_results = cur.fetchall()
                    
                    total_float = float(total) if total > 0 else 1.0
                    question_data = [
                        {
                            'option': row['answer_value'],
                            'count': row['count'],
                            'percentage': round((row['count'] / total_float) * 100, 1)
                        }
                        for row in question_results
                    ]
                    
                    cur.execute('''
                        SELECT user_age, COUNT(*) as count
                        FROM survey_responses
                        WHERE survey_id = %s AND user_age IS NOT NULL
                        GROUP BY user_age
                    ''', (survey_id,))
                    age_data = cur.fetchall()
                    
                    age_groups = [
                        {'range': '18-24', 'count': 0},
                        {'range': '25-34', 'count': 0},
                        {'range': '35-44', 'count': 0},
                        {'range': '45-54', 'count': 0},
                        {'range': '55+', 'count': 0}
                    ]
                    
                    for row in age_data:
                        age = row['user_age']
                        count = row['count']
                        if 18 <= age <= 24:
                            age_groups[0]['count'] += count
                        elif 25 <= age <= 34:
                            age_groups[1]['count'] += count
                        elif 35 <= age <= 44:
                            age_groups[2]['count'] += count
                        elif 45 <= age <= 54:
                            age_groups[3]['count'] += count
                        elif age >= 55:
                            age_groups[4]['count'] += count
                    
                    for group in age_groups:
                        group['percentage'] = round((group['count'] / total_float) * 100, 1) if total > 0 else 0
                    
                    result = {
                        'totalResponses': total,
                        'questionResults': [{
                            'question': 'Занятия в спортивной организации',
                            'data': question_data
                        }],
                        'demographics': {
                            'age': age_groups
                        },
                        'averageRating': 0
                    }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(result),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            survey_id = body_data.get('surveyId', 1)
            answers = body_data.get('answers', {})
            
            with conn.cursor() as cur:
                cur.execute('''
                    INSERT INTO survey_responses (survey_id, user_age, user_gender)
                    VALUES (%s, %s, %s)
                    RETURNING id
                ''', (
                    survey_id,
                    int(answers.get('1')) if answers.get('1') and answers.get('1').isdigit() else None,
                    answers.get('0')
                ))
                response_id = cur.fetchone()[0]
                
                for question_idx, answer_value in answers.items():
                    question_number = int(question_idx) + 1
                    
                    cur.execute('''
                        SELECT id FROM questions 
                        WHERE survey_id = %s AND question_number = %s
                    ''', (survey_id, question_number))
                    question_row = cur.fetchone()
                    
                    if question_row:
                        question_id = question_row[0]
                        
                        if isinstance(answer_value, dict):
                            cur.execute('''
                                INSERT INTO question_answers (response_id, question_id, answer_json)
                                VALUES (%s, %s, %s)
                            ''', (response_id, question_id, json.dumps(answer_value)))
                        else:
                            cur.execute('''
                                INSERT INTO question_answers (response_id, question_id, answer_value)
                                VALUES (%s, %s, %s)
                            ''', (response_id, question_id, str(answer_value)))
                
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'responseId': response_id}),
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
