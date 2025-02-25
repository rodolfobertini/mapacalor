import folium
from folium.plugins import HeatMap
import pandas as pd
from geopy.distance import geodesic

# Carregar os dados
dados = pd.read_csv('/home/rodolfo/dev/mapacalor/bezerra-v2.csv')  # Substitua pelo caminho do seu arquivo

# Agrupar os dados por localização (latitude e longitude)
agrupado = dados.groupby(['ven_lati', 'ven_long']).agg(
    quantidade_vendas=('ven_vlrnot', 'count'),  # Contar número de vendas
    valor_total=('ven_vlrnot', 'sum')          # Somar valores das vendas
).reset_index()

# Função para calcular deslocamento em latitude e longitude
def deslocar_coordenadas(lat, lon, deslocamento_lat, deslocamento_lon):
    """
    Calcula novas coordenadas com base em deslocamentos de distância.
    """
    nova_lat = geodesic(meters=deslocamento_lat).destination((lat, lon), bearing=0).latitude
    nova_lon = geodesic(meters=deslocamento_lon).destination((lat, lon), bearing=90).longitude
    return nova_lat, nova_lon

# Dimensões da grade (500m x 500m)
grid_size = 2000  # Tamanho do quadrante em metros (500m²)
area_lat_km = 7  # Extensão da área em latitude (10 km para cada lado)
area_lon_km = 7  # Extensão da área em longitude (10 km para cada lado)

# Criar o mapa principal
mapa = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)

# Gerar os quadrados da grade e calcular o valor total de pedidos em cada quadrante
for i in range(-area_lat_km * 1000 // grid_size, area_lat_km * 1000 // grid_size):
    for j in range(-area_lon_km * 1000 // grid_size, area_lon_km * 1000 // grid_size):
        # Calcular os vértices do quadrante
        lat1, lon1 = deslocar_coordenadas(-3.73367, -38.5543, i * grid_size, j * grid_size)
        lat2, lon2 = deslocar_coordenadas(-3.73367, -38.5543, (i + 1) * grid_size, j * grid_size)
        lat3, lon3 = deslocar_coordenadas(-3.73367, -38.5543, (i + 1) * grid_size, (j + 1) * grid_size)
        lat4, lon4 = deslocar_coordenadas(-3.73367, -38.5543, i * grid_size, (j + 1) * grid_size)

        # Calcular o centro do quadrante
        centro_lat = (lat1 + lat3) / 2
        centro_lon = (lon1 + lon3) / 2

        # Verificar quais pontos estão dentro do quadrante
        dentro_do_quadrante = agrupado[
            (agrupado['ven_lati'] >= min(lat1, lat2)) &
            (agrupado['ven_lati'] <= max(lat1, lat2)) &
            (agrupado['ven_long'] >= min(lon1, lon4)) &
            (agrupado['ven_long'] <= max(lon1, lon4))
        ]

        # Calcular o valor total de pedidos no quadrante
        valor_total_quadrante = dentro_do_quadrante['valor_total'].sum()

        # Adicionar ao mapa apenas se houver vendas no quadrante
        if valor_total_quadrante > 0:
            # Adicionar o quadrante ao mapa como um polígono
            folium.Polygon(
                locations=[(lat1, lon1), (lat2, lon2), (lat3, lon3), (lat4, lon4)],
                color="blue",
                fill=True,
                fill_opacity=0.2,
                weight=0.5,
            ).add_to(mapa)

            # Adicionar o valor total no centro do quadrante como marcador
            folium.Marker(
                location=[centro_lat, centro_lon],
                icon=folium.DivIcon(html=f"<div style='font-size: 12px; color: black;'>{valor_total_quadrante:.2f}</div>")
            ).add_to(mapa)

# Salvar o mapa otimizado com a grade
mapa.save("/home/rodolfo/dev/mapacalor/mapa_com_grade_e_valores.html")
