# Mapbox Interactive Map Setup Guide

## 🚀 Quick Start

Your Tamil Nadu interactive map is ready to use! Just follow these simple steps:

---

## Step 1: Get Your Free Mapbox API Key

1. **Visit Mapbox:**
   - Go to https://account.mapbox.com/
   - Click "Sign up" (it's free!)

2. **Create Account:**
   - Use your email
   - Verify your email address

3. **Get Your Token:**
   - After login, go to https://account.mapbox.com/access-tokens/
   - Copy your **Default public token** (starts with `pk.`)
   - It looks like: `pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZSJ9.example`

4. **Free Tier Includes:**
   - ✅ 50,000 map loads per month (FREE)
   - ✅ All map styles
   - ✅ Navigation controls
   - ✅ Perfect for development and small projects

---

## Step 2: Add Your API Key

Open the file: `src/components/maps/MapboxTamilNadu.tsx`

Find this line (around line 13):
```typescript
const MAPBOX_TOKEN = 'pk.eyJ1IjoicHVsc2VvZnBlb3BsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
```

Replace it with your actual token:
```typescript
const MAPBOX_TOKEN = 'pk.YOUR_ACTUAL_TOKEN_HERE';
```

**That's it!** Your map is ready to use! 🎉

---

## Step 3: Use the Map in Your Dashboard

The map is already integrated in: `src/pages/TamilNaduMapDashboard.tsx`

Access it at: http://localhost:5173/tamil-nadu-map

---

## ✨ Features Included

### Interactive Features
- ✅ **Click & Zoom** - Click any constituency to zoom in
- ✅ **Hover Details** - Hover to see constituency info
- ✅ **Search** - Use navigation controls to pan/zoom
- ✅ **Fullscreen** - Expand to fullscreen mode
- ✅ **Scale Bar** - Distance measurement
- ✅ **Labels** - Constituency names (appear when zoomed)

### Styling
- ✅ Green constituencies with blue hover effect
- ✅ Clear boundary lines
- ✅ Smooth animations
- ✅ Professional appearance

### Data
- ✅ All 234 Tamil Nadu constituencies
- ✅ Accurate boundaries from DataMeet
- ✅ District information
- ✅ Parliamentary constituency mapping

---

## 🎨 Customization Options

### Change Map Style

In `MapboxTamilNadu.tsx`, line 35, change the style:

```typescript
// Clean Streets (Default)
style: 'mapbox://styles/mapbox/streets-v12'

// Satellite View
style: 'mapbox://styles/mapbox/satellite-streets-v12'

// Dark Mode
style: 'mapbox://styles/mapbox/dark-v11'

// Light Mode
style: 'mapbox://styles/mapbox/light-v11'

// Outdoors
style: 'mapbox://styles/mapbox/outdoors-v12'
```

### Change Colors

In `MapboxTamilNadu.tsx`, line 52-59, modify:

```typescript
'fill-color': [
  'case',
  ['boolean', ['feature-state', 'hover'], false],
  '#2196F3', // <-- Change hover color
  '#4CAF50'  // <-- Change default color
],
```

**Popular Color Schemes:**
- **Party Colors:** `#FF9800` (DMK Orange), `#4CAF50` (ADMK Green)
- **Heatmap:** `#FF5252` (High), `#FFEB3B` (Medium), `#4CAF50` (Low)
- **Professional:** `#1976D2` (Blue), `#424242` (Gray)

### Add Sentiment Colors

Replace static colors with data-driven colors:

```typescript
'fill-color': [
  'case',
  ['<', ['get', 'sentiment'], 40], '#EF5350',  // Red: Negative
  ['<', ['get', 'sentiment'], 60], '#FFA726',  // Orange: Neutral
  '#66BB6A'  // Green: Positive
],
```

---

## 🔧 Advanced Features

### Add Custom Data

To add sentiment scores or other data to constituencies:

```typescript
// In MapboxTamilNadu.tsx, modify the GeoJSON before adding to map
const enrichedGeoJSON = {
  ...tamilNaduGeoJSON,
  features: tamilNaduGeoJSON.features.map(f => ({
    ...f,
    properties: {
      ...f.properties,
      sentiment: Math.random() * 100, // Your sentiment data
      votes: Math.floor(Math.random() * 100000) // Your vote data
    }
  }))
};
```

### Add Search Bar

Install geocoder:
```bash
npm install @mapbox/mapbox-gl-geocoder
```

Add to map:
```typescript
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

// In useEffect after map loads:
const geocoder = new MapboxGeocoder({
  accessToken: MAPBOX_TOKEN,
  mapboxgl: mapboxgl,
  countries: 'in',
  bbox: [76.23, 8.07, 80.35, 13.58], // Tamil Nadu bounds
  placeholder: 'Search constituencies...'
});

map.current.addControl(geocoder, 'top-left');
```

---

## 📊 Alternative Map Options

### Option 2: Leaflet (Free, No API Key Required)

Already installed in your project. Use the existing Leaflet components.

**Pros:**
- No API key needed
- Open source
- Works offline

**Cons:**
- Less smooth animations
- Basic styling

### Option 3: Google Maps

**Pros:**
- Familiar interface
- Good India coverage

**Cons:**
- Requires credit card (even for free tier)
- More complex setup
- 28,000 map loads/month free

### Option 4: Datawrapper (No Code Required)

Visit: https://www.datawrapper.de/

1. Upload your GeoJSON
2. Style in browser
3. Get embed code
4. Paste in your app

**Best For:** Non-technical users, quick maps

---

## 🆘 Troubleshooting

### Map Not Showing?
1. Check your API token is correct
2. Check browser console for errors
3. Verify you're online (Mapbox requires internet)

### Constituencies Not Clickable?
1. Ensure GeoJSON file exists at: `src/assets/maps/tamilnadu-constituencies.json`
2. Check file size (should be ~1MB)

### Slow Loading?
1. Reduce initial zoom level (line 38)
2. Remove labels layer (comment out lines 77-91)
3. Use lighter map style (e.g., `light-v11`)

---

## 📚 Resources

- **Mapbox Documentation:** https://docs.mapbox.com/mapbox-gl-js/guides/
- **Mapbox Examples:** https://docs.mapbox.com/mapbox-gl-js/example/
- **Mapbox Styles:** https://docs.mapbox.com/api/maps/styles/
- **DataMeet:** https://projects.datameet.org/maps/
- **GeoJSON Validator:** http://geojson.io/

---

## 💡 Pro Tips

1. **Development:** Use the free tier during development
2. **Production:** Monitor your usage at https://account.mapbox.com/
3. **Caching:** Mapbox automatically caches tiles for better performance
4. **Mobile:** The map is fully responsive and touch-enabled
5. **Offline:** Consider Leaflet if offline support is needed

---

## 🎯 Next Steps

1. Get your Mapbox API key (5 minutes)
2. Add it to the component
3. Refresh your browser
4. Start clicking constituencies!

**Need Help?** Check the Mapbox documentation or search for examples.

---

**Last Updated:** November 7, 2025
**Component:** MapboxTamilNadu.tsx
**Version:** 1.0
