import sqlite3
import uuid

DB_PATH = "polaris.db"

def seed_strict():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear old data for these tables
    cursor.execute("DELETE FROM expeditions;")
    cursor.execute("DELETE FROM stations;")
    cursor.execute("DELETE FROM publications;")
    cursor.execute("DELETE FROM media_assets;")

    # 1. Stations
    stations = [
        ("s1", "Maitri", "Antarctica", "Schirmacher Oasis", -70.7668, 11.7308, 130, 1989, "Active", "Year-round", '["Atmospheric Science", "Geophysics"]', "/images/maitri.jpg", "MoES"),
        ("s2", "Bharati", "Antarctica", "Larsemann Hills", -69.4068, 76.1927, 35, 2012, "Active", "Year-round", '["Oceanography", "Space Weather"]', "/images/bharati.jpg", "MoES"),
        ("s3", "Himadri", "Arctic", "Svalbard", 78.9213, 11.9298, 15, 2008, "Active", "Summer", '["Aerosols", "Biogeochem"]', "/images/arctic.jpg", "MoES"),
        ("s4", "Himansh", "Himalaya", "Spiti", 32.4000, 77.6100, 4080, 2016, "Active", "Summer", '["Glaciology"]', "/images/himansh.jpg", "MoES")
    ]
    for st in stations:
        cursor.execute("INSERT INTO stations (id, name, region, location_description, latitude, longitude, elevation_m, commissioned_year, status, purpose, research_themes, image_url, image_credit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", st)

    # 2. Expeditions
    exp1_id = "exp1"
    exp2_id = "exp2"
    exp3_id = "exp3"
    
    expeditions = [
        (
            exp1_id, "43-ISEA", "43rd Indian Scientific Expedition to Antarctica", "Antarctica", "2023-11-01 to 2024-04-01", 2024, "Active",
            "Dr. Thamban Meloth", "Chief Scientist", "MV Vasiliy Golovnin", 
            "The 43rd ISEA focuses on atmospheric sciences, biological studies, and maintaining the Maitri and Bharati stations.", 
            "Comprehensive polar operations.",
            '["Climate Change Monitoring", "Glacial Dynamics"]', '["Atmospheric Science", "Biogeochemistry"]', '["Maitri", "Bharati"]', '["Dr. Rajan", "Dr. Meloth"]',
            "/images/maitri.jpg", "NCPOR"
        ),
        (
            exp2_id, "MOSAiC", "MOSAiC Arctic Expedition (Indian Participation)", "Arctic", "2019-09-20 to 2020-10-12", 2019, "Completed",
            "Dr. M. Ravichandran", "Lead Researcher", "Polarstern", 
            "Multidisciplinary drifting observatory for the Study of Arctic Climate.", 
            "Indian scientists contributed to atmospheric aerosol studies.",
            '["Arctic Amplification", "Aerosol Forcing"]', '["Climate Modeling", "Ice Thermodynamics"]', '["Central Arctic"]', '["Dr. Ravichandran"]',
            "/images/arctic.jpg", "AWI"
        ),
        (
            exp3_id, "HIMANSH-24", "Himansh High-Altitude Glaciological Camp", "Himalaya", "2024-04-01 to Present", 2024, "Active",
            "Dr. S. Rajan", "Glaciologist", "N/A", 
            "Continuous monitoring of Himalayan glaciers (Chandra basin).", 
            "Studying snowmelt runoff and mass balance.",
            '["Mass Balance", "Hydrological Modeling"]', '["Glaciology", "Hydrology"]', '["Chandra Basin"]', '["Dr. Rajan"]',
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", "NCPOR"
        )
    ]
    for ex in expeditions:
        cursor.execute("""
            INSERT INTO expeditions (id, code, name, region, dates, year, status, leader_name, leader_title, vessel, summary, mission_overview, objectives, research_themes, field_locations, researchers, hero_image, hero_image_credit)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ex)

    # 3. Publications
    pubs = [
        ("Schirmacher Oasis permafrost melt dynamics", "Nature Geoscience", "10.1038/s41586-024-1111-1", exp1_id, "Antarctica", 2024, "Cryosphere Dynamics"),
        ("Biogeochemical cycling in the Southern Ocean", "Deep Sea Research Part II", "10.1016/j.dsr2.2023.105234", exp1_id, "Antarctica", 2023, "Oceanography"),
        ("Svalbard atmospheric aerosols and their radiative forcing", "Atmospheric Environment", "10.1016/j.atmosenv.2023.120001", exp2_id, "Arctic", 2023, "Atmospheric Science"),
        ("Glacial mass balance of the Chandra Basin", "Journal of Glaciology", "10.3189/2024JoG23J102", exp3_id, "Himalaya", 2024, "Glaciology"),
        ("Sea ice thickness variations during MOSAiC drift", "Geophysical Research Letters", "10.1029/2023GL103002", exp2_id, "Arctic", 2023, "Cryosphere Dynamics"),
        ("Microbial diversity in subglacial lakes near Maitri", "The ISME Journal", "10.1038/s41396-023-01456-2", exp1_id, "Antarctica", 2023, "Biological Sciences"),
        ("Decadal changes in surface mass balance over East Antarctica", "Geophysical Research Letters", "10.1029/2023GL014455", exp1_id, "Antarctica", 2024, "Glaciology"),
        ("Ozone hole recovery trends mapped via Bharati station", "JQSRT", "10.1016/j.jqsrt.2023.108500", exp1_id, "Antarctica", 2023, "Atmospheric Science"),
        ("Phytoplankton blooms in Kongsfjorden, Svalbard", "Frontiers in Marine Science", "10.3389/fmars.2023.111111", exp2_id, "Arctic", 2023, "Marine Biology"),
        ("Permafrost thaw induced GHG emissions in Spitsbergen", "Nature Climate Change", "10.1038/s41558-024-00101-y", exp2_id, "Arctic", 2024, "Biogeochemistry"),
        ("Isotopic signature of precipitation in Lahaul-Spiti", "Journal of Hydrology", "10.1016/j.jhydrol.2023.130000", exp3_id, "Himalaya", 2023, "Hydrology"),
        ("Black carbon deposition on Himalayan glaciers", "Science of The Total Environment", "10.1016/j.scitotenv.2023.160000", exp3_id, "Himalaya", 2023, "Atmospheric Science"),
        ("Benthic biodiversity around Larsemann Hills", "Marine Environmental Research", "10.1016/j.marenvres.2024.106000", exp1_id, "Antarctica", 2024, "Marine Biology"),
        ("Space weather monitoring from Maitri and Bharati", "Space Weather", "10.1029/2023SW003000", exp1_id, "Antarctica", 2023, "Space Weather"),
        ("Hydrological modeling of Chandra river basin", "Water Resources Management", "10.1007/s11269-023-03700-1", exp3_id, "Himalaya", 2024, "Hydrology")
    ]
    for p in pubs:
        cursor.execute("""
            INSERT INTO publications (id, title, authors, journal, year, volume_issue, doi, abstract, region, research_topic, expedition_id, station_id, citation_count, pdf_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), p[0], '["Dr. Rajan", "Dr. Meloth"]', p[1], p[5], "Vol 1", p[2], "Detailed analysis of polar research findings based on observations.", p[4], p[6], p[3], "s1", 42, 1))

    # 4. Media Assets
    assets = [
        (exp1_id, "MV Vasiliy Golovnin Icebreaker", "https://images.unsplash.com/photo-1548680190-67c4e2079294?w=800&q=80", "photo", "Antarctica"),
        (exp1_id, "SA Agulhas at Ice Shelf", "https://images.unsplash.com/photo-1520697920150-13f56ce43f11?w=800&q=80", "photo", "Antarctica"),
        (exp1_id, "Penguin Colony near Bharati", "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&q=80", "photo", "Antarctica"),
        (exp2_id, "Ice Core Drilling in Svalbard", "https://images.unsplash.com/photo-1533256085189-9fc01e2cba9b?w=800&q=80", "photo", "Arctic"),
        (exp2_id, "CTD Rosette Deployment", "https://images.unsplash.com/photo-1582046896173-90ce9c8f9214?w=800&q=80", "photo", "Arctic"),
        (exp3_id, "Himansh Station Himalayas", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", "photo", "Himalaya")
    ]
    for a in assets:
        cursor.execute("""
            INSERT INTO media_assets (id, title, type, region, station_id, expedition_id, date, caption, thumbnail_url, media_url, credit, source, license, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (str(uuid.uuid4()), a[1], a[3], a[4], "s1", a[0], "2024-01-01", "A stunning polar observation.", a[2], a[2], "MoES PR Team", "NCPOR", "CC-BY", '["Fieldwork", "Nature"]'))

    conn.commit()
    conn.close()
    print("Strict seed complete. All fields populated.")

if __name__ == "__main__":
    seed_strict()
