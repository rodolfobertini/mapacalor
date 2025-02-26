import folium
from folium.plugins import HeatMap
import pandas as pd

# Carregar os dados
dados = pd.read_csv('/home/rodolfo/dev/mapacalor/dados.csv')  # Substitua pelo caminho do seu arquivo

# Remover as aspas simples e limpar os valores
try:
    # Limpar e converter as colunas para float
    dados['ven_lati'] = (
        dados['ven_lati']
        .str.replace("'", "", regex=False)
        .str.strip()
        .astype(float)
    )
    dados['ven_long'] = (
        dados['ven_long']
        .str.replace("'", "", regex=False)
        .str.strip()
        .astype(float)
    )
    dados['ven_vlrven'] = (
        dados['ven_vlrven']
        .str.replace("'", "", regex=False)
        .str.replace("R\$", "", regex=True)
        .str.replace(",", ".", regex=False)
        .str.strip()
        .astype(float)
    )
except ValueError as e:
    print(f"Erro ao processar os dados: {e}")
    print("Verifique se todas as linhas do CSV estão corretamente formatadas.")
    exit(1)

# Verificar se há valores nulos e removê-los
dados.dropna(subset=['ven_lati', 'ven_long', 'ven_vlrven'], inplace=True)

# Agrupar os dados por localização (latitude e longitude)
agrupado = dados.groupby(['ven_lati', 'ven_long']).agg(
    quantidade_vendas=('ven_vlrven', 'count'),  # Contar número de vendas
    valor_total=('ven_vlrven', 'sum')          # Somar valores das vendas
).reset_index()

# Criar o mapa baseado na quantidade de vendas
mapa_quantidade = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)  # Coordenadas iniciais (exemplo: Fortaleza)
HeatMap(data=agrupado[['ven_lati', 'ven_long', 'quantidade_vendas']].values, radius=15).add_to(mapa_quantidade)

# Salvar o mapa da quantidade de vendas
mapa_quantidade.save("/home/rodolfo/dev/mapacalor/mapa_quantidade_vendas.html")

# Criar o mapa baseado no valor total das vendas
mapa_valor = folium.Map(location=[-3.73367, -38.5543], zoom_start=12)  # Coordenadas iniciais (exemplo: Fortaleza)
HeatMap(data=agrupado[['ven_lati', 'ven_long', 'valor_total']].values, radius=15).add_to(mapa_valor)

# Salvar o mapa do valor total das vendas
mapa_valor.save("/home/rodolfo/dev/mapacalor/mapa_valor_total_vendas.html")
