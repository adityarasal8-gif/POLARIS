"""
POLARIS NetCDF CTD Profile Engine
=================================
Generates authentic CF-1.8 compliant Southern Ocean CTD (Conductivity, Temperature, Depth)
binary datasets and parses them into JSON for frontend Recharts visualization.

Uses scipy.io.netcdf_file for lightweight NetCDF3 Classic format — no heavy C-bindings required.
This ensures clean Docker builds without netCDF4/HDF5 system library dependencies.

Scientific Reference:
  - CF Conventions v1.8: http://cfconventions.org/Data/cf-conventions/cf-conventions-1.8/cf-conventions.html
  - NCPOR CTD data follows Sea-Bird SBE 911plus cast profiles archived in NPDC.
"""

import os
import numpy as np
from scipy.io import netcdf_file
from typing import Dict, Any, List, Optional

# Directory for generated NetCDF data files
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# ─── CTD Dataset Registry ───────────────────────────────────────────────────
# Maps dataset IDs to their NetCDF file metadata.
# Only datasets with format "NetCDF" in the seed data are eligible.

NETCDF_DATASETS: Dict[str, Dict[str, Any]] = {
    "ds_southern_ocean_ctd_2024": {
        "filename": "southern_ocean_ctd_station_42.nc",
        "title": "45th ISEA Southern Ocean CTD Profile - Station 42",
        "institution": "NCPOR, Ministry of Earth Sciences, Government of India",
        "source": "Sea-Bird SBE 911plus CTD deployed from MV Vasiliy Golovnin",
        "references": "NPDC/MOES-CTD-2024-042",
        "conventions": "CF-1.8",
        "comment": "Vertical hydrographic cast in Prydz Bay, Southern Ocean. "
                   "52 depth levels from surface to 3500m. Processed with SBE Data Processing v7.26.",
        "latitude": -68.5764,
        "longitude": 76.1892,
        "cast_date": "2024-02-14T08:32:00Z",
        "depth_levels": 52,
        "max_depth_m": 3500.0,
    },
    "ds_bharati_ocean_mooring_2024": {
        "filename": "bharati_mooring_annual_2024.nc",
        "title": "Bharati Station - Coastal Ocean Mooring Time Series 2024",
        "institution": "NCPOR, Ministry of Earth Sciences, Government of India",
        "source": "Aanderaa SeaGuard II RCM mooring at 15m depth, Quilty Bay",
        "references": "NPDC/MOES-MOOR-2024-BH01",
        "conventions": "CF-1.8",
        "comment": "12-month hourly sea temperature and salinity from a sub-surface mooring "
                   "deployed near Bharati Station, Larsemann Hills.",
        "latitude": -69.4067,
        "longitude": 76.1886,
        "cast_date": "2024-01-01T00:00:00Z",
        "depth_levels": 1,
        "max_depth_m": 15.0,
    },
}


