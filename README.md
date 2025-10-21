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

---

### 🇲🇬 Madagascar

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/0fa9943e-7522-453d-9d31-c5f54ed61108" alt="Madagascar Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇲🇬 Madagascar</h3></div>
</div>

| Metric                  | Min     | Max   | Mean   | Median | Mode   |
|-------------------------|---------|-------|--------|--------|--------|
| **Coverage**            | 8.21    | 20.00 | 11.63  | 10.96  | 8.71   |
| **Stability**           | 0.0652  | 0.3913| 0.182  | 0.1748 | 1.715  |
| **Weighted Stability**  | 0.94    | 4.96  | 2.05   | 2.03   | 2.00   |

---

### 🇪🇹 Ethiopia

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/721aa561-ba13-4fd5-aeea-f4680fd854d6" alt="Ethiopia Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇪🇹 Ethiopia</h3></div>
</div>

| Metric                  | Min     | Max   | Mean   | Median | Mode         |
|-------------------------|---------|-------|--------|--------|--------------|
| **Coverage**            | 5.04    | 12.63 | 6.82   | 6.67   | 6.58 (66×)   |
| **Stability**           | 0.1767  | 0.7067| 0.3284 | 0.3165 | 0.3335 (27×) |
| **Weighted Stability**  | 1.20    | 5.27  | 2.24   | 2.13   | 2.07 (10×)   |

---

### 🇹🇿 Tanzania

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/ace17e40-3f2e-4c0f-baac-c7a072e696ff" alt="Tanzania Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇹🇿 Tanzania</h3></div>
</div>

| Metric                  | Min     | Max   | Mean   | Median | Mode   |
|-------------------------|---------|-------|--------|--------|--------|
| **Coverage**            | 4.71    | 13.83 | 5.99   | 6.04   | 6.25   |
| **Stability**           | 0.0911  | 0.6025| 0.3227 | 0.3186 | —      |
| **Weighted Stability**  | 1.02    | 3.27  | 1.91   | 1.88   | 2.06   |

---

### 🇺🇬 Uganda

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/779dbb55-ee19-460d-98b6-143ee6e0f6bc" alt="Uganda Coverage" width="400" style="margin-right: 20px;" />
  <div><h3 style="margin: 0;">🇺🇬 Uganda</h3></div>
</div>

| Metric                  | Min     | Max   | Mean   | Median | Mode   |
|-------------------------|---------|-------|--------|--------|--------|
| **Coverage**            | 5.21    | 12.17 | 5.87   | 5.79   | 5.71   |
| **Stability**           | 0.0594  | 0.5294| 0.2888 | 0.2698 | 0.2354 |
| **Weighted Stability**  | 0.72    | 3.09  | 1.68   | 1.57   | 1.92   |


---

## 📦 Export & Analysis

Coverage data is exported as JSON files containing:
- `coverageMap`: average satellite visibility per hex
- `coverageStability`: variance-based stability score per hex

Use the provided Python script to load, analyze, and visualize these metrics.

---
