# Real service-area map

The homepage coverage section and About page use Leaflet 1.9.4 with real OpenStreetMap raster tiles. They need no API key. The map library and tiles load when each map enters the viewport; mouse wheel scrolling continues to scroll the page. Visitors can pan, pinch or use zoom controls, select area pins, reset the current view, or open the selected community in a larger OpenStreetMap view. The About page opens on a regional overview before a selection focuses one community.

The existing area tabs and details remain synchronised with the map. A pin represents a named community, not a company yard, exact pickup point, guaranteed service boundary, or live vehicle. No invented routes are drawn over the map.

## Coordinate sources

Coordinates are stored in `src/data.js`:

- Prince George: 53.913056, -122.745278 — [Natural Resources Canada](https://geonames.nrcan.gc.ca/search-place-names/unique?id=JBLVS).
- Vanderhoof: 54.017222, -124.0075 — converted from 54°01′02″N, 124°00′27″W in [BC Geographical Names](https://apps.gov.bc.ca/pub/bcgnws/names/38682.html).
- Hart Highlands: 53.983333, -122.8 — [Natural Resources Canada](https://geonames.nrcan.gc.ca/search-place-names/unique?id=JANRE&wbdisable=true).
- Quesnel: 52.979722, -122.493611 — [Natural Resources Canada](https://geonames.nrcan.gc.ca/search-place-names/unique?id=JBNTS).

## Provider setup

Default tiles: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. OpenStreetMap attribution is always visible inside the map. Browser caching is preserved, and no offline download or tile prefetch is implemented. The tile service is third-party and requires an internet connection. Tile errors show a retry action while area information and the external map link remain available.

To change providers, configure `VITE_MAP_TILE_URL` and the matching `VITE_MAP_ATTRIBUTION`, then restart Vite or rebuild. These are public build-time settings. Follow the chosen provider's usage terms; the default provider's policy is [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).

Implementation follows the [Leaflet reference](https://leafletjs.com/reference.html). `ResizeObserver` keeps the map aligned after layout changes, and effects remove listeners and map instances on cleanup.

## Validation

UI tests mock tile responses to keep the suite deterministic and avoid repeatedly hitting the public service. Real tiles were also loaded in a browser with desktop and mobile captures in `artifacts/real-map/`. Tests cover pin/tab synchronisation, zoom, reset, attribution, accessible controls, external URLs, failed tiles, and retry recovery.
