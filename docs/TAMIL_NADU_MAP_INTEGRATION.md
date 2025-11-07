# Tamil Nadu Electoral Map Integration Guide

## Overview

This document outlines the comprehensive Tamil Nadu electoral map integration, including accurate constituency boundaries, official election reference maps, and interactive visualization features.

## Data Sources

### 1. GeoJSON Constituency Boundaries
- **Source**: [DataMeet Community Maps Project](https://projects.datameet.org/maps/assembly-constituencies/)
- **Original Format**: Shapefiles (India_AC.shp)
- **Converted Format**: GeoJSON (EPSG:4326)
- **Location**: `src/assets/maps/tamilnadu-constituencies.json`
- **Coverage**: All 234 Tamil Nadu Assembly Constituencies
- **Accuracy**: Highly accurate, maintained by civic tech community
- **License**: Open Data License

### 2. Official Election Reference Map
- **Source**: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2021_Tamil_Nadu_Legislative_Assembly_Election_Map.png)
- **Title**: 2021 Tamil Nadu Legislative Assembly Election Map
- **Publisher**: Election Commission of India
- **Location**: `public/assets/maps/tn-election-map-2021.png`
- **Format**: PNG (1800 × 1780 pixels, 1.18 MB)
- **License**: CC BY-SA 4.0
- **Purpose**: Reference validation for interactive map boundaries

## Conversion Process

### Prerequisites
```bash
brew install gdal  # macOS
# OR
apt-get install gdal-bin  # Ubuntu/Debian
```

### Shapefile to GeoJSON Conversion
```bash
cd /path/to/maps-master/assembly-constituencies

# Convert Tamil Nadu constituencies only
ogr2ogr -f GeoJSON \
  -t_srs EPSG:4326 \
  -where "ST_NAME='Tamil Nadu'" \
  tamilnadu-constituencies.json \
  India_AC.shp
```

### Key Parameters Explained
- `-f GeoJSON`: Output format
- `-t_srs EPSG:4326`: Target spatial reference system (WGS 84 lat/lng)
- `-where "ST_NAME='Tamil Nadu'"`: Filter only Tamil Nadu features
- `India_AC.shp`: Input shapefile containing all India constituencies

## File Structure

```
voter/
├── public/
│   └── assets/
│       └── maps/
│           └── tn-election-map-2021.png  # Official reference map
├── src/
│   ├── assets/
│   │   └── maps/
│   │       └── tamilnadu-constituencies.json  # Accurate GeoJSON boundaries
│   ├── components/
│   │   └── maps/
│   │       └── TamilNaduMap.tsx  # Interactive map component
│   └── pages/
│       └── TamilNaduMapDashboard.tsx  # Main dashboard with tabs
└── docs/
    └── TAMIL_NADU_MAP_INTEGRATION.md  # This file
```

## Component Features

### TamilNaduMapDashboard
Located at: `src/pages/TamilNaduMapDashboard.tsx`

#### Tabs
1. **Interactive Map**
   - 4-level drill-down (State → District → Constituency → Polling Booth)
   - Sentiment visualization with color-coded regions
   - Click-to-explore functionality
   - Real-time voter sentiment data

2. **Official Election Map**
   - Static reference map from Election Commission of India
   - Shows 2021 election results
   - Used for boundary validation
   - Includes proper attribution

3. **Sentiment Trends** (Coming Soon)
   - Historical sentiment analysis
   - Trend predictions
   - Comparative analysis

4. **District Analysis** (Coming Soon)
   - Demographic sentiment breakdown
   - Issue-based mapping
   - Turnout predictions

### TamilNaduMap Component
Located at: `src/components/maps/TamilNaduMap.tsx`

#### Key Features
- Uses accurate DataMeet constituency boundaries
- Leaflet-based interactive choropleth map
- Breadcrumb navigation for drill-down levels
- Sentiment-based color coding
- Popup details for constituencies and districts
- Polling booth marker visualization

## Data Properties

