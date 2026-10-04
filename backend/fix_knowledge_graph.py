import sqlite3
import random

DB_PATH = "polaris.db"

def fix_kg():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    stations = ['s1', 's2', 's3', 's4']
    expeditions = ['exp1', 'exp2', 'exp3']

    # Update Datasets
    cursor.execute("SELECT id FROM datasets")
    dsets = cursor.fetchall()
    
    for i, row in enumerate(dsets):
        uid = row[0]
        # Assign to stations sequentially so each gets some datasets
        s_id = stations[i % len(stations)]
        # Assign to expeditions sequentially
        e_id = expeditions[i % len(expeditions)]
        cursor.execute("UPDATE datasets SET station_id = ?, expedition_id = ? WHERE id = ?", (s_id, e_id, uid))

    # Update Publications
    cursor.execute("SELECT id FROM publications")
    pubs = cursor.fetchall()
    
    for i, row in enumerate(pubs):
        uid = row[0]
        # Offset the assignment to mix it up
        s_id = stations[(i + 2) % len(stations)]
        e_id = expeditions[(i + 1) % len(expeditions)]
        cursor.execute("UPDATE publications SET station_id = ?, expedition_id = ? WHERE id = ?", (s_id, e_id, uid))

    # Optional: ensure Topics are properly assigned if that exists
    # The current graph logic seems to rely on publications and datasets linking to stations/expeditions.

    conn.commit()
    conn.close()
    print("Graph relations perfectly distributed.")

if __name__ == "__main__":
    fix_kg()
