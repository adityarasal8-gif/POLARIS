import sqlite3
import uuid

DB_PATH = "polaris.db"

def seed_datasets():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear old broken datasets
    cursor.execute("DELETE FROM datasets;")

    datasets = [
        (
            str(uuid.uuid4()), "ds_maitri_met_24", "Maitri Meteorological Time-Series 2024", 
            "Continuous meteorological observations from Maitri station including temperature, wind speed, and humidity.",
            "Atmospheric Science", "Antarctica", "2024-01-01 to 2024-12-31", "-70.7668, 11.7308",
            '["Temperature", "Wind Speed", "Humidity", "Pressure"]', "NetCDF", "Open Access",
            "NCPOR", "2025-01-10", "Automated AWS Data Logger Level-2"
        ),
        (
            str(uuid.uuid4()), "ds_bharati_aurora", "Bharati Auroral Optical Feed", 
            "All-sky imager data and magnetometer readings for space weather and auroral studies at Bharati.",
            "Space Weather", "Antarctica", "2023-05-01 to 2023-10-30", "-69.4068, 76.1927",
            '["Auroral Intensity", "Magnetic Field X", "Magnetic Field Y"]', "HDF5", "Restricted",
            "IIG / NCPOR", "2024-11-20", "Bharati Observatory Calibrated"
        ),
        (
            str(uuid.uuid4()), "ds_himadri_aerosol", "Himadri Aerosol Optical Depth", 
            "Sun photometer measurements of aerosol optical depth at Ny-Ålesund, Svalbard.",
            "Atmospheric Science", "Arctic", "2022-04-01 to 2024-04-01", "78.9213, 11.9298",
            '["AOD 500nm", "AOD 870nm", "Angstrom Exponent"]', "CSV", "Open Access",
            "IMD / NCPOR", "2025-02-01", "Level-1.5 AERONET verified"
        ),
        (
            str(uuid.uuid4()), "ds_himansh_glacier", "Himansh Mass Balance Records", 
            "Stake network measurements of snow accumulation and ice ablation in the Chandra Basin.",
            "Glaciology", "Himalaya", "2018-01-01 to 2024-12-31", "32.4000, 77.6100",
            '["Net Mass Balance", "Equilibrium Line Altitude", "Accumulation Area Ratio"]', "GeoJSON / CSV", "Open Access",
            "NCPOR", "2025-01-15", "Field Survey Validated"
        ),
        (
            str(uuid.uuid4()), "ds_southern_ocean_ctd", "Southern Ocean CTD Profiles (43-ISEA)", 
            "Conductivity, Temperature, and Depth profiles collected during the 43rd Indian Scientific Expedition to Antarctica.",
            "Oceanography", "Antarctica", "2024-01-10 to 2024-03-20", "Southern Ocean (60S to 69S)",
            '["Temperature", "Salinity", "Depth", "Dissolved Oxygen"]', "NetCDF", "Open Access",
            "NCPOR", "2024-05-30", "SBE 911plus CTD Casts"
        ),
        (
            str(uuid.uuid4()), "ds_mosaic_seaice", "MOSAiC Drift Sea Ice Thickness", 
            "Electromagnetic induction sounder measurements of sea ice thickness during the MOSAiC expedition.",
            "Cryosphere", "Arctic", "2019-10-01 to 2020-09-30", "Arctic Ocean Drift",
            '["Sea Ice Thickness", "Snow Depth"]', "NetCDF", "Open Access",
            "AWI / NCPOR", "2022-12-01", "Helicopter-borne EM Bird"
        )
    ]

    for ds in datasets:
        cursor.execute("""
            INSERT INTO datasets (id, identifier, title, description, science_category, region, temporal_coverage, spatial_coverage, parameters, data_format, access_status, provider, last_updated, provenance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ds)

    conn.commit()
    conn.close()
    print("Injected valid dataset records successfully!")

if __name__ == "__main__":
    seed_datasets()
