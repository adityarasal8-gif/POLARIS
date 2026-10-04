import sqlite3
import json
import os

DB_PATH = "polaris.db"

def update_expeditions():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    updates = {
        "exp1": {
            "milestones": [
                {"date": "2023-11-20", "description": "MV Vasiliy Golovnin departs Cape Town for Antarctica."},
                {"date": "2023-12-15", "description": "Arrival at India Bay and initiation of ship-to-shore helicopter operations."},
                {"date": "2024-01-10", "description": "Completion of Maitri Station summer maintenance and resupply."},
                {"date": "2024-02-05", "description": "Deployment of atmospheric aerosol sensors and commencement of ice-core drilling."},
                {"date": "2024-04-01", "description": "Expedition successfully concludes, summer team departs Antarctica."}
            ],
            "source_urls": [
                {"title": "MoES Official Announcement", "url": "https://moes.gov.in/news"},
                {"title": "NCPOR 43-ISEA Dispatches", "url": "https://ncpor.res.in/antarctica"}
            ]
        },
        "exp2": {
            "milestones": [
                {"date": "2019-09-20", "description": "RV Polarstern departs Tromsø, Norway for the Central Arctic."},
                {"date": "2019-10-04", "description": "Vessel moored to a large ice floe, establishing the central observatory."},
                {"date": "2020-02-25", "description": "Indian scientists log extreme aerosol measurements during polar night."},
                {"date": "2020-05-15", "description": "Ice dynamics shift causes floe breakup; camp temporarily relocated."},
                {"date": "2020-10-12", "description": "Polarstern returns to Bremerhaven, completing 389 days of drift."}
            ],
            "source_urls": [
                {"title": "MOSAiC Expedition Official Portal", "url": "https://mosaic-expedition.org/"},
                {"title": "NCPOR Arctic Program", "url": "https://ncpor.res.in/arctic"},
                {"title": "AWI Expedition Logs", "url": "https://www.awi.de/en/focus/mosaic-expedition.html"}
            ]
        },
        "exp3": {
            "milestones": [
                {"date": "2024-04-01", "description": "Advance team departs for Spiti Valley to establish basecamp."},
                {"date": "2024-05-15", "description": "Himansh station (4080m ASL) successfully activated and calibrated."},
                {"date": "2024-06-10", "description": "Deployment of Differential GPS stakes on Sutri Dhaka glacier."},
                {"date": "2024-07-20", "description": "Completion of summer mass-balance measurements and drone surveys."},
                {"date": "2024-10-30", "description": "Final winterization of the station; researchers return."}
            ],
            "source_urls": [
                {"title": "NCPOR Himalaya Program", "url": "https://ncpor.res.in/himalaya"},
                {"title": "Ministry of Earth Sciences Press Release", "url": "https://moes.gov.in/"}
            ]
        }
    }

    for exp_id, data in updates.items():
        cursor.execute(
            "UPDATE expeditions SET milestones = ?, source_urls = ? WHERE id = ?",
            (json.dumps(data["milestones"]), json.dumps(data["source_urls"]), exp_id)
        )
        print(f"Updated expedition {exp_id}.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_expeditions()
