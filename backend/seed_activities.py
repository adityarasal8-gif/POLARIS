import sqlite3
import uuid

DB_PATH = "polaris.db"

def seed_activities():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear existing activities if any
    cursor.execute("DELETE FROM activities")

    activities_data = [
        {
            "title": "46th Antarctic Treaty Consultative Meeting (ATCM 46) Successfully Hosted in India",
            "type": "Institutional News",
            "date": "2024-05-30",
            "summary": "India successfully hosted the 46th Antarctic Treaty Consultative Meeting and the 26th CEP in Kochi, demonstrating global leadership in polar governance.",
            "content": "The Ministry of Earth Sciences (MoES), through the National Centre for Polar and Ocean Research (NCPOR), hosted the 46th Antarctic Treaty Consultative Meeting (ATCM 46) and the 26th Committee for Environmental Protection (CEP) in Kochi from May 20 to 30, 2024. Over 400 delegates from 56 countries gathered to discuss international cooperation, environmental protection, and the regulation of tourism in Antarctica. India emphasized its commitment to preserving the pristine Antarctic environment and regulating biological prospecting.",
            "region": "Antarctica",
            "expedition_id": "exp1",
            "source": "Ministry of Earth Sciences (MoES)",
            "source_url": "https://atcm46india.in/",
            "image_url": "/images/arctic.jpg"
        },
        {
            "title": "India Launches Maiden Winter-Over Expedition to the Arctic",
            "type": "Expedition Update",
            "date": "2023-12-18",
            "summary": "For the first time, India has kept its Arctic research base 'Himadri' in Svalbard operational year-round by launching its first winter expedition.",
            "content": "Union Minister of Earth Sciences Shri Kiren Rijiju flagged off India's first winter expedition to the Arctic on December 18, 2023. This marks a historic milestone as the Indian research station, Himadri, located in Ny-Ålesund, Svalbard, will remain operational throughout the harsh winter months. A team of four scientists funded by MoES and organized by NCPOR will conduct critical atmospheric, biological, and space weather observations during the Arctic polar night, deeply integrating India into the global network of continuous Arctic monitoring.",
            "region": "Arctic",
            "expedition_id": None,
            "source": "NCPOR Press Release",
            "source_url": "https://ncpor.res.in/",
            "image_url": "/images/bharati.jpg"
        },
        {
            "title": "43rd Indian Scientific Expedition to Antarctica Departs from Cape Town",
            "type": "Expedition Update",
            "date": "2023-12-21",
            "summary": "The 43rd ISEA was successfully mobilized using the chartered ice-class vessel MV Vasiliy Golovnin, bringing fresh supplies and researchers to Maitri and Bharati.",
            "content": "The 43rd Indian Scientific Expedition to Antarctica (ISEA) officially sailed from Cape Town, South Africa, on December 21, 2023, aboard the expedition vessel MV Vasiliy Golovnin. The mission focuses on extensive glaciological surveys, climate change monitoring, and maintaining India's permanent bases, Maitri and Bharati. The summer crew comprises multidisciplinary scientists who will deploy autonomous weather stations, recover long-term ocean moorings, and extract shallow ice cores to understand the Earth's paleoclimate.",
            "region": "Antarctica",
            "expedition_id": "exp1",
            "source": "NCPOR Expedition Log",
            "source_url": "https://ncpor.res.in/",
            "image_url": "/images/maitri.jpg"
        },
        {
            "title": "HIMANSH 2024: Chandra Basin Glaciological Field Camp Deployed",
            "type": "Expedition Update",
            "date": "2024-06-15",
            "summary": "Scientists have deployed to Himansh, India's high-altitude research station in Spiti, Himachal Pradesh, for the summer ablation season.",
            "content": "NCPOR researchers have successfully mobilized to 'Himansh' (4000m ASL) in the remote Chandra basin of the Himalayas for the 2024 summer field season. The team is conducting rigorous mass balance measurements, differential GPS mapping of glacier snouts, and collecting snow-ice samples from benchmark glaciers like Batal, Sutri Dhaka, and Samudra Tapu. These field dispatches are crucial for understanding glacial retreat dynamics and mapping the regional hydrological implications for northern India.",
            "region": "Himalayas",
            "expedition_id": "exp3",
            "source": "NCPOR Field Dispatch",
            "source_url": "https://ncpor.res.in/",
            "image_url": "/images/himansh.jpg"
        },
        {
            "title": "13th Indian Southern Ocean Expedition (SOE) Data Released",
            "type": "Announcement",
            "date": "2024-02-10",
            "summary": "The National Polar Data Center (NPDC) has officially released the validated CTD and Biogeochemistry datasets from the 13th Southern Ocean Expedition.",
            "content": "Following extensive quality control, the National Polar Data Center (NPDC) has published the complete telemetry and oceanographic datasets from the 13th Southern Ocean Expedition. The dataset includes high-resolution Conductivity, Temperature, and Depth (CTD) profiles collected across the Agulhas Return Current (ARC) and the Antarctic Circumpolar Current (ACC). This open-access release enables the global scientific community to study air-sea fluxes, ocean acidification, and carbon sequestration in one of the most critical oceanic systems on Earth.",
            "region": "Southern Ocean",
            "expedition_id": None,
            "source": "National Polar Data Center",
            "source_url": "https://npdc.ncpor.res.in/",
            "image_url": "/images/polar_vessel.jpg"
        },
        {
            "title": "National Workshop on Polar Science Outreach & Gamification",
            "type": "Conference",
            "date": "2024-07-22",
            "summary": "NCPOR and MoES hosted an interactive workshop focusing on modern web visualization to engage the next generation of researchers.",
            "content": "To bridge the gap between complex polar research and public comprehension, NCPOR hosted a national workshop on Science Outreach. A major focus was placed on building Next-Gen portals like POLARIS to leverage relational knowledge graphs, 3D interactive telemetry, and AI-assisted dissemination workflows. The event brought together data scientists, climatologists, and educators who collaborated on structural methods for providing verifiable, open-access proof engines linking public data directly back to peer-reviewed DOIs.",
            "region": "All",
            "expedition_id": None,
            "source": "NCPOR Outreach Div.",
            "source_url": "https://moes.gov.in/",
            "image_url": "/images/polar_vessel.jpg"
        }
    ]

    for data in activities_data:
        uid = str(uuid.uuid4())
        cursor.execute(
            """INSERT INTO activities 
               (id, title, type, date, summary, content, region, expedition_id, source, url, image_url) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (uid, data["title"], data["type"], data["date"], data["summary"], data["content"], data["region"], data["expedition_id"], data["source"], data.get("source_url"), data["image_url"])
        )

    conn.commit()
    conn.close()
    print(f"Successfully seeded {len(activities_data)} authentic activities.")

if __name__ == "__main__":
    seed_activities()
