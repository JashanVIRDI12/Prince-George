import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./coverage-map.css";
import { areas } from "./data";
import { Icon } from "./icons";

const tileUrl =
  import.meta.env.VITE_MAP_TILE_URL ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  import.meta.env.VITE_MAP_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function CoverageMap({ active, onSelect, panelId = "territory-panel", overview = false }) {
  const wrapper = useRef(null);
  const container = useRef(null);
  const api = useRef(null);
  const current = useRef({ active, onSelect });
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const area = areas[active];
  const [lat, lng] = area.map.center;
  const largerMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${area.map.zoom}/${lat}/${lng}`;

  useEffect(() => {
    current.current = { active, onSelect };
    api.current?.focusArea(active);
  }, [active, onSelect]);

  useEffect(() => {
    let disposed = false;
    let started = false;
    let map;
    let resizeObserver;
    let observer;
    let timeout;

    const start = async () => {
      if (started || disposed) return;
      started = true;
      setStatus("loading");
      timeout = window.setTimeout(() => {
        if (!disposed) setStatus("error");
      }, 15000);

      try {
        const { default: L } = await import("leaflet");
        if (disposed) return;
        const initial = areas[current.current.active];
        map = L.map(container.current, {
          center: initial.map.center,
          zoom: initial.map.zoom,
          minZoom: 5,
          maxZoom: 18,
          scrollWheelZoom: false,
          zoomControl: false,
          attributionControl: false,
        });

        const setAreaView = (index, showOverview = false) => {
          if (showOverview) {
            map.fitBounds(areas.map((item) => item.map.center), {
              padding: [42, 42],
              maxZoom: 10,
              animate: false,
            });
          } else if (index === 0) {
            // Keep both city-area pins below the controls, including on phones.
            map.fitBounds([areas[0].map.center, areas[2].map.center], {
              paddingTopLeft: [70, 110],
              paddingBottomRight: [70, 70],
              maxZoom: areas[0].map.zoom,
              animate: false,
            });
          } else {
            map.setView(areas[index].map.center, areas[index].map.zoom, {
              animate: false,
            });
          }
        };
        setAreaView(current.current.active);

        L.control.zoom({ position: "topright" }).addTo(map);
        L.control
          .attribution({ prefix: false, position: "bottomright" })
          .addTo(map);
        L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

        let failures = 0;
        const tiles = L.tileLayer(tileUrl, {
          attribution,
          maxZoom: 19,
          // Only fetch the current view, and let the browser honour HTTP caching.
          keepBuffer: 0,
          updateWhenIdle: true,
        });
        tiles.on("loading", () => {
          failures = 0;
        });
        tiles.on("tileerror", () => {
          failures += 1;
        });
        tiles.on("load", () => {
          if (!disposed) {
            window.clearTimeout(timeout);
            setStatus(failures ? "error" : "ready");
          }
        });
        tiles.addTo(map);

        const markers = areas.map((item, index) => {
          const marker = L.marker(item.map.center, {
            icon: L.divIcon({
              className: "real-area-marker",
              html: '<span class="real-marker-pin" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></svg></span>',
              iconSize: [44, 44],
              iconAnchor: [22, 40],
              tooltipAnchor: [0, -35],
            }),
            title: `Show ${item.name} coverage`,
            alt: `Show ${item.name} coverage`,
            keyboard: true,
            riseOnHover: true,
          }).addTo(map);
          marker.bindTooltip(item.map.place, {
            direction: "top",
            className: "real-area-tooltip",
          });
          const element = marker.getElement();
          element.setAttribute("aria-label", `Show ${item.name} coverage`);
          element.setAttribute("aria-controls", panelId);
          marker.on("click", () => {
            api.current?.focusArea(index);
            current.current.onSelect(index);
          });
          // Leaflet supplies Enter handling; Space should behave like a button too.
          element.addEventListener("keydown", (event) => {
            if (event.key === " ") {
              event.preventDefault();
              api.current?.focusArea(index);
              current.current.onSelect(index);
            }
          });
          return marker;
        });

        const focusArea = (index, showOverview = false) => {
          const selected = areas[index];
          // Avoid long flights between towns; every selection is immediately readable.
          setAreaView(index, showOverview);
          markers.forEach((marker, i) => {
            marker.getElement().classList.toggle("is-selected", i === index);
            marker
              .getElement()
              .setAttribute("aria-pressed", String(i === index));
            marker.setZIndexOffset(i === index ? 1000 : 0);
            if (i === index) marker.openTooltip();
            else marker.closeTooltip();
          });
          container.current.dataset.area = selected.id;
        };

        api.current = { focusArea };
        focusArea(current.current.active, overview);
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize({ pan: false });
        });
        resizeObserver.observe(container.current);
      } catch {
        window.clearTimeout(timeout);
        if (!disposed) setStatus("error");
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void start();
        }
      });
      observer.observe(wrapper.current);
    } else {
      void start();
    }

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      observer?.disconnect();
      resizeObserver?.disconnect();
      api.current = null;
      map?.remove();
    };
  }, [attempt]);

  return (
    <div className="coverage-map real-coverage-map" ref={wrapper}>
      <div className="coverage-map-heading">
        <Icon name="pin" />
        <span>PRINCE GEORGE & SURROUNDING AREA</span>
      </div>
      <div className="real-map-frame">
        <div
          className="live-coverage-map"
          ref={container}
          role="region"
          aria-label="Interactive map of Prince George and surrounding service areas"
          aria-describedby="map-instructions"
          data-map-status={status}
        />
        {status === "loading" && (
          <div className="map-loading" role="status">
            Loading street map…
          </div>
        )}
        {status === "error" && (
          <div className="map-load-error" role="status">
            <strong>Map tiles couldn’t load.</strong>
            <span>You can still choose an area or open the larger map.</span>
            <button onClick={() => setAttempt((value) => value + 1)}>
              Try again
            </button>
          </div>
        )}
        <button
          className="map-reset"
          onClick={() => api.current?.focusArea(active)}
          aria-label={`Recenter map on ${area.map.place}`}
          disabled={!api.current}
        >
          <Icon name="locate" />
          <span>Reset view</span>
        </button>
      </div>
      <div className="real-map-footer">
        <span id="map-instructions">Drag to explore. Use + / − to zoom.</span>
        <a href={largerMapUrl} target="_blank" rel="noopener">
          Open larger map <Icon name="arrow" />
        </a>
      </div>
    </div>
  );
}
