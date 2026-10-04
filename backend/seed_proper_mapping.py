import sqlite3

DB_PATH = "polaris.db"

ANTARCTICA_IMGS = [
    "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
]

ARCTIC_IMGS = [
    "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80",
    "/images/arctic.jpg"
]

HIMALAYA_IMGS = [
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80"
]

SOUTHERN_OCEAN_IMGS = [
    "/images/ctd_rosette.jpg",
    "/images/vessel.jpg"
]

def get_img_for_region(region, title, index):
    region = region.lower() if region else ""
    title = title.lower() if title else ""
    
    if "arctic" in region or "svalbard" in title or "himadri" in title:
        return ARCTIC_IMGS[index % len(ARCTIC_IMGS)]
    elif "himalaya" in region or "himansh" in title or "chandra" in title:
        return HIMALAYA_IMGS[index % len(HIMALAYA_IMGS)]
    elif "ocean" in region or "ctd" in title or "vessel" in title or "cruise" in title:
        return SOUTHERN_OCEAN_IMGS[index % len(SOUTHERN_OCEAN_IMGS)]
    else:
        return ANTARCTICA_IMGS[index % len(ANTARCTICA_IMGS)]

def fix_proper_mapping():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Update Expeditions
    cursor.execute("SELECT id, region, name FROM expeditions")
    for i, row in enumerate(cursor.fetchall()):
        uid, region, name = row
        img = get_img_for_region(region, name, i)
        cursor.execute("UPDATE expeditions SET hero_image = ? WHERE id = ?", (img, uid))

    # 2. Update Activities
    cursor.execute("SELECT id, region, title FROM activities")
    for i, row in enumerate(cursor.fetchall()):
        uid, region, title = row
        img = get_img_for_region(region, title, i)
        cursor.execute("UPDATE activities SET image_url = ? WHERE id = ?", (img, uid))

    # 3. Update Media Assets properly (restore the ones that should be there)
    # Actually, we seeded 8 specific media assets. Let's make sure they are correct.
    cursor.execute("SELECT id, title, region FROM media_assets")
    for row in cursor.fetchall():
        uid, title, region = row
        img = get_img_for_region(region, title, hash(uid))
        
        # Override specifically to ensure exact mapping for seeded items
        if "penguin" in title.lower():
            img = ANTARCTICA_IMGS[0]
        elif "vessel" in title.lower():
            img = SOUTHERN_OCEAN_IMGS[1]
        elif "glacial" in title.lower() and "svalbard" in title.lower():
            img = ARCTIC_IMGS[1]
        elif "aurora" in title.lower():
            img = ANTARCTICA_IMGS[1]
        elif "himansh" in title.lower():
            img = HIMALAYA_IMGS[0]
        elif "ctd" in title.lower():
            img = SOUTHERN_OCEAN_IMGS[0]
        elif "ice core" in title.lower():
            img = "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1600&q=80" # replaced broken ice core with aurora for now to be safe
        elif "svalbard" in title.lower():
            img = ARCTIC_IMGS[0]

        cursor.execute("UPDATE media_assets SET thumbnail_url = ?, media_url = ? WHERE id = ?", (img, img, uid))

    conn.commit()
    conn.close()
    print("Properly mapped images to regions.")

if __name__ == "__main__":
    fix_proper_mapping()
