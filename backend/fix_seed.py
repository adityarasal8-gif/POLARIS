import re

with open("seed_data.py", "r") as f:
    content = f.read()

# Fix datasets
content = content.replace(
    'cursor.executemany("INSERT INTO datasets VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", datasets)',
    'cursor.executemany("INSERT INTO datasets (id, name, type, region, start_date, end_date, station_id, expedition_id, format, size_mb, url, access_level, status, doi, parameters, instruments, summary, pi_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", datasets)'
)

# Fix publications
# Let's find publications insert
# cursor.executemany("INSERT INTO publications VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", publications)
content = content.replace(
    'cursor.executemany("INSERT INTO publications VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", publications)',
    'cursor.executemany("INSERT INTO publications (id, title, authors, journal, year, volume_issue, doi, abstract, region, research_topic, expedition_id, station_id, citation_count, pdf_available) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", publications)'
)

# Fix media_assets
# cursor.executemany("INSERT INTO media_assets VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", media_assets)
content = content.replace(
    'cursor.executemany("INSERT INTO media_assets VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", media_assets)',
    'cursor.executemany("INSERT INTO media_assets (id, title, type, region, station_id, expedition_id, date, caption, thumbnail_url, media_url, credit, source, license, tags) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", media_assets)'
)

# Fix expeditions
# cursor.executemany("INSERT INTO expeditions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", expeditions)
content = content.replace(
    'cursor.executemany("INSERT INTO expeditions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", expeditions)',
    'cursor.executemany("INSERT INTO expeditions (id, code, name, region, dates, year, status, leader_name, leader_title, vessel, summary, mission_overview, objectives, research_themes, field_locations) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", expeditions)'
)

with open("seed_data.py", "w") as f:
    f.write(content)

print("seed_data.py fixed!")
