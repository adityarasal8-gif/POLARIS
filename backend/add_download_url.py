import sqlite3
import os

DB_PATH = "polaris.db"

def update_db():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    datasets = cursor.execute("SELECT id FROM datasets").fetchall()
    
    for ds in datasets:
        ds_id = ds[0]
        # Use our local API for the complete dataset download to ensure it works (doesn't 404)
        full_dataset_link = f"http://127.0.0.1:8000/api/datasets/{ds_id}/export?format=csv"
        # Keep NPDC as the authentic source
        source_link = "https://npdc.ncpor.res.in/data/search"
        
        cursor.execute("UPDATE datasets SET source_url = ?, download_url = ? WHERE id = ?", 
                       (source_link, full_dataset_link, ds_id))
        
    conn.commit()
    conn.close()
    print("Updated datasets with working local download URLs.")

if __name__ == "__main__":
    update_db()