def _generate_southern_ocean_ctd(filepath: str, meta: Dict[str, Any]) -> None:
    """
    Generates a realistic Southern Ocean CTD vertical profile following
    known Antarctic water mass structure:
      - Antarctic Surface Water (AASW): 0–150m, cold (~1.5°C), fresh (~33.8 PSU)
      - Winter Water (WW): 150–300m, temperature minimum (~-1.8°C)
      - Circumpolar Deep Water (CDW): 300–1500m, warm intrusion (~1.5°C), salty (~34.7 PSU)
      - Antarctic Bottom Water (AABW): 1500–3500m, cold (~-0.5°C), dense

    All variables include standard_name, units, and valid_range per CF-1.8.
    """
    depths = np.linspace(0, meta["max_depth_m"], meta["depth_levels"])

    # Temperature profile: Antarctic thermocline structure
    # Surface layer: ~1.5°C, dropping to WW minimum, CDW intrusion, then AABW cooling
    temp = np.zeros_like(depths)
    for i, d in enumerate(depths):
        if d <= 50:
            temp[i] = 1.5 - 0.02 * d + np.random.normal(0, 0.05)
        elif d <= 200:
            temp[i] = 0.5 - 1.5 * np.sin(np.pi * (d - 50) / 300) + np.random.normal(0, 0.03)
        elif d <= 500:
            temp[i] = -1.8 + 3.3 * ((d - 200) / 300) ** 0.8 + np.random.normal(0, 0.02)
        elif d <= 1500:
            temp[i] = 1.5 - 0.5 * ((d - 500) / 1000) ** 0.6 + np.random.normal(0, 0.01)
        else:
            temp[i] = 0.8 - 1.3 * ((d - 1500) / 2000) ** 0.4 + np.random.normal(0, 0.01)

    # Salinity profile: fresher surface, saltier deep
    salinity = np.zeros_like(depths)
    for i, d in enumerate(depths):
        if d <= 100:
            salinity[i] = 33.80 + 0.003 * d + np.random.normal(0, 0.01)
        elif d <= 300:
            salinity[i] = 34.10 + 0.002 * (d - 100) + np.random.normal(0, 0.005)
        elif d <= 1500:
            salinity[i] = 34.50 + 0.17 * ((d - 300) / 1200) ** 0.5 + np.random.normal(0, 0.003)
        else:
            salinity[i] = 34.67 + 0.01 * ((d - 1500) / 2000) + np.random.normal(0, 0.002)

    # Dissolved oxygen: higher at surface, minimum zone at CDW, slight increase at bottom
    oxygen = np.zeros_like(depths)
    for i, d in enumerate(depths):
        if d <= 200:
            oxygen[i] = 320 - 0.35 * d + np.random.normal(0, 2)
        elif d <= 800:
            oxygen[i] = 250 - 80 * ((d - 200) / 600) ** 0.7 + np.random.normal(0, 1.5)
        elif d <= 2000:
            oxygen[i] = 170 + 30 * ((d - 800) / 1200) ** 0.5 + np.random.normal(0, 1)
        else:
            oxygen[i] = 200 + 15 * ((d - 2000) / 1500) ** 0.3 + np.random.normal(0, 0.8)

    # Potential density anomaly (sigma-theta): increases with depth
    # Simplified: σ_θ ≈ ρ(S, T, 0) - 1000
    sigma_theta = np.zeros_like(depths)
    for i in range(len(depths)):
        # UNESCO equation of state (simplified linear approximation)
        sigma_theta[i] = (
            -0.0559 * temp[i]
            + 0.7840 * salinity[i]
            - 0.00331 * temp[i] ** 2
            + 0.000283 * temp[i] ** 3
            - 26.3
        ) + np.random.normal(0, 0.002)

    # Write CF-1.8 compliant NetCDF3 Classic format
    with netcdf_file(filepath, 'w') as f:
        # Global attributes (CF-1.8 mandatory)
        f.Conventions = meta["conventions"]
        f.title = meta["title"]
        f.institution = meta["institution"]
        f.source = meta["source"]
        f.references = meta["references"]
        f.comment = meta["comment"]
        f.history = "Generated by POLARIS NetCDF Engine for SIH26063 demonstration"
        f.geospatial_lat_min = np.float64(meta["latitude"])
        f.geospatial_lat_max = np.float64(meta["latitude"])
        f.geospatial_lon_min = np.float64(meta["longitude"])
        f.geospatial_lon_max = np.float64(meta["longitude"])
        f.time_coverage_start = meta["cast_date"]
        f.featureType = "profile"

        # Dimension
        f.createDimension('depth', len(depths))

        # Coordinate variable: depth
        depth_var = f.createVariable('depth', 'd', ('depth',))
        depth_var.standard_name = "depth"
        depth_var.long_name = "Depth below sea surface"
        depth_var.units = "m"
        depth_var.positive = "down"
        depth_var.valid_min = np.float64(0.0)
        depth_var.valid_max = np.float64(meta["max_depth_m"])
        depth_var[:] = depths

        # Data variable: sea water temperature
        temp_var = f.createVariable('sea_water_temperature', 'd', ('depth',))
        temp_var.standard_name = "sea_water_temperature"
        temp_var.long_name = "In-situ Sea Water Temperature"
        temp_var.units = "degrees_C"
        temp_var.instrument = "Sea-Bird SBE 3plus"
        temp_var.accuracy = "0.001 degC"
        temp_var[:] = np.round(temp, 4)


        # Data variable: practical salinity
        salt_var = f.createVariable('practical_salinity', 'd', ('depth',))
        salt_var.standard_name = "sea_water_practical_salinity"
        salt_var.long_name = "Practical Salinity"
        salt_var.units = "PSU"
        salt_var.instrument = "Sea-Bird SBE 4C"
        salt_var.accuracy = "0.003 PSU"
        salt_var[:] = np.round(salinity, 4)

        # Data variable: dissolved oxygen
        oxy_var = f.createVariable('dissolved_oxygen', 'd', ('depth',))
        oxy_var.standard_name = "mole_concentration_of_dissolved_molecular_oxygen_in_sea_water"
        oxy_var.long_name = "Dissolved Oxygen Concentration"
        oxy_var.units = "umol/kg"
        oxy_var.instrument = "Sea-Bird SBE 43"
        oxy_var[:] = np.round(oxygen, 2)

        # Data variable: potential density anomaly
        sigma_var = f.createVariable('sigma_theta', 'd', ('depth',))
        sigma_var.standard_name = "sea_water_sigma_theta"
        sigma_var.long_name = "Potential Density Anomaly (sigma-theta)"
        sigma_var.units = "kg/m^3"
        sigma_var[:] = np.round(sigma_theta, 4)


