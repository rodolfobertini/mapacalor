import folium
from folium.plugins import HeatMap
import pandas as pd
from geopy.distance import geodesic
from branca.colormap import LinearColormap
import locale

# Configurar o locale para formato de moeda brasileira
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

# Carregar os dados
dados = pd.read_csv('/home/rodolfo/dev/mapacalor/bezerra-v2.csv')  # Substitua pelo caminho do seu arquivo

# Agrupar os dados por localização (latitude e longitude)
agrupado = dados.groupby(['ven_lati', 'ven_long']).agg(
    quantidade_vendas=('ven_vlrnot', 'count'),  # Contar número de vendas
    valor_total=('ven_vlrnot', 'sum')          # Somar valores das vendas
).reset_index()

# Criar o mapa principal
mapa = folium.Map(location=[-3.73367, -38.5543], zoom_start=13)

### CAMADA 1: MAPA DE CALOR ###
# Filtrar os dados para incluir apenas valores totais acima de 20
agrupado_filtrado = agrupado[agrupado['valor_total'] > 20]

# Criar um colormap para a legenda (baseado no valor total das vendas filtradas)
colormap_valor = LinearColormap(
    colors=['green', 'yellow', 'red'],  # Cores da escala (verde -> amarelo -> vermelho)
    vmin=agrupado_filtrado['valor_total'].min(),  # Valor mínimo (após o filtro)
    vmax=agrupado_filtrado['valor_total'].max(),  # Valor máximo (após o filtro)
    caption='Valor Total das Vendas (Acima de R$20)'  # Título da legenda
)

# Criar uma camada para o mapa de calor
heatmap_layer = folium.FeatureGroup(name="Mapa de Calor", show=True)

# Adicionar o mapa de calor baseado no valor total das vendas filtradas
HeatMap(data=agrupado_filtrado[['ven_lati', 'ven_long', 'valor_total']].values, radius=15).add_to(heatmap_layer)

# Adicionar a camada ao mapa principal
heatmap_layer.add_to(mapa)

# Adicionar a legenda ao mapa principal
colormap_valor.add_to(mapa)

### CAMADA 2: QUADRANTES COM VALORES ###
# Função para calcular deslocamento em latitude e longitude
def deslocar_coordenadas(lat, lon, deslocamento_lat, deslocamento_lon):
    nova_lat = geodesic(meters=deslocamento_lat).destination((lat, lon), bearing=0).latitude
    nova_lon = geodesic(meters=deslocamento_lon).destination((lat, lon), bearing=90).longitude
    return nova_lat, nova_lon

# Dimensões da grade (1200m x 1200m)
grid_size = 1200  # Tamanho do quadrante em metros quadrados
area_lat_km = 10  # Extensão da área em latitude (X km para cada lado)
area_lon_km = 10  # Extensão da área em longitude (Y km para cada lado)

# Criar uma camada para os quadrantes com valores
quadrantes_layer = folium.FeatureGroup(name="Quadrantes com Valores", show=True)

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
            ).add_to(quadrantes_layer)

            # Formatar valor como moeda brasileira
            valor_formatado = locale.currency(valor_total_quadrante, grouping=True)

            # Adicionar o valor total no centro do quadrante como marcador com fonte fixa de 18px.
            folium.Marker(
                location=[centro_lat, centro_lon],
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
            ).add_to(quadrantes_layer)

# Adicionar a camada de quadrantes ao mapa principal
quadrantes_layer.add_to(mapa)

### CONTROLE DE CAMADAS ###
folium.LayerControl(collapsed=False).add_to(mapa)

# Salvar o mapa final com as duas camadas integradas
mapa.save("/home/rodolfo/dev/mapacalor/mapa_com_camadas.html")
