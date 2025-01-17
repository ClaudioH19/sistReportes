from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime
from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  

load_dotenv()
def get_db_connection():
    connection = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )
    return connection


@app.route('/')
def index():
    return jsonify({"mensaje": "API de eventos de riesgos funcionando"}), 200


@app.route('/sectores_disponibles')
def get_sectores():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        consulta = """SELECT DISTINCT sector FROM eventos_riesgos_js"""
        cursor.execute(consulta)
        resp = cursor.fetchall()
        json = [{"name": sector[0]} for sector in resp]
        return jsonify(json), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/factor_riesgo')
def get_factores():
    try:
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        sector = request.args.get('sector')
        connection = get_db_connection()
        cursor = connection.cursor()
        consulta = """SELECT factor_riesgo, COUNT(factor_riesgo) 
            FROM eventos_riesgos_js
            WHERE sector = %s AND fecha BETWEEN %s AND %s  
            GROUP BY factor_riesgo"""
        cursor.execute(consulta, [sector, fecha_inicio, fecha_fin])
        resp = cursor.fetchall()
        json = [{"name": factor, "value": value} for factor, value in resp]
        return jsonify(json), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/heatmap_fecha_hora')
def get_heatmap():
    try:
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        sector = request.args.get('sector')
        connection = get_db_connection()
        cursor = connection.cursor()
        consulta = """select date(fecha) as fech,
                extract(hour from date_trunc('hour',fecha)) as hor,
                count(extract(hour from date_trunc('hour',fecha)))
                from eventos_riesgos_js 
                where sector=%s and fecha between %s and %s
                group by hor,fech order by fech"""
        cursor.execute(consulta, [sector, fecha_inicio, fecha_fin])
        resp = cursor.fetchall()
        json = [{"date": date,"hour":hour, "value": value} for date, hour, value in resp]
        return jsonify(json), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/incidentes')
def get_incidentes():
    try:
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        sector = request.args.get('sector')
        connection = get_db_connection()
        cursor = connection.cursor()
        consulta = """SELECT fecha,count(DATE_TRUNC('hour', fecha)),
                    extract(hour from DATE_TRUNC('hour', fecha)) AS hora
                    FROM eventos_riesgos_js 
                    WHERE sector=%s and fecha between %s and %s 
                    group by fecha"""
                    
        cursor.execute(consulta, [sector,fecha_inicio, fecha_fin])
        resp = cursor.fetchall()
        json = [{"name": fecha, "value": value, "hour": hour} for fecha, value, hour in resp]
        return jsonify(json), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/coords')
def get_coords():
    try:#nadie sabe por que (x/5)*5 era muy fino 
        #nadie sabe por que (x/5)*1.2 pasables
        sector = request.args.get('sector')
        connection = get_db_connection()
        cursor = connection.cursor()
        consulta = """select round(x/5)*5,round(y/5)*5,count(*) as value
                        from coords
                        where id_foto = %s
                        group by round(x/5)*5,round(y/5)*5
                        order by value"""
        cursor.execute(consulta,[sector])
        resp = cursor.fetchall()
        json = [[x,1080-y,value] for x, y, value in resp]
        return jsonify(json), 200
    
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
