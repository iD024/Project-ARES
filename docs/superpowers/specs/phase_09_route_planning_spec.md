# Phase 09 — Terrain-Aware Route Planning Specification

## 1. Problem Statement & Mission Context
Planetary surface exploration on Mars requires traversability analysis that balances path efficiency against steep crater slopes, topographic obstacles, and vehicle safety thresholds. ARES Phase 09 introduces an interactive, terrain-aware route planning system enabling mission planners to select arbitrary start and destination points on Mars, evaluate terrain cost surfaces, compute multi-candidate routes via geodetic A* pathfinding, compare elevation profiles, and visualize paths on both 3D SceneView and 2D MapView.

---

## 2. Core Scientific & Geodetic Invariants
1. **Mars 2000 Datum & Ellipsoid:**
   - Geodesic distances calculated strictly on Mars 2000 datum ($R = 3,396,190\text{ m}$).
   - Edge costs scale with true planetary ground distance accounting for latitude-dependent parallel convergence.
2. **Scientific Integrity & Disclaimers:**
   - Slopes derived from 200m DEM must be clearly classified as **regional slope gradients**.
   - Mandatory non-negotiable disclaimer: *"Regional terrain model derived from 200m DEM. Does not account for sub-meter boulder fields, sand traps, or fine rover-scale obstacles."*
   - Routes labeled **MODELED / SIMULATED**.
3. **Vehicle Profile Constraints:**
   - Maximum safe slope threshold: Default $15^\circ$ (Perseverance / Curiosity class rover).
   - Hard obstacle cutoff: Slopes $\ge 25^\circ$ classified as precipitous / impassable for wheeled rovers.

---

## 3. Mathematical Model & Cost Formulation

### A. Geodetic Lattice Grid Generation
Given start coordinate $P_s = (\lambda_s, \phi_s)$ and destination coordinate $P_d = (\lambda_d, \phi_d)$:
- Construct bounding box with safety expansion margin $\delta = 25\%$ to permit flanking maneuvers around obstacles.
- Subdivide into an $M \times N$ discrete lattice graph $G = (V, E)$, connecting each node to its 8 spatial neighbors.
- Sample spot elevations $z(v)$ for each node $v \in V$ using MOLA/HRSC elevation services.

### B. Edge Cost Function
For directed edge $(u, v) \in E$ between nodes $u$ and $v$:
$$\text{dist}(u, v) = \text{calculateMarsGroundDistance}(u.\text{lon}, u.\text{lat}, v.\text{lon}, v.\text{lat})$$
$$\Delta z = z(v) - z(u)$$
$$\theta(u, v) = \arctan\left(\frac{|\Delta z|}{\text{dist}(u, v)}\right) \cdot \frac{180^\circ}{\pi}$$

The total traversal cost $C(u, v)$ is:
$$C(u, v) = \text{dist}(u, v) \times \left(1 + w_{\text{slope}} \cdot f(\theta) + w_{\text{uphill}} \cdot g(\Delta z)\right)$$

Where:
- $f(\theta) = \begin{cases} 
\left(\frac{\theta}{\theta_{\text{max}}}\right)^2 & \text{if } \theta \le \theta_{\text{max}} \\
\infty & \text{if } \theta > \theta_{\text{cutoff}} \text{ (impassable cliff)}
\end{cases}$
- $g(\Delta z) = \max\left(0, \frac{\Delta z}{\text{dist}(u, v)}\right)$ (energy penalty for steep climbs)
- $w_{\text{slope}}, w_{\text{uphill}}$: Configurable parameter weights.

---

## 4. Multi-Candidate Route Generation Strategies

To provide actionable tactical intelligence, the engine computes 3 distinct candidate routes:
1. **Safest Route (Green #10B981):**
   - High slope penalty weight ($w_{\text{slope}} = 5.0$), strict cutoff ($\theta_{\text{cutoff}} = 15^\circ$).
   - Minimizes steep descents and climbs, weaves through flatter valleys and crater plains.
2. **Balanced Reconnaissance Route (Cyan #06B6D4):**
   - Moderate slope penalty ($w_{\text{slope}} = 2.0$, $\theta_{\text{cutoff}} = 20^\circ$).
   - Optimal trade-off between mission travel time and terrain safety.
3. **Direct Distance Route (Amber #F59E0B):**
   - Minimal slope penalty ($w_{\text{slope}} = 0.5$, $\theta_{\text{cutoff}} = 25^\circ$).
   - Prioritizes shortest path, demonstrating the risks and steep inclines of unoptimized direct navigation.

---

## 5. UI / UX & HUD Architecture
1. **Route Planner Command Drawer (`RoutePlannerDrawer.tsx`):**
   - Start & Destination coordinate pickers (manual input or "Click Map to Set").
   - 1-click Preset Scenarios:
     - *Jezero Crater Delta Mission:* Landing Site $\to$ Delta Fan Margin.
     - *Gale Crater Mount Sharp Ascent:* Bradbury Landing $\to$ Central Peak Foothills.
     - *Valles Marineris Chasma Crossing:* Candor Chasma plateau $\to$ canyon floor.
   - Vehicle Configuration Presets:
     - *Heavy Planetary Rover* (Perseverance / Curiosity: max $15^\circ$, 100m/sol).
     - *Light Scout Rover* (Sojourner / Mars Exploration Rover: max $12^\circ$, 50m/sol).
     - *Aerial Drone / Helicopter* (Ingenuity class: direct, slope-independent, max range 1 km/hop).
2. **Candidate Route Comparison Cards:**
   - Interactive cards displaying: Distance (km), Max Slope ($^\circ$), Average Slope ($^\circ$), Total Elevation Relief ($\Delta z$), Estimated Sols, and Safety Feasibility Badge.
   - "Select & Inspect Elevation Profile" button that loads the route into `ElevationProfileTray.tsx`.
3. **Dual-Viewport Graphics Synchronization:**
   - Dedicated `mars-routes-layer` on `MarsGlobeView.tsx` (3D SceneView) and `mars-routes-layer-2d` on `MarsMapView.tsx` (2D MapView).
   - High-contrast neon paths for all 3 candidates, with active route highlighted and start/finish flag markers.

