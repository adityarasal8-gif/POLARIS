import sqlite3
import random

DB_PATH = "polaris.db"

valid_ids = [
    "1518098268026-4e89f1a2cd8e",
    "1464822759023-fed622ff2c3b",
    "1517411032315-54ef2cb783bb"
]

def fix_images():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    base_url = "https://images.unsplash.com/photo-"

    # Update stations
    cursor.execute("SELECT id FROM stations")
    for row in cursor.fetchall():
        uid = row[0]
        img = f"{base_url}{random.choice(valid_ids)}?auto=format&fit=crop&w=800&q=80"
        cursor.execute("UPDATE stations SET image_url = ? WHERE id = ?", (img, uid))

    # Update expeditions
    cursor.execute("SELECT id FROM expeditions")
    for row in cursor.fetchall():
        uid = row[0]
        img = f"{base_url}{random.choice(valid_ids)}?auto=format&fit=crop&w=800&q=80"
        cursor.execute("UPDATE expeditions SET hero_image = ? WHERE id = ?", (img, uid))

    # Update media_assets
    cursor.execute("SELECT id FROM media_assets")
    for row in cursor.fetchall():
        uid = row[0]
        img = f"{base_url}{random.choice(valid_ids)}?auto=format&fit=crop&w=800&q=80"
        cursor.execute("UPDATE media_assets SET thumbnail_url = ?, media_url = ? WHERE id = ?", (img, img, uid))

    conn.commit()
    conn.close()
    print("All images replaced with validated Unsplash URLs.")

if __name__ == "__main__":
    fix_images()
