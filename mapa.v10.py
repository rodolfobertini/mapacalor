import folium
from geopy.distance import geodesic
from branca.colormap import LinearColormap
import pandas as pd
import locale

# Configurar o locale para formato de moeda brasileira
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

# Carregar os dados
dados = pd.read_csv('/home/rodolfo/dev/mapacalor/bezerra-v3.csv')

# Agrupar os dados por localização (latitude e longitude)
agrupado = dados.groupby(['ven_lati', 'ven_long']).agg(
    quantidade_vendas=('ven_vlrnot', 'count'),
    valor_total=('ven_vlrnot', 'sum')
).reset_index()

# Criar o mapa principal
mapa = folium.Map(location=[-3.73367, -38.5543], zoom_start=13)

# Adicionar um marcador no ponto central do mapa (local da loja)
folium.Marker(
    location=[-3.73367, -38.5543],
    popup="Loja Central",
    icon=folium.Icon(color='blue', icon='info-sign')
).add_to(mapa)

def deslocar_coordenadas(lat, lon, deslocamento_lat, deslocamento_lon):
    nova_lat = geodesic(meters=deslocamento_lat).destination((lat, lon), bearing=0).latitude
    nova_lon = geodesic(meters=deslocamento_lon).destination((lat, lon), bearing=90).longitude
    return nova_lat, nova_lon

def gerar_mapa(grid_size=1200, valor_minimo=200):
    area_km = 10
    quadrantes = []

    for i in range(-area_km * 1000 // grid_size, area_km * 1000 // grid_size):
        for j in range(-area_km * 1000 // grid_size, area_km * 1000 // grid_size):
            lat1, lon1 = deslocar_coordenadas(-3.73367, -38.5543, i * grid_size, j * grid_size)
            lat3, lon3 = deslocar_coordenadas(-3.73367, -38.5543, (i + 1) * grid_size, (j + 1) * grid_size)

            dentro_do_quadrante = agrupado[
                (agrupado['ven_lati'] >= min(lat1, lat3)) &
                (agrupado['ven_lati'] <= max(lat1, lat3)) &
                (agrupado['ven_long'] >= min(lon1, lon3)) &
                (agrupado['ven_long'] <= max(lon1, lon3))
            ]

            valor_total_quadrante = dentro_do_quadrante['valor_total'].sum()
            if valor_total_quadrante > valor_minimo:
                quadrantes.append({
                    'lat1': lat1,
                    'lon1': lon1,
                    'lat3': lat3,
                    'lon3': lon3,
                    'centro_lat': (lat1 + lat3) / 2,
                    'centro_lon': (lon1 + lon3) / 2,
                    'valor_total': valor_total_quadrante
                })

    quadrantes.sort(key=lambda x: x['valor_total'])

    colormap_valor = LinearColormap(
        colors=["green", "yellow", "orange", "red"],
        vmin=0,
        vmax=len(quadrantes) - 1,
        caption='Valor Total das Vendas'
    )

    for idx, quadrante in enumerate(quadrantes):
        cor_quadrante = colormap_valor(idx)

        folium.Polygon(
            locations=[
                (quadrante['lat1'], quadrante['lon1']),
                (quadrante['lat1'], quadrante['lon3']),
                (quadrante['lat3'], quadrante['lon3']),
                (quadrante['lat3'], quadrante['lon1'])
            ],
            color=None,
            fill=True,
            fill_color=cor_quadrante,
            fill_opacity=0.6,
            weight=0,
        ).add_to(mapa)

        valor_formatado = locale.currency(quadrante['valor_total'], grouping=True)

        folium.Marker(
            location=[quadrante['centro_lat'], quadrante['centro_lon']],
            icon=folium.DivIcon(html=f"""
                <div style="
                    font-size: 12px; 
                    color: black; 
                    text-align: center; 
                    transform: translate(-50%, -50%);
                    width: {grid_size * 0.7}px;
                    height: {grid_size * 0.7}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;">
                    {valor_formatado}
                </div>
            """)
        ).add_to(mapa)

    colormap_valor.add_to(mapa)

gerar_mapa(grid_size=1000, valor_minimo=300)
mapa.save("/home/rodolfo/dev/mapacalor/mapa_quadrantes_calor_com_valores.html")
