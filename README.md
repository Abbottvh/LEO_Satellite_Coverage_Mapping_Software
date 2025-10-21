# 🛰️ LEO Satellite Coverage Mapping Software

This project visualizes satellite coverage over any region using geospatial hex tiling and real-time orbital propagation. It enables researchers, engineers, and policy makers to assess satellite visibility, stability, and density across time and geography.

---

## 🚀 Features

- **Dynamic GeoJSON Tiling**: Converts any country or region into H3 hexagons for spatial analysis.
- **Satellite Propagation**: Uses TLE data and orbital mechanics to simulate satellite positions over time.
- **Coverage Analysis**: Computes average visibility and stability scores for each hexagon.
- **Interactive UI**: Toggle satellite filters, switch regions, and export coverage data.
- **Python Analytics**: Analyze exported JSON files using Pandas and Plotly for deeper insights.

---

## 🧰 Technologies Used

| Component                  | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **JavaScript + Leaflet**   | Frontend map rendering and UI controls                                     |
| **H3 Library**             | Hexagonal spatial indexing for tiling and coverage mapping                  |
| **Satellite.js**           | Orbital propagation and satellite position calculations                     |
| **GeoJSON**                | Region boundary input for tiling                                            |
| **LocalStorage**           | Caching coverage maps for performance                                       |
| **Python (Pandas + Plotly)** | Post-analysis and visualization of exported coverage data               |

---

## 🌍 East Africa Case Study

Below are coverage visualizations for four East African countries using mid-inclination satellites (50°–60°). Each map shows hexagonal coverage density and stability over a 24-hour period.

<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="https://github.com/user-attachments/assets/0fa9943e-7522-453d-9d31-c5f54ed61108" alt="Madagascar Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇲🇬 Madagascar</h3></div>
</div>

<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="https://github.com/user-attachments/assets/721aa561-ba13-4fd5-aeea-f4680fd854d6" alt="Ethiopia Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇪🇹 Ethiopia</h3></div>
</div>

<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="https://github.com/user-attachments/assets/ace17e40-3f2e-4c0f-baac-c7a072e696ff" alt="Tanzania Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇹🇿 Tanzania</h3></div>
</div>

<div style="display: flex; align-items: center; margin-bottom: 20px;">
  <img src="https://github.com/user-attachments/assets/779dbb55-ee19-460d-98b6-143ee6e0f6bc" alt="Uganda Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇺🇬 Uganda</h3></div>
</div>



---

## 📦 Export & Analysis

Coverage data is exported as JSON files containing:
- `coverageMap`: average satellite visibility per hex
- `coverageStability`: variance-based stability score per hex

Use the provided Python script to load, analyze, and visualize these metrics.

---
