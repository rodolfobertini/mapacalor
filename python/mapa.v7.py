import folium
from folium.plugins import HeatMap
import pandas as pd
from branca.colormap import LinearColormap

# Carregar os dados
dados = pd.read_csv('/home/rodolfo/dev/mapacalor/bezerra-v2.csv')  # Substitua pelo caminho do seu arquivo

# Agrupar os dados por localização (latitude e longitude)
agrupado = dados.groupby(['ven_lati', 'ven_long']).agg(
    quantidade_vendas=('ven_vlrnot', 'count'),  # Contar número de vendas
    valor_total=('ven_vlrnot', 'sum')          # Somar valores das vendas
).reset_index()

# Filtrar os dados para incluir apenas valores totais acima de 50
agrupado_filtrado = agrupado[agrupado['valor_total'] > 200]

# Criar um colormap para a legenda (baseado no valor total das vendas filtradas)
colormap_valor = LinearColormap(
    colors=['green', 'yellow', 'red'],  # Cores da escala (verde -> amarelo -> vermelho)
    vmin=agrupado_filtrado['valor_total'].min(),  # Valor mínimo (após o filtro)
    vmax=agrupado_filtrado['valor_total'].max(),  # Valor máximo (após o filtro)
    caption='Valor Total das Vendas (Acima de 200)'  # Título da legenda
)

# Criar o mapa principal
mapa = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)  # Coordenadas iniciais (exemplo: Fortaleza)

# Adicionar o mapa de calor baseado no valor total das vendas filtradas
HeatMap(data=agrupado_filtrado[['ven_lati', 'ven_long', 'valor_total']].values, radius=15).add_to(mapa)

# Adicionar a legenda ao mapa
colormap_valor.add_to(mapa)

# Adicionar controle de camadas ao mapa
folium.LayerControl(collapsed=True).add_to(mapa)

# Salvar o mapa otimizado
mapa.save("/home/rodolfo/dev/mapacalor/mapa_otimizado.html")
