# LEO Satellite Coverage Mapping Software

This project provides an intuitive way to visualize low Earth orbit (LEO) satellite coverage for any location on Earth, modeled after a potential Starlink coverage prediction tool. By combining Uber’s open-source H3 geospatial indexing system for hexagonal tiling with real-time orbital propagation data from Celestrak for 8,046 Starlink satellites, the program can analyze a region’s average coverage and stability within seconds. This implementation serves as a proof of concept for a more advanced Starlink coverage modeling platform.

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

---

## 🧱 Hexagon Tiling with H3

This project uses [H3 hexagonal indexing](https://h3geo.org/) to tile geographic regions into uniform cells. Hex tiling enables consistent spatial analysis across varying terrain, making it ideal for satellite coverage modeling.

Below is an example of France rendered at two different resolutions:

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <div><h3 style="margin: 0;">🇫🇷 France — Resolution 5</h3></div>
  <img src="https://github.com/user-attachments/assets/ee74724b-4a4a-40f2-a456-6323692e0a64" alt="France Resolution 3" width="400" style="margin-right: 20px;" />
</div>

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <div><h3 style="margin: 0;">🇫🇷 France — Resolution 3</h3></div>
  <img src="https://github.com/user-attachments/assets/cd07d4d8-9eeb-436d-bc42-13a1e1b1c3bb" alt="France Resolution 5" width="400" style="margin-right: 20px;" />
</div>

Higher resolutions (like 5) produce smaller hexagons, allowing for more granular analysis of satellite visibility and stability. Lower resolutions (like 3) are useful for broader regional summaries and performance optimization. In the analysis shown below, a resolution level of 5 was used, as it provided the best balance between granular precision and computational efficiency.

---

## 📈 Coverage Analysis Overview

To assess satellite visibility across different regions, this tool performs three key analyses for each hexagonal tile:

### 1. **Average Coverage**
- Measures and averages how many satellites are visible (within 600km footprint radius) from a given hexagon over a 24-hour period.
- Higher values indicate more frequent satellite presence.

### 2. **Stability**
- Captures how consistent satellite visibility is over time by measuring the variance in coverage over the 24-hour period.
- Stability is calculated via the formula, 1/(variance + 1), so lower variance means higher stabilty and more predictable coverage.

### 3. **Weighted Stability**
- Combines both coverage and stability into a single score via multiplication of the two terms.
- Hexes with high satellite presence and low fluctuation receive higher weighted scores.

These metrics are computed for every hexagon in the selected region. The **weighted stability score** is then used to color each hexagon in the map visualizations — darker reds indicate stronger, more stable coverage, while blues indicate minimal or inconsistent visibility.

The tables under each country summarize these metrics across all hexes, showing the range, average, and distribution for each metric. This helps compare satellite performance across regions and understand how coverage varies spatially.

---

## 🌍 East Africa Case Study

Below are coverage visualizations for four East African countries using mid-inclination Starlink satellites (50°–60°). Each map shows hexagonal coverage density and stability over a 24-hour period. A legend for the coloring scheme of the heatmaps has been provided below:

<img width="180" alt="Weighted Stability Score Legend" src="https://github.com/user-attachments/assets/47fbcf24-e528-4939-a50c-06d7239f83ae" />

---

### 🇲🇬 Madagascar

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/0fa9943e-7522-453d-9d31-c5f54ed61108" alt="Madagascar Coverage" width="400" style="margin-right: 20px;" />
</div>

|                   | Min     | Max   | Mean   | Median | Mode   |
|-------------------------|---------|-------|--------|--------|--------|
| **Coverage**            | 8.21    | 20.00 | 11.63  | 10.96  | 8.71   |
| **Stability**           | 0.0652  | 0.3913| 0.182  | 0.1748 | 0.1715  |
| **Weighted Stability**  | 0.94    | 4.96  | 2.05   | 2.03   | 2.00   |



Based on these results, Madagascar emerges as a highly promising candidate for expanded Starlink infrastructure. Its mean and median coverage values are nearly double those of the other countries analyzed, and it features concentrated high-coverage zones along the coast, likely corresponding to densely populated areas. The primary concern indicated by the data is the notably low minimum stability value and the generally low stability observed across many regions. Further analysis is required to determine whether these stability issues might offset the advantages of the high-coverage zones. Overall, however, the distribution of the weighted stability scores remains encouraging, making Madagascar a strong candidate for further investigation.

---

### 🇪🇹 Ethiopia

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/721aa561-ba13-4fd5-aeea-f4680fd854d6" alt="Ethiopia Coverage" width="400" style="margin-right: 20px;" />
</div>

|                   | Min     | Max   | Mean   | Median | Mode         |
|-------------------------|---------|-------|--------|--------|--------------|
| **Coverage**            | 5.04    | 12.63 | 6.82   | 6.67   | 6.58    |
| **Stability**           | 0.1767  | 0.7067| 0.3284 | 0.3165 | 0.3335  |
| **Weighted Stability**  | 1.20    | 5.27  | 2.24   | 2.13   | 2.07    |


Ethiopia demonstrates a particularly high concentration of coverage in its eastern region, exhibiting a level of consistency unmatched by any other country analyzed. In addition, its mean and median stability values, along with average coverage metrics, remain relatively strong, indicating promising technical viability. However, the primary limitation for Ethiopia is not the data itself but rather the geographic context: the regions with the highest compatibility are largely uninhabited desert areas. As a result, these zones offer limited potential for meaningful market expansion or infrastructure development within the Starlink network.

---

### 🇹🇿 Tanzania

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/ace17e40-3f2e-4c0f-baac-c7a072e696ff" alt="Tanzania Coverage" width="400" style="margin-right: 20px;" />
</div>

|                   | Min     | Max   | Mean   | Median | Mode   |
|-------------------------|---------|-------|--------|--------|--------|
| **Coverage**            | 4.71    | 13.83 | 5.99   | 6.04   | 6.25   |
| **Stability**           | 0.0911  | 0.6025| 0.3227 | 0.3186 | 0.3255     |
| **Weighted Stability**  | 1.02    | 3.27  | 1.91   | 1.88   | 2.06   |


Tanzania stands out as a strong candidate primarily due to a well-defined corridor of consistently stable coverage running directly through the country. While it may lack the numerous high-coverage zones seen in other nations analyzed, its overall uniformity and reliability are notable strengths. In terms of metrics, Tanzania closely mirrors Ethiopia, exhibiting strong stability values and average coverage scores. However, unlike Ethiopia, Tanzania benefits from a significant overlap between regions of high population density and areas of strong coverage. This alignment enhances its strategic potential, positioning Tanzania as a strong runner-up to Madagascar among the top candidates for further study.

---

### 🇺🇬 Uganda

<div style="display: flex; align-items: center; margin-bottom: 10px;">
  <img src="https://github.com/user-attachments/assets/779dbb55-ee19-460d-98b6-143ee6e0f6bc" alt="Uganda Coverage" width="400" style="margin-right: 20px;" />
</div>

|                | Min     | Max   | Mean   | Median | Mode   |
|-------------------------|---------|-------|--------|--------|--------|
| **Coverage**            | 5.21    | 12.17 | 5.87   | 5.79   | 5.71   |
| **Stability**           | 0.0594  | 0.5294| 0.2888 | 0.2698 | 0.2354 |
| **Weighted Stability**  | 0.72    | 3.09  | 1.68   | 1.57   | 1.92   |

Unfortunately, initial modeling indicates limited potential for Starlink infrastructure development in Uganda. Nearly half of the country (most notably its most densely populated regions) exhibits low or inconsistent coverage. Even in areas that are reached, signal strength remains modest. Across all key metrics, Uganda underperforms relative to Ethiopia and Tanzania, further reducing its viability as a near-term candidate. Overall, the data suggest that Uganda is not a promising option at this stage, and analytical focus would be better directed toward more favorable regions.

---

## 📦 Export & Analysis

Coverage data is exported as JSON files containing:
- `coverageMap`: average satellite visibility per hex
- `coverageStability`: variance-based stability score per hex

These files can then utilize python libraries such as numpy, pandas, and plotly to perform further analysis and visualiztion. 


## 📍 Conclusion

Among the four East African countries analyzed, **Madagascar** emerges as the most promising candidate for Starlink infrastructure development. Its coverage map shows consistently high weighted stability scores across densely populated regions, suggesting strong and reliable visibility where it matters most. Although Ethiopia shows promise for areas of strong and consistent coverage, it mainly covers regions of the nation with low population densities. 

<p align="center">
  <img src="https://github.com/user-attachments/assets/0fa9943e-7522-453d-9d31-c5f54ed61108" alt="Madagascar Coverage" width="200" style="margin-right: 20px;" />
  <img src="https://github.com/user-attachments/assets/ba2556fb-6608-4428-98bc-d5f5d644dc36" alt="Madagascar Population Distribution Map" width="225" />
  <img width="300" alt="Screenshot 2025-10-22 at 12 28 38 AM" src="https://github.com/user-attachments/assets/b89b393d-5ba0-4554-a691-14504b622991" />
</p>


When overlaid with Madagascar’s population density and electricity access maps, the satellite coverage distribution aligns closely with electrical urban and coastal population centers. This strong spatial correlation suggests that additional investment or optimization in Madagascar would likely deliver the greatest improvements in service reach and reliability. 

Among the remaining countries, Tanzania also emerges as a promising secondary candidate. Importantly, while its overall coverage is somewhat weaker than Madagascar’s, it remains consistently strong in densely populated areas, a key factor for practical deployment. Maps of population density and transportation networks are shown alongside satellite coverage below to highlight the strong correlation between high coverage and easily accessible, densely populated regions in Tanzania.

<p align="center">
  <img src="https://github.com/user-attachments/assets/ace17e40-3f2e-4c0f-baac-c7a072e696ff" alt="Tanzania Coverage" width="250" style="margin-right: 20px;" />
  <img width="250" alt="image" src="https://github.com/user-attachments/assets/a4481733-7ff6-44ee-82a1-61a935970792" />
  <img width="350" alt="image" src="https://github.com/user-attachments/assets/3515ac3e-d491-476f-9dde-0862e562fa9d" />
</p>

Future iterations of this analysis could incorporate real-time demand modeling, infrastructure overlays, or socioeconomic data to refine deployment strategies even further.

---
## Next Steps for Enhanced Modeling

To improve the accuracy and predictive power of this satellite coverage analysis, future development could focus on:

- **Temporal Resolution:** Incorporating finer time slices (e.g., hourly or seasonal) to capture dynamic coverage patterns and daytime variations.  
- **Orbital Diversity:** Expanding beyond mid-inclination satellites to include polar, equatorial, and sun-synchronous orbits for global completeness.  
- **Population & Demand Overlays:** Integrating real-time population density, infrastructure, and usage demand data to prioritize high-impact regions.  
- **Signal Quality Modeling:** Simulating link budgets, elevation angles, and atmospheric effects to evaluate actual service viability.  
- **Terrain & Weather Effects:** Accounting for elevation, obstructions, and meteorological conditions that influence line-of-sight connectivity.  
- **Latency & Network Performance:** Estimating propagation delays and inter-satellite link efficiency for realistic service modeling.  
- **Interactive Visualization:** Developing a web-based or GUI interface for real-time coverage exploration and parameter tuning.  
- **Predictive Scenarios:** Modeling future satellite deployments or constellation adjustments to forecast coverage evolution.  

These enhancements would enable more strategic planning, better resource allocation, and deeper insight into where Starlink can deliver the greatest value.

--
