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

# Criar o mapa principal
mapa = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)  # Coordenadas iniciais (exemplo: Fortaleza)

# Adicionar o mapa de calor baseado no valor total das vendas
HeatMap(data=agrupado[['ven_lati', 'ven_long', 'valor_total']].values, radius=15).add_to(mapa)

# Adicionar a legenda ao mapa
colormap_valor.add_to(mapa)

# Criar grupos de camadas para os marcadores
grupo_quantidade = folium.FeatureGroup(name="Quantidade de Vendas", show=False).add_to(mapa)
grupo_valor = folium.FeatureGroup(name="Valor Total de Vendas", show=False).add_to(mapa)

# Adicionar marcadores com base na quantidade de vendas
for _, row in agrupado.iterrows():
    folium.Marker(
        location=[row['ven_lati'], row['ven_long']],
        popup=f"<b>Quantidade:</b> {row['quantidade_vendas']}<br><b>Valor Total:</b> R$ {row['valor_total']:.2f}",
        icon=folium.Icon(color="blue", icon="info-sign")
    ).add_to(grupo_quantidade)

# Adicionar marcadores com base no valor total das vendas (filtro por valor mínimo)
valor_minimo = 5000  # Exemplo: Exibir apenas valores acima de R$5000
for _, row in agrupado[agrupado['valor_total'] >= valor_minimo].iterrows():
    folium.Marker(
        location=[row['ven_lati'], row['ven_long']],
        popup=f"<b>Valor Total:</b> R$ {row['valor_total']:.2f}<br><b>Quantidade:</b> {row['quantidade_vendas']}",
        icon=folium.Icon(color="green", icon="star")
    ).add_to(grupo_valor)

# Adicionar controle de camadas ao mapa
folium.LayerControl(collapsed=False).add_to(mapa)

# Adicionar um botão fixo no mapa exibindo o valor mínimo atual (simulação de campo interativo)
html_minimo = f"""
<div style="position: fixed; 
            bottom: 50px; left: 50px; width: 300px; height: 50px;
            background-color: white; border:2px solid grey; z-index:9999; font-size:14px;
            padding: 10px;">
<b>Filtro Ativo:</b> Exibindo valores acima de <b>R$ {valor_minimo:.2f}</b><br>
<i>(Altere "valor_minimo" no código para ajustar)</i>
</div>
"""
folium.map.Marker(
    location=[-3.73367, -38.5543],  # Posição central (ou qualquer coordenada que você queira)
    icon=folium.DivIcon(html=html_minimo),
).add_to(mapa)

# Salvar o mapa completo com filtros e botões
mapa.save("/home/rodolfo/dev/mapacalor/mapa_completo_com_valor_minimo.html")
