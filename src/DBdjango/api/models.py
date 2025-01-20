from django.db import models

# Create your models here.
class Eventos_riesgos_js(models.Model):
    id = models.IntegerField(primary_key=True)
    fecha = models.DateTimeField()
    involucrados = models.IntegerField()
    duracion = models.IntegerField()
    url_imagen = models.TextField()
    sector = models.CharField(max_length=100)
    factor_riesgo = models.TextField()
    video = models.TextField(blank=True, null=True)
    ancho_imagen = models.IntegerField(blank=True, null=True)
    alto_imagen = models.IntegerField(blank=True, null=True)
    video_generado = models.BooleanField(default=False)
    revisado = models.BooleanField(default=False)
    baja_probabilidad = models.BooleanField(blank=True, null=True)
    
    class Meta:
        db_table = "eventos_riesgos_js"  
        managed = False  


    
class coords(models.Model):
    id_foto = models.TextField()
    x = models.FloatField()
    y = models.FloatField()
    clase = models.TextField()

    class Meta:
        db_table = "coords"  
        managed = False  