### GeoJSON Feature Properties
Each constituency feature contains:
```json
{
  "OBJECTID": 1,
  "ST_CODE": 33,
  "ST_NAME": "TAMIL NADU",
  "DT_CODE": 1,
  "DIST_NAME": "THIRUVALLUR",
  "AC_NO": 2,
  "AC_NAME": "Ponneri (SC)",
  "PC_NO": 1,
  "PC_NAME": "TIRUVALLUR (SC)",
  "PC_ID": 3301,
  "STATUS": null,
  "Shape_Leng": 1.3862323269600001,
  "Shape_Area": 0.04962046287
}
```

### Key Fields
- **ST_CODE**: State code (33 for Tamil Nadu)
- **DT_CODE**: District code
- **DIST_NAME**: District name
- **AC_NO**: Assembly constituency number (1-234)
- **AC_NAME**: Assembly constituency name (includes SC/ST designation)
- **PC_NAME**: Parliamentary constituency name
- **Shape_Area**: Area in square degrees

## Attribution Requirements

### For GeoJSON Data
```
Data source: DataMeet Community Maps Project
URL: https://projects.datameet.org/maps/assembly-constituencies/
License: Open Data
```

### For Election Map Image
```
Map: 2021 Tamil Nadu Legislative Assembly Election Map
Source: Election Commission of India
License: CC BY-SA 4.0
URL: https://commons.wikimedia.org/wiki/File:2021_Tamil_Nadu_Legislative_Assembly_Election_Map.png
```

## Usage in Code

### Import GeoJSON
```typescript
import tamilNaduConstituenciesGeoJSON from '../../assets/maps/tamilnadu-constituencies.json';
```

### Load in Leaflet Map
```typescript
const features = tamilNaduConstituenciesGeoJSON.features.filter(
  (f: any) => f.properties.DIST_NAME?.toUpperCase().includes('CHENNAI')
);
```

### Display Reference Map
```jsx
<img
  src="/assets/maps/tn-election-map-2021.png"
  alt="2021 Tamil Nadu Election Map"
  className="w-full h-auto"
/>
```

## Statistics

- **Total Districts**: 32 (as per GeoJSON)
- **Total Constituencies**: 234
- **Total Voters**: 6.28 Crore (62.8 million)
- **Parliamentary Constituencies**: 39
- **Reserved Constituencies**:
  - SC (Scheduled Caste): 44
  - ST (Scheduled Tribe): 0

## Troubleshooting

### Issue: GeoJSON Not Loading
**Solution**: Ensure the file is in `src/assets/maps/` not `public/assets/maps/`. Vite doesn't allow importing from public directory.

### Issue: Map Boundaries Don't Match
**Solution**: Compare with the official election map in the "Official Election Map" tab to validate boundaries.

### Issue: Missing Constituencies
**Solution**: Check the `ST_NAME` filter in the conversion command. Ensure it matches exactly: `"ST_NAME='Tamil Nadu'"` or `"ST_NAME='TAMIL NADU'"`.

## Future Enhancements

1. **Real-time Data Integration**
   - Connect to Supabase for live sentiment data
   - Auto-refresh polling booth statistics

2. **Advanced Filtering**
   - Filter by sentiment score
   - Filter by SC/ST designation
   - Filter by parliamentary constituency

3. **Export Functionality**
   - Export constituency data to CSV/Excel
   - Generate PDF reports with maps
   - Export GeoJSON subsets

4. **Overlay Options**
   - Toggle reference map overlay on interactive map
   - Show/hide constituency labels
   - Display demographic heat maps

## Related Files

- `src/data/tamilnadu-data.ts` - Constituency metadata and sentiment scores
- `src/types/geography.ts` - TypeScript type definitions
- `src/components/maps/LeafletChoropleth.tsx` - Choropleth visualization
- `src/components/maps/DrillDownControls.tsx` - Navigation breadcrumbs
- `src/components/maps/SentimentLegend.tsx` - Color scale legend

## Support & Resources

- **DataMeet Maps**: https://projects.datameet.org/maps/
- **Election Commission**: https://eci.gov.in/
- **Leaflet Documentation**: https://leafletjs.com/
- **GDAL/OGR Guide**: https://gdal.org/

## License

This integration respects all original data licenses:
- GeoJSON boundaries: Open Data License
- Election map: CC BY-SA 4.0
- Application code: As per project license

---

**Last Updated**: November 7, 2025
**Version**: 1.0
**Maintained By**: Pulse of People Development Team