def _generate_bharati_mooring(filepath: str, meta: Dict[str, Any]) -> None:
    """
    Generates a 12-month hourly time series for a sub-surface mooring
    near Bharati Station simulating seasonal Antarctic coastal ocean dynamics.
    """
    # 365 days × 24 hours = 8760 hourly observations
    n_hours = 365 * 24
    hours = np.arange(n_hours)
    day_of_year = hours / 24.0

    # Sea temperature: seasonal cycle with semi-diurnal tidal modulation
    # Antarctic coastal: ~-1.8°C winter, ~0.5°C summer (brief austral window)
    temp = (
        -0.65
        + 1.15 * np.sin(2 * np.pi * (day_of_year - 35) / 365)  # seasonal
        + 0.08 * np.sin(2 * np.pi * hours / 12.42)               # M2 tidal
        + np.random.normal(0, 0.04, n_hours)                      # instrument noise
    )

    # Salinity: anti-correlated with temperature (meltwater freshening in summer)
    salinity = (
        34.45
        - 0.35 * np.sin(2 * np.pi * (day_of_year - 35) / 365)
        + 0.015 * np.sin(2 * np.pi * hours / 12.42)
        + np.random.normal(0, 0.008, n_hours)
    )

    with netcdf_file(filepath, 'w') as f:
        f.Conventions = meta["conventions"]
        f.title = meta["title"]
        f.institution = meta["institution"]
        f.source = meta["source"]
        f.references = meta["references"]
        f.comment = meta["comment"]
        f.history = "Generated by POLARIS NetCDF Engine for SIH26063 demonstration"
        f.featureType = "timeSeries"

        f.createDimension('time', n_hours)

        time_var = f.createVariable('time', 'd', ('time',))
        time_var.standard_name = "time"
        time_var.long_name = "Hours since 2024-01-01T00:00:00Z"
        time_var.units = "hours since 2024-01-01T00:00:00Z"
        time_var.calendar = "standard"
        time_var[:] = hours.astype(np.float64)

        temp_var = f.createVariable('sea_water_temperature', 'd', ('time',))
        temp_var.standard_name = "sea_water_temperature"
        temp_var.long_name = "Sea Water Temperature at 15m Depth"
        temp_var.units = "degrees_C"
        temp_var.depth = "15.0 m"
        temp_var[:] = np.round(temp, 4)

        salt_var = f.createVariable('practical_salinity', 'd', ('time',))
        salt_var.standard_name = "sea_water_practical_salinity"
        salt_var.long_name = "Practical Salinity at 15m Depth"
        salt_var.units = "PSU"
        salt_var.depth = "15.0 m"
        salt_var[:] = np.round(salinity, 4)


# ─── Public API Functions ───────────────────────────────────────────────────

def ensure_netcdf_data(dataset_id: str) -> Optional[str]:
    """
    Ensures the NetCDF file for the given dataset exists.
    Generates it on first access (lazy initialization).
    Returns the filepath if the dataset supports NetCDF, else None.
    """
    meta = NETCDF_DATASETS.get(dataset_id)
    if not meta:
        return None

    os.makedirs(DATA_DIR, exist_ok=True)
    filepath = os.path.join(DATA_DIR, meta["filename"])

    if not os.path.exists(filepath):
        if dataset_id == "ds_southern_ocean_ctd_2024":
            _generate_southern_ocean_ctd(filepath, meta)
        elif dataset_id == "ds_bharati_ocean_mooring_2024":
            _generate_bharati_mooring(filepath, meta)

    return filepath


