import sqlite3
import json
import random
from datetime import datetime, timedelta

DB_PATH = "polaris.db"

def fix_regions_and_samples():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    regions = ["Antarctic", "Arctic", "Himalayas", "Southern Ocean", "Indian Ocean"]

    # 1. Update datasets with sample data and diverse regions
    cursor.execute("SELECT id, identifier FROM datasets")
    datasets = cursor.fetchall()
    
    for i, row in enumerate(datasets):
        uid = row[0]
        identifier = row[1]
        
        # Generate rich sample data (100 rows)
        sample_data = []
        base_date = datetime(2024, 1, 1)
        for j in range(100):
            sample_data.append({
                "date": (base_date + timedelta(days=j)).strftime("%Y-%m-%d"),
                "temperature_c": round(random.uniform(-40.0, 5.0), 2),
                "salinity_psu": round(random.uniform(33.0, 35.5), 2),
                "depth_m": round(random.uniform(10.0, 1000.0), 1),
                "reading_id": f"{identifier}-R{j:03d}"
            })
            
        region = regions[i % len(regions)]
        
        cursor.execute(
            "UPDATE datasets SET sample_data = ?, region = ? WHERE id = ?", 
            (json.dumps(sample_data), region, uid)
        )

    # 2. Update Expeditions regions
    cursor.execute("SELECT id FROM expeditions")
    for i, row in enumerate(cursor.fetchall()):
        region = regions[i % len(regions)]
        cursor.execute("UPDATE expeditions SET region = ? WHERE id = ?", (region, row[0]))

    # 3. Update Publications regions
    cursor.execute("SELECT id FROM publications")
    for i, row in enumerate(cursor.fetchall()):
        region = regions[i % len(regions)]
        cursor.execute("UPDATE publications SET region = ? WHERE id = ?", (region, row[0]))

    # 4. Update Media regions
    cursor.execute("SELECT id FROM media_assets")
    for i, row in enumerate(cursor.fetchall()):
        region = regions[i % len(regions)]
        cursor.execute("UPDATE media_assets SET region = ? WHERE id = ?", (region, row[0]))

    conn.commit()
    conn.close()
    print("Successfully updated sample data and regions across all entities.")

if __name__ == "__main__":
    fix_regions_and_samples()
