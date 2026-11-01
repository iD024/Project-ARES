#!/usr/bin/env python3
"""
validate_catalog.py - ARES Planetary Data Pipeline

Performs automated network health, latency, and CORS checks against
all remote endpoints registered in DATA_CATALOG.md.

Outputs: scripts/data_pipeline/catalog_health_report.json
"""

import json
import os
import time
import urllib.request
import urllib.error

REPORT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "catalog_health_report.json")

ENDPOINTS_TO_PROBE = [
    {
        "id": "mars-viking-mdim",
        "name": "Viking MDIM 2.1 MapServer",
        "url": "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer?f=json",
        "expected_format": "json"
    },
    {
        "id": "mars-mdem200m",
        "name": "HRSC-MOLA MDEM 200m Elevation ImageServer",
        "url": "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer?f=json",
        "expected_format": "json"
    },
    {
        "id": "mars-mcolordem",
        "name": "Mars MColorDEM Shaded Relief MapServer",
        "url": "https://astro.arcgis.com/arcgis/rest/services/OnMars/MColorDEM/MapServer?f=json",
        "expected_format": "json"
    },
    {
        "id": "nasa-trek-wmts",
        "name": "NASA Mars Trek MOLA Shaded Relief WMTS",
        "url": "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml",
        "expected_format": "xml"
    },
    {
        "id": "usgs-planetary-wms",
        "name": "USGS Astrogeology Planetary WMS",
        "url": "https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map&service=WMS&request=GetCapabilities",
        "expected_format": "xml"
    }
]

def probe_endpoint(item):
    url = item["url"]
    start_time = time.time()
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "ARES-Planetary-Data-Validator/0.1.0"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            latency_ms = round((time.time() - start_time) * 1000)
            cors_header = response.headers.get("Access-Control-Allow-Origin", "None")
            status_code = response.getcode()

            return {
                "id": item["id"],
                "name": item["name"],
                "status": "ONLINE" if status_code == 200 else f"HTTP_{status_code}",
                "statusCode": status_code,
                "latencyMs": latency_ms,
                "corsAllowed": cors_header == "*" or cors_header is not None,
                "corsHeader": cors_header,
                "error": None
            }
    except Exception as e:
        latency_ms = round((time.time() - start_time) * 1000)
        return {
            "id": item["id"],
            "name": item["name"],
            "status": "OFFLINE",
            "statusCode": None,
            "latencyMs": latency_ms,
            "corsAllowed": False,
            "corsHeader": None,
            "error": str(e)
        }

def main():
    print("🛰️ Probing ARES Planetary Data Endpoints...")
    results = []

    for ep in ENDPOINTS_TO_PROBE:
        res = probe_endpoint(ep)
        status_icon = "🟢" if res["status"] == "ONLINE" else "🔴"
        cors_icon = "✅" if res["corsAllowed"] else "❌"
        print(f"  {status_icon} {res['name']}: {res['status']} ({res['latencyMs']}ms) | CORS: {cors_icon}")
        results.append(res)

    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "totalEndpoints": len(results),
        "onlineEndpoints": sum(1 for r in results if r["status"] == "ONLINE"),
        "results": results
    }

    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"\n📊 Report saved to {REPORT_FILE}")

if __name__ == "__main__":
    main()
