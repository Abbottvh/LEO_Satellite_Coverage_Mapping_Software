import json
import pandas as pd
import plotly.express as px

# Load the JSON file
with open("coverage_data.json", "r") as f:
    data = json.load(f)

# Extract maps
coverage_map = data["coverageMap"]
coverage_stability = data["coverageStability"]

# Create a DataFrame with h3Index, avg, stability, and weighted score
df = pd.DataFrame({
    "h3Index": list(coverage_map.keys()),
    "avg": [coverage_map[h] for h in coverage_map],
    "stability": [coverage_stability.get(h, 1) for h in coverage_map]
})
df["weighted"] = df["avg"] * df["stability"]

# Preview the data
print(df.head())

import plotly.graph_objects as go

legend_colors = [
    ("Very High (≥ 3.8)", "#800000"),
    ("High (3.2–3.79)", "red"),
    ("Moderate (2.4–3.19)", "orange"),
    ("Low (1.6–2.39)", "yellow"),
    ("Very Low (0.8–1.59)", "green"),
    ("Minimal (< 0.8)", "blue")
]

fig = go.Figure()

for label, color in legend_colors:
    fig.add_trace(go.Scatter(
        x=[None], y=[None],
        mode='markers',
        marker=dict(size=10, color=color),
        legendgroup=label,
        showlegend=True,
        name=label
    ))

fig.update_layout(title="Coverage Color Legend")
fig.show()

# Top 20 by weighted score
top_weighted = df.sort_values(by="weighted", ascending=False).head(20)
fig = px.bar(top_weighted, x="h3Index", y="weighted", title="Top 20 Hexes by Weighted Stability Score")
fig.show()

