from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection

NOMBRE_TABLA = "dataset2"

def index(request):
    return JsonResponse({"mensaje": "API de eventos de riesgos funcionando"}, status=200)

def get_sectores(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT DISTINCT sector FROM {NOMBRE_TABLA}")
            rows = cursor.fetchall()
        data = [{"name": row[0]} for row in rows]
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def get_factores(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT DISTINCT factor_de_riesgo FROM {NOMBRE_TABLA}")
            rows = cursor.fetchall()
        data = [{"name": row[0]} for row in rows]
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_kpis(request):
    try:
        start_date = request.GET.get('startdate')
        end_date = request.GET.get('enddate')
        sector = request.GET.get('sector')
        factor = request.GET.get('factor')

        consulta = f"""
            SELECT 
                COUNT(*) AS Total_eventos,
                AVG(duracion) AS Promedio_duracion,
                AVG(involucrado) AS Promedio_involucrado
            FROM {NOMBRE_TABLA}
            WHERE fecha BETWEEN %s AND %s
        """
        parametros = [start_date, end_date]

        if sector:
            consulta += " AND sector = %s"
            parametros.append(sector)
        if factor:
            consulta += " AND factor_de_riesgo = %s"
            parametros.append(factor)

        with connection.cursor() as cursor:
            cursor.execute(consulta, parametros)
            rows = cursor.fetchall()
        
        data = {
            "Total_eventos": rows[0][0] or 0,
            "Promedio_duracion": rows[0][1] or 0,
            "Promedio_involucrado": rows[0][2] or 0,
        }

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_stats_per_month(request):
    try:
        start_date = request.GET.get('startdate')
        end_date = request.GET.get('enddate')
        sector = request.GET.get('sector')
        factor = request.GET.get('factor')

        consulta = f"""
            SELECT 
                 DATE_TRUNC('month', fecha) AS mes,
                COUNT(*) AS Total_eventos,
                AVG(duracion) AS Promedio_duracion,
                AVG(involucrado) AS Promedio_involucrado
            FROM {NOMBRE_TABLA}
            WHERE fecha BETWEEN %s AND %s
        """
        parametros = [start_date, end_date]

        if sector:
            consulta += " AND sector = %s"
            parametros.append(sector)
        if factor:
            consulta += " AND factor_de_riesgo = %s"
            parametros.append(factor)
            
        consulta += " GROUP BY mes ORDER BY mes;"
        
        with connection.cursor() as cursor:
            cursor.execute(consulta, parametros)
            rows = cursor.fetchall()
        
        data = [
            {
                "mes": row[0].strftime("%Y-%m-%d"),
                "Total_eventos": row[1],
                "Promedio_duracion": row[2],
                "Promedio_involucrado": row[3],
            }
            for row in rows
        ]

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_total_per_factor(request):
    try:
        start_date = request.GET.get('startdate')
        end_date = request.GET.get('enddate')
        sector = request.GET.get('sector')
        factor = request.GET.get('factor')

        consulta = f"""
            SELECT
                factor_de_riesgo,
                COUNT(*) AS Total_eventos
            FROM {NOMBRE_TABLA}
            WHERE fecha BETWEEN %s AND %s
        """
        parametros = [start_date, end_date]

        if sector:
            consulta += " AND sector = %s"
            parametros.append(sector)
        if factor:
            consulta += " AND factor_de_riesgo = %s"
            parametros.append(factor)
            
        consulta += " GROUP BY factor_de_riesgo"
        
        with connection.cursor() as cursor:
            cursor.execute(consulta, parametros)
            rows = cursor.fetchall()
        
        data = [
            {
                "Factor_de_riesgo": row[0],
                "Total_eventos": row[1],
            }
            for row in rows
        ]

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_total_per_sector(request):
    try:
        start_date = request.GET.get('startdate')
        end_date = request.GET.get('enddate')
        sector = request.GET.get('sector')
        factor = request.GET.get('factor')

        consulta = f"""
            SELECT
                DATE_TRUNC('month', fecha) AS mes,
                sector,
                COUNT(*) AS Total_eventos
            FROM {NOMBRE_TABLA}
            WHERE fecha BETWEEN %s AND %s
        """
        parametros = [start_date, end_date]

        if sector:
            consulta += " AND sector = %s"
            parametros.append(sector)
        if factor:
            consulta += " AND factor_de_riesgo = %s"
            parametros.append(factor)
            
        consulta += " GROUP BY sector, mes ORDER BY mes"
        
        with connection.cursor() as cursor:
            cursor.execute(consulta, parametros)
            rows = cursor.fetchall()
        
        data = [
            {
                "mes": row[0].strftime("%Y-%m-%d"),
                "sector": row[1],
                "Total_eventos": row[2],
            }
            for row in rows
        ]

        return JsonResponse(data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_data(request):
    try:
        start_date = request.GET.get('startdate')
        end_date = request.GET.get('enddate')
        sector = request.GET.get('sector')
        factor = request.GET.get('factor')

        consulta = f"""
            SELECT *
            FROM {NOMBRE_TABLA}
            WHERE fecha BETWEEN %s AND %s
        """
        parametros = [start_date, end_date]

        if sector:
            consulta += " AND sector = %s"
            parametros.append(sector)
        if factor:
            consulta += " AND factor_de_riesgo = %s"
            parametros.append(factor)
        
        with connection.cursor() as cursor:
            cursor.execute(consulta, parametros)
            rows = cursor.fetchall()
        
        return JsonResponse(rows, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
