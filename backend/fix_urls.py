import sqlite3
import json
import os

DB_PATH = "polaris.db"

def fix_urls():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Update source_urls in expeditions
    expeditions = cursor.execute("SELECT id, source_urls FROM expeditions").fetchall()
    for exp_id, source_urls_str in expeditions:
        if source_urls_str:
            urls = json.loads(source_urls_str)
            updated = False
            for u in urls:
                if "ncpor.res.in/southernocean" in u["url"]:
                    u["url"] = "https://ncpor.res.in/"
                    updated = True
                elif "ncpor.res.in/antarctica" in u["url"]:
                    u["url"] = "https://ncpor.res.in/"
                    updated = True
                elif "ncpor.res.in/arctic" in u["url"]:
                    u["url"] = "https://ncpor.res.in/"
                    updated = True
                
            if updated:
                cursor.execute("UPDATE expeditions SET source_urls = ? WHERE id = ?", (json.dumps(urls), exp_id))
                print(f"Fixed URLs for expedition {exp_id}")

    # Update URLs in activities
    activities = cursor.execute("SELECT id, url FROM activities").fetchall()
    for act_id, url in activities:
        if url:
            if "ncpor.res.in/southernocean" in url:
                cursor.execute("UPDATE activities SET url = ? WHERE id = ?", ("https://ncpor.res.in/", act_id))
                print(f"Fixed URL for activity {act_id}")
            elif "ncpor.res.in/antarctica" in url:
                cursor.execute("UPDATE activities SET url = ? WHERE id = ?", ("https://ncpor.res.in/", act_id))
                print(f"Fixed URL for activity {act_id}")
            elif "ncpor.res.in/arctic" in url:
                cursor.execute("UPDATE activities SET url = ? WHERE id = ?", ("https://ncpor.res.in/", act_id))
                print(f"Fixed URL for activity {act_id}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_urls()
