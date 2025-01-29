from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sectores_disponibles', views.get_sectores, name='get_sectores'),
    path('factores_disponibles', views.get_factores, name='get_factores'),
    path('indicadores_kpi', views.get_kpis, name='indicadores_kpi'),
    path('data_por_mes', views.get_stats_per_month, name='data_por_mes'),
    path('data_por_factor', views.get_total_per_factor, name='data_por_factor'),
    path('data_por_sector', views.get_total_per_sector, name='data_por_sector'),
    path('data', views.get_data, name='data'),
]