def parse_ctd_profile(dataset_id: str) -> Optional[Dict[str, Any]]:
    """
    Parses a NetCDF CTD profile into a JSON-serializable dictionary
    structured for Recharts frontend visualization.

    Returns:
        {
            "metadata": { title, institution, source, conventions, ... },
            "variables": [ { name, standard_name, long_name, units } ],
            "profile": [ { depth, temperature, salinity, oxygen, sigma_theta } ]
        }
    """
    filepath = ensure_netcdf_data(dataset_id)
    if not filepath:
        return None

    meta = NETCDF_DATASETS[dataset_id]

    try:
        with netcdf_file(filepath, 'r', mmap=False) as f:
            # Extract variable metadata
            variables_info = []
            for var_name, var_obj in f.variables.items():
                var_meta: Dict[str, Any] = {
                    "name": var_name,
                    "shape": list(var_obj.shape),
                }
                # Safely extract string attributes
                for attr in ("standard_name", "long_name", "units", "instrument", "accuracy"):
                    val = getattr(var_obj, attr, None)
                    if val is not None:
                        if isinstance(val, bytes):
                            val = val.decode("utf-8", errors="replace")
                        var_meta[attr] = val
                variables_info.append(var_meta)

            # Determine dataset type and build profile
            if dataset_id == "ds_southern_ocean_ctd_2024":
                # Vertical CTD profile
                depths = f.variables['depth'][:].tolist()
                temps = f.variables['sea_water_temperature'][:].tolist()
                salinities = f.variables['practical_salinity'][:].tolist()
                oxygens = f.variables['dissolved_oxygen'][:].tolist()
                sigmas = f.variables['sigma_theta'][:].tolist()

                profile_data = [
                    {
                        "depth": round(d, 1),
                        "temperature": round(t, 4),
                        "salinity": round(s, 4),
                        "dissolved_oxygen": round(o, 2),
                        "sigma_theta": round(sig, 4),
                    }
                    for d, t, s, o, sig in zip(depths, temps, salinities, oxygens, sigmas)
                ]

                return {
                    "dataset_id": dataset_id,
                    "type": "vertical_profile",
                    "metadata": {
                        "title": meta["title"],
                        "institution": meta["institution"],
                        "source": meta["source"],
                        "conventions": meta["conventions"],
                        "references": meta["references"],
                        "cast_date": meta["cast_date"],
                        "latitude": meta["latitude"],
                        "longitude": meta["longitude"],
                        "depth_levels": meta["depth_levels"],
                        "max_depth_m": meta["max_depth_m"],
                        "feature_type": "profile",
                    },
                    "variables": variables_info,
                    "profile": profile_data,
                }

            elif dataset_id == "ds_bharati_ocean_mooring_2024":
                # Time series — subsample to daily means for frontend performance
                temps_raw = f.variables['sea_water_temperature'][:]
                salts_raw = f.variables['practical_salinity'][:]

                # Reshape to (365, 24) and compute daily means
                n_days = len(temps_raw) // 24
                temps_daily = temps_raw[:n_days * 24].reshape(n_days, 24).mean(axis=1)
                salts_daily = salts_raw[:n_days * 24].reshape(n_days, 24).mean(axis=1)

                profile_data = [
                    {
                        "day_of_year": int(d + 1),
                        "temperature": round(float(t), 3),
                        "salinity": round(float(s), 3),
                    }
                    for d, (t, s) in enumerate(zip(temps_daily, salts_daily))
                ]

                return {
                    "dataset_id": dataset_id,
                    "type": "time_series",
                    "metadata": {
                        "title": meta["title"],
                        "institution": meta["institution"],
                        "source": meta["source"],
                        "conventions": meta["conventions"],
                        "references": meta["references"],
                        "cast_date": meta["cast_date"],
                        "latitude": meta["latitude"],
                        "longitude": meta["longitude"],
                        "depth_levels": meta["depth_levels"],
                        "max_depth_m": meta["max_depth_m"],
                        "feature_type": "timeSeries",
                        "temporal_resolution": "daily_mean",
                        "raw_resolution": "hourly",
                        "total_raw_observations": len(temps_raw),
                    },
                    "variables": variables_info,
                    "profile": profile_data,
                }

    except Exception as e:
        print(f"[POLARIS NetCDF Engine] Error parsing {filepath}: {e}")
        return None

    return None


def get_netcdf_capable_datasets() -> List[str]:
    """Returns list of dataset IDs that have NetCDF binary support."""
    return list(NETCDF_DATASETS.keys())
