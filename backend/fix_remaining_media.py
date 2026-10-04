import sqlite3
import random

DB_PATH = "polaris.db"

STATION_IMGS = {
    "s1": "https://images.unsplash.com/photo-1547671131-dae90bd0d220?auto=format&fit=crop&w=1600&q=80",
    "s2": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    "s3": "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80",
    "s4": "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80"
}

EXPEDITION_IMGS = [
    "https://images.unsplash.com/photo-1549429712-4f32997e59c2?auto=format&fit=crop&w=1600&q=80", # Vessel
    "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1600&q=80", # Penguins
    "https://images.unsplash.com/photo-1506456018318-63eb5d7cd75b?auto=format&fit=crop&w=1600&q=80", # Glacier
    "https://images.unsplash.com/photo-1628185521287-248cd906e537?auto=format&fit=crop&w=1600&q=80", # Ice core
    "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1600&q=80", # Aurora
    "https://images.unsplash.com/photo-1582967277609-8b010c793ff0?auto=format&fit=crop&w=1600&q=80"  # CTD
]

def fix_all_images():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Update Stations
    for sid, url in STATION_IMGS.items():
        cursor.execute("UPDATE stations SET image_url = ? WHERE id = ?", (url, sid))

    # 2. Update Expeditions
    cursor.execute("SELECT id FROM expeditions")
    expeditions = cursor.fetchall()
    for row in expeditions:
        uid = row[0]
        img = random.choice(EXPEDITION_IMGS)
        cursor.execute("UPDATE expeditions SET hero_image = ? WHERE id = ?", (img, uid))

    # 3. Update Activities
    cursor.execute("SELECT id FROM activities")
    activities = cursor.fetchall()
    for row in activities:
        uid = row[0]
        img = random.choice(EXPEDITION_IMGS)
        cursor.execute("UPDATE activities SET image_url = ? WHERE id = ?", (img, uid))

    conn.commit()
    conn.close()
    print("Successfully updated stations, expeditions, and activities with proper images.")

if __name__ == "__main__":
    fix_all_images()
