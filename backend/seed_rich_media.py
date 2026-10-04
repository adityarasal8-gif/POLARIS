import sqlite3
import json

DB_PATH = "polaris.db"

MEDIA = [
    {
        "id": "media_penguin_colony_001",
        "title": "Adélie Penguin Colony Observation",
        "type": "photo",
        "region": "Antarctic",
        "date": "2023-11-15",
        "caption": "Researchers observing a large Adélie penguin colony near Bharati station to monitor breeding pair counts.",
        "thumbnail_url": "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80",
        "media_url": "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1600&q=80",
        "credit": "NCPOR Field Team",
        "tags": ["biology", "penguins", "wildlife", "bharati"]
    },
    {
        "id": "media_vessel_ice_001",
        "title": "Icebreaker in Southern Ocean",
        "type": "photo",
        "region": "Southern Ocean",
        "date": "2024-01-22",
        "caption": "The chartered expedition vessel navigating through heavy pack ice in the Southern Ocean.",
        "thumbnail_url": "/images/vessel.jpg",
        "media_url": "/images/vessel.jpg",
        "credit": "MoES / NCPOR",
        "tags": ["vessel", "southern ocean", "expedition"]
    },
    {
        "id": "media_ctd_rosette_001",
        "title": "CTD Rosette Deployment",
        "type": "photo",
        "region": "Southern Ocean",
        "date": "2023-12-05",
        "caption": "Scientists deploying a CTD Rosette to measure conductivity, temperature, and depth.",
        "thumbnail_url": "/images/ctd_rosette.jpg",
        "media_url": "/images/ctd_rosette.jpg",
        "credit": "Southern Ocean Expedition Team",
        "tags": ["ctd", "oceanography", "marine biology"]
    },
    {
        "id": "media_glacier_melt_001",
        "title": "Glacial Retreat Monitoring at Svalbard",
        "type": "photo",
        "region": "Arctic",
        "date": "2023-08-10",
        "caption": "Monitoring rapid glacial melt and calving near Ny-Ålesund, Arctic.",
        "thumbnail_url": "/images/arctic.jpg",
        "media_url": "/images/arctic.jpg",
        "credit": "Himadri Base Team",
        "tags": ["glaciology", "climate change", "arctic"]
    },
    {
        "id": "media_arctic_himadri_002",
        "title": "Field Sampling at Himadri",
        "type": "photo",
        "region": "Arctic",
        "date": "2023-08-12",
        "caption": "Scientists in polar gear collecting ice and water samples near Himadri research station in Ny-Ålesund, Svalbard, Arctic.",
        "thumbnail_url": "/images/himadri.jpg",
        "media_url": "/images/himadri.jpg",
        "credit": "NCPOR Arctic Expedition",
        "tags": ["sampling", "himadri", "arctic"]
    },
    {
        "id": "media_aurora_australis_001",
        "title": "Aurora Australis over Maitri",
        "type": "photo",
        "region": "Antarctic",
        "date": "2023-06-15",
        "caption": "A stunning display of the Southern Lights captured during the polar night at Maitri station.",
        "thumbnail_url": "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=800&q=80",
        "media_url": "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1600&q=80",
        "credit": "Winter-over Team 2023",
        "tags": ["aurora", "atmospheric science", "maitri"]
    },
    {
        "id": "media_antarctica_maitri_blizzard",
        "title": "Maitri Station Blizzard Operations",
        "type": "photo",
        "region": "Antarctic",
        "date": "2023-07-20",
        "caption": "Maitri research station in Antarctica during a blizzard, with scientists in heavy red parkas working outside near equipment.",
        "thumbnail_url": "/images/maitri.jpg",
        "media_url": "/images/maitri.jpg",
        "credit": "Antarctic Expedition Team",
        "tags": ["maitri", "blizzard", "weather"]
    },
    {
        "id": "media_himalaya_himansh_001",
        "title": "Himansh Research Station, Spiti",
        "type": "photo",
        "region": "Himalayas",
        "date": "2023-09-05",
        "caption": "Himansh high-altitude glaciological research camp in the Spiti Valley Himalayas. Small yellow and red tents and solar panels surrounded by massive snow peaks.",
        "thumbnail_url": "/images/himansh.jpg",
        "media_url": "/images/himansh.jpg",
        "credit": "Himalayan Glaciology Team",
        "tags": ["glacier", "spiti", "himalayas", "himansh"]
    },
    {
        "id": "media_ice_core_001",
        "title": "Ice Core Drilling Camp",
        "type": "photo",
        "region": "Antarctic",
        "date": "2023-12-01",
        "caption": "Scientists extracting an ice core sample from the Antarctic ice sheet to study paleoclimate records.",
        "thumbnail_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "media_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
        "credit": "Ice Core Team",
        "tags": ["ice core", "paleoclimate", "drilling"]
    },
    {
        "id": "media_himalaya_glacier_002",
        "title": "Chandra Basin Glaciers",
        "type": "photo",
        "region": "Himalayas",
        "date": "2023-08-22",
        "caption": "Extensive view of the glaciers in the Chandra basin, monitored by NCPOR.",
        "thumbnail_url": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80",
        "media_url": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80",
        "credit": "Himalayan Research Team",
        "tags": ["chandra basin", "glaciology", "himalayas"]
    },
    {
        "id": "media_arctic_aurora_003",
        "title": "Aurora Borealis over Ny-Ålesund",
        "type": "photo",
        "region": "Arctic",
        "date": "2024-02-14",
        "caption": "Brilliant Northern Lights illuminating the snowy tundra over the research base in Svalbard.",
        "thumbnail_url": "/images/arctic_aurora.jpg",
        "media_url": "/images/arctic_aurora.jpg",
        "credit": "Himadri Winter Team",
        "tags": ["aurora", "arctic", "svalbard"]
    },
    {
        "id": "media_himalayas_glaciologist_003",
        "title": "Glaciologist Measuring Accumulation",
        "type": "photo",
        "region": "Himalayas",
        "date": "2023-09-12",
        "caption": "An Indian glaciologist measuring snow accumulation with a stake on a massive glacier in the Himalayas.",
        "thumbnail_url": "/images/himalayas_glaciologist.jpg",
        "media_url": "/images/himalayas_glaciologist.jpg",
        "credit": "Spiti Expedition Team",
        "tags": ["glaciologist", "himalayas", "fieldwork"]
    },
    {
        "id": "media_southern_waves_003",
        "title": "Research Vessel Navigating Southern Ocean",
        "type": "photo",
        "region": "Southern Ocean",
        "date": "2024-01-08",
        "caption": "Massive blue waves crashing against the bow of the research vessel traversing the Southern Ocean.",
        "thumbnail_url": "/images/southern_waves.jpg",
        "media_url": "/images/southern_waves.jpg",
        "credit": "Marine Logistics",
        "tags": ["vessel", "southern ocean", "waves"]
    }
]

def seed_media():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM media_assets')
    
    for m in MEDIA:
        cursor.execute('''
            INSERT INTO media_assets 
            (id, title, type, region, date, caption, thumbnail_url, media_url, credit, source, license, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            m["id"], m["title"], m["type"], m["region"], m["date"], m["caption"],
            m["thumbnail_url"], m["media_url"], m["credit"], "NCPOR Archive", "CC-BY-NC 4.0",
            json.dumps(m["tags"])
        ))
        
    conn.commit()
    conn.close()
    print(f"Successfully seeded {len(MEDIA)} rich media assets.")

if __name__ == "__main__":
    seed_media()
