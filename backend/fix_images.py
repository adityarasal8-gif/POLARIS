import sqlite3
import os

DB_PATH = "polaris.db"

def fix_images():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    image_map = {
        "EXP-01": "/images/op_gangotri.jpg",
        "DG-01": "/images/dakshin.jpg",
        "EXP-08": "/images/maitri.jpg",
        "SO-01": "/images/polar_vessel.jpg",
        "ARC-01": "/images/arctic.jpg",
        "EXP-31": "/images/bharati.jpg",
        "HIM-01": "/images/himansh.jpg",
        "EXP-45": "/images/polar_vessel.jpg",
        "exp1": "/images/maitri.jpg",  # 43-ISEA
        "exp2": "/images/arctic.jpg",  # MOSAiC
        "exp3": "/images/himansh.jpg", # HIMANSH-24
    }

    # Update expeditions
    for code, img in image_map.items():
        cursor.execute("UPDATE expeditions SET hero_image = ? WHERE code = ? OR id = ?", (img, code, code))
        print(f"Updated expedition {code} to {img}")

    # For stations, just map by ID
    station_map = {
        "s1": "/images/maitri.jpg",
        "s2": "/images/bharati.jpg",
        "s3": "/images/arctic.jpg",
        "s4": "/images/himansh.jpg",
    }
    for sid, img in station_map.items():
        cursor.execute("UPDATE stations SET image_url = ? WHERE id = ?", (img, sid))
        print(f"Updated station {sid} to {img}")

    # For activities, we will just round-robin or randomly assign them to make them look authentic, 
    # based on their region.
    activities = cursor.execute("SELECT id, region FROM activities").fetchall()
    for aid, region in activities:
        img = "/images/polar_vessel.jpg"
        if region == "Antarctica":
            img = "/images/bharati.jpg"
        elif region == "Arctic":
            img = "/images/arctic.jpg"
        elif region == "Himalaya":
            img = "/images/himansh.jpg"
        elif region == "Southern Ocean":
            img = "/images/polar_vessel.jpg"
        cursor.execute("UPDATE activities SET image_url = ? WHERE id = ?", (img, aid))
        print(f"Updated activity {aid} to {img}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_images()
