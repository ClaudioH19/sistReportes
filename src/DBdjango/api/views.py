from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.db import connection

def index(request):
    return JsonResponse({"mensaje": "API de eventos de riesgos funcionando"}, status=200)


def get_sectores(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT DISTINCT sector FROM eventos_riesgos_js")
            rows = cursor.fetchall()
        data = [{"name": row[0]} for row in rows]
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
   
    
def get_factores(request):
    try:
        fecha_inicio = request.GET.get('fecha_inicio')
        fecha_fin = request.GET.get('fecha_fin')
        sector = request.GET.get('sector')

        with connection.cursor() as cursor:
            consulta = """SELECT factor_riesgo, COUNT(factor_riesgo) 
                FROM eventos_riesgos_js
                WHERE sector = %s AND fecha BETWEEN %s AND %s  
                GROUP BY factor_riesgo"""
            cursor.execute(consulta, [sector, fecha_inicio, fecha_fin])
            resp = cursor.fetchall()

        json = [{"name": factor, "value": value} for factor, value in resp]
        return JsonResponse(json, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



def get_heatmap(request):
    try:
        # Obtener parámetros de consulta desde request.GET
        fecha_inicio = request.GET.get('fecha_inicio')
        fecha_fin = request.GET.get('fecha_fin')
        sector = request.GET.get('sector')

        # Conexión a la base de datos y ejecución de la consulta
        with connection.cursor() as cursor:
            consulta = """
                SELECT date(fecha) AS fech,
                       extract(hour FROM date_trunc('hour', fecha)) AS hor,
                       count(extract(hour FROM date_trunc('hour', fecha)))
                FROM eventos_riesgos_js 
                WHERE sector = %s AND fecha BETWEEN %s AND %s
                GROUP BY hor, fech 
                ORDER BY fech
            """
            cursor.execute(consulta, [sector, fecha_inicio, fecha_fin])
            resp = cursor.fetchall()

        # Formatear la respuesta JSON
        json = [{"date": date, "hour": hour, "value": value} for date, hour, value in resp]
        return JsonResponse(json, safe=False, status=200)

    except Exception as e:
        # Manejo de errores
        return JsonResponse({"error": str(e)}, status=500)



def get_incidentes(request):
    try:
        # Obtener parámetros de consulta desde request.GET
        fecha_inicio = request.GET.get('fecha_inicio')
        fecha_fin = request.GET.get('fecha_fin')
        sector = request.GET.get('sector')

        # Conexión a la base de datos y ejecución de la consulta
        with connection.cursor() as cursor:
            consulta = """
                SELECT fecha, COUNT(DATE_TRUNC('hour', fecha)),
                       extract(hour FROM DATE_TRUNC('hour', fecha)) AS hora
                FROM eventos_riesgos_js 
                WHERE sector = %s AND fecha BETWEEN %s AND %s 
                GROUP BY fecha
            """
            cursor.execute(consulta, [sector, fecha_inicio, fecha_fin])
            resp = cursor.fetchall()

        # Formatear la respuesta JSON
        json = [{"name": fecha, "value": value, "hour": hour} for fecha, value, hour in resp]
        return JsonResponse(json, safe=False, status=200)

    except Exception as e:
        # Manejo de errores
        return JsonResponse({"error": str(e)}, status=500)



def get_coords(request):
    try:
        # Obtener parámetro 'sector' desde request.GET
        sector = request.GET.get('sector')

        # Conexión a la base de datos y ejecución de la consulta
        with connection.cursor() as cursor:
            consulta = """
                SELECT round(x/5)*5, round(y/5)*5, COUNT(*) as value
                FROM coords
                WHERE id_foto = %s
                GROUP BY round(x/5)*5, round(y/5)*5
                ORDER BY value
            """
            cursor.execute(consulta, [sector])
            resp = cursor.fetchall()

        # Formatear la respuesta JSON
        json = [[x, 1080 - y, value] for x, y, value in resp]
        return JsonResponse(json, safe=False, status=200)

    except Exception as e:
        # Manejo de errores
        return JsonResponse({"error": str(e)}, status=500)