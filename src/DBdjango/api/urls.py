from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sectores_disponibles', views.get_sectores, name='get_sectores'),
    path('factor_riesgo', views.get_factores, name='get_factores'),
    path('heatmap_fecha_hora', views.get_heatmap, name='get_heatmap'),
    path('incidentes', views.get_incidentes, name='get_incidentes'),
    path('coords', views.get_coords, name='get_coords'),
]