# US Language Diffusion JSON Objects

This package contains map-ready JSON and GeoJSON files for visualizing language spread in the United States with Mapbox GL JS and D3.js.

## Files

- `us_language_diffusion_master.json` — top-level project model and file index.
- `language_feature_catalog.json` — definitions of mapped language features.
- `language_points.geojson` — city/sample points with intensity scores.
- `language_edges.geojson` — diffusion/network paths between locations.
- `language_regions.geojson` — broad approximate dialect/innovation zones.
- `visual_encoding_config.json` — colors, sizes, timeline behavior, and legend logic.
- `mapbox_layer_config.json` — suggested Mapbox GL JS source/layer objects.
- `language_geojson_schema.json` — validation schema for the data model.
- `sources.json` — all source links preserved from the source document.

## Important Data Note

The included locations, intensities, and edges are intended as an illustrative starter dataset. They are structured for visualization, not as a final empirical linguistic dataset. Replace `data_status: "illustrative"` records with measured data from acoustic studies, dialect surveys, corpora, or geotagged social media analysis before presenting the map as research-grade.

## Recommended Visual Logic

- Points: sampled cities or observed locations.
- Circle size: `intensity_score`.
- Circle color: `category`.
- Lines: diffusion pathways or network relationships.
- Line width: `strength`.
- Regions: soft contextual zones, not exact borders.
- Timeline filter: show points where `year <= selectedYear`; show edges where `year_start <= selectedYear`.
