import folium
from folium.plugins import HeatMap
import pandas as pd
from branca.colormap import LinearColormap

# Carregar os dados
dados = pd.read_csv('/home/rodolfo/dev/mapacalor/dados.csv')  # Substitua pelo caminho do seu arquivo

# Remover as aspas simples e limpar os valores
dados['ven_lati'] = dados['ven_lati'].str.replace("'", "").astype(float)  # Converter para float
dados['ven_long'] = dados['ven_long'].str.replace("'", "").astype(float)  # Converter para float
dados['ven_vlrven'] = (
    dados['ven_vlrven']
    .str.replace("'", "")
    .str.replace("R\$", "", regex=True)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# Agrupar os dados por localização (latitude e longitude)
agrupado = dados.groupby(['ven_lati', 'ven_long']).agg(
    quantidade_vendas=('ven_vlrven', 'count'),  # Contar número de vendas
    valor_total=('ven_vlrven', 'sum')          # Somar valores das vendas
).reset_index()

# Criar um colormap para a legenda (baseado no valor total das vendas)
colormap_valor = LinearColormap(
    colors=['green', 'yellow', 'red'],  # Cores da escala (verde -> amarelo -> vermelho)
    vmin=agrupado['valor_total'].min(),  # Valor mínimo
    vmax=agrupado['valor_total'].max(),  # Valor máximo
    caption='Valor Total das Vendas'     # Título da legenda
)

# Criar o mapa baseado no valor total das vendas
mapa_valor = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)  # Coordenadas iniciais (exemplo: Fortaleza)
HeatMap(data=agrupado[['ven_lati', 'ven_long', 'valor_total']].values, radius=15).add_to(mapa_valor)

# Adicionar a legenda ao mapa
colormap_valor.add_to(mapa_valor)

# Adicionar marcadores ao mapa com os valores totais de vendas e quantidade de vendas
for _, row in agrupado.iterrows():
    folium.Marker(
        location=[row['ven_lati'], row['ven_long']],
        popup=f"<b>Valor Total:</b> R$ {row['valor_total']:.2f}<br><b>Quantidade:</b> {row['quantidade_vendas']}",
        icon=folium.Icon(color="blue", icon="info-sign")
    ).add_to(mapa_valor)

# Salvar o mapa do valor total das vendas com legenda e marcadores
mapa_valor.save("/home/rodolfo/dev/mapacalor/mapa_valor_total_vendas_completo.html")

# Criar o mapa baseado na quantidade de vendas (opcional)
mapa_quantidade = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)  # Coordenadas iniciais (exemplo: Fortaleza)
HeatMap(data=agrupado[['ven_lati', 'ven_long', 'quantidade_vendas']].values, radius=15).add_to(mapa_quantidade)

# Salvar o mapa da quantidade de vendas
mapa_quantidade.save("/home/rodolfo/dev/mapacalor/mapa_quantidade_vendas.html")
