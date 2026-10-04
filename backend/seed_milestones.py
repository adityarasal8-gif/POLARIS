import sqlite3
import json
import uuid
import os

DB_PATH = "polaris.db"

def seed_milestones():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    milestones_expeditions = [
        {
            "id": str(uuid.uuid4()),
            "code": "EXP-01",
            "name": "First Indian Antarctic Expedition (Operation Gangotri)",
            "region": "Antarctica",
            "dates": "1981-12-06 to 1982-02-21",
            "year": 1981,
            "status": "Completed",
            "leader_name": "Dr. Syed Zahoor Qasim",
            "leader_title": "Expedition Leader & Secretary, DOD",
            "vessel": "MV Polar Circle",
            "summary": "India's first scientific mission to the frozen continent, establishing the country's footprint in Antarctic research.",
            "mission_overview": "Led by Dr. S.Z. Qasim, a 21-member team set sail from Goa. They successfully landed on the Prince Astrid Coast, broke the ice barrier, and collected valuable oceanographic, geological, and biological data, officially placing India into the Antarctic Treaty System.",
            "objectives": json.dumps(["Establish Indian presence in Antarctica", "Initiate oceanographic and meteorological studies", "Assess logistics for future permanent bases"]),
            "research_themes": json.dumps(["Oceanography", "Meteorology", "Geology"]),
            "field_locations": json.dumps(["Princess Astrid Coast", "Dakshin Gangotri Ice Shelf"]),
            "researchers": json.dumps(["Dr. S.Z. Qasim", "Dr. H.N. Siddiquie", "Dr. Amitava Sengupta"]),
            "hero_image": "/images/op_gangotri.jpg",
            "hero_image_credit": "NCPOR Archive",
            "milestones": json.dumps([
                {"date": "1981-12-06", "description": "MV Polar Circle departs from Marmagao, Goa."},
                {"date": "1982-01-09", "description": "Team successfully lands on the Antarctic ice shelf."},
                {"date": "1982-02-21", "description": "Expedition concludes and returns to India."}
            ]),
            "source_urls": json.dumps([
                {"title": "NCPOR Historical Expeditions", "url": "https://ncpor.res.in/"},
                {"title": "First Indian Antarctic Expedition Wikipedia", "url": "https://en.wikipedia.org/wiki/First_Indian_Antarctic_Expedition"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "DG-01",
            "name": "Third Indian Antarctic Expedition (Dakshin Gangotri)",
            "region": "Antarctica",
            "dates": "1983-12-03 to 1984-03-29",
            "year": 1983,
            "status": "Completed",
            "leader_name": "Dr. Harsh K. Gupta",
            "leader_title": "Expedition Leader",
            "vessel": "Finnpolaris",
            "summary": "Established Dakshin Gangotri, India's first permanent scientific research base station in Antarctica.",
            "mission_overview": "This historic expedition successfully constructed India's first permanent station, Dakshin Gangotri, in a record time of eight weeks on the ice shelf. The first wintering team of 12 members was left behind to conduct continuous scientific observations.",
            "objectives": json.dumps(["Construct a permanent winter-over station", "Initiate year-round geophysical and biological monitoring"]),
            "research_themes": json.dumps(["Geophysics", "Glaciology", "Meteorology"]),
            "field_locations": json.dumps(["Dakshin Gangotri Ice Shelf"]),
            "researchers": json.dumps(["Dr. Harsh K. Gupta", "Dr. S.S. Sharma"]),
            "hero_image": "/images/dakshin.jpg",
            "hero_image_credit": "MoES",
            "milestones": json.dumps([
                {"date": "1983-12-27", "description": "Arrival at the Antarctic ice shelf."},
                {"date": "1984-02-24", "description": "Dakshin Gangotri station officially commissioned."},
                {"date": "1984-03-01", "description": "First Indian winter-over team begins their isolation."}
            ]),
            "source_urls": json.dumps([
                {"title": "Dakshin Gangotri Station Wikipedia", "url": "https://en.wikipedia.org/wiki/Dakshin_Gangotri"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "EXP-08",
            "name": "Eighth Indian Antarctic Expedition (Maitri)",
            "region": "Antarctica",
            "dates": "1988-11-29 to 1989-03-26",
            "year": 1988,
            "status": "Completed",
            "leader_name": "Dr. Amitabh Sengupta",
            "leader_title": "Chief Scientist",
            "vessel": "Thuleland",
            "summary": "Commissioned India's second permanent research station, Maitri, situated on the ice-free rocky terrain of Schirmacher Oasis.",
            "mission_overview": "To overcome the sinking of Dakshin Gangotri into the ice shelf, India constructed Maitri on solid bedrock. The expedition successfully built the station infrastructure and laid the groundwork for long-term earth and atmospheric sciences.",
            "objectives": json.dumps(["Commission Maitri Research Station", "Establish terrestrial biological labs"]),
            "research_themes": json.dumps(["Earth Sciences", "Atmospheric Sciences"]),
            "field_locations": json.dumps(["Schirmacher Oasis"]),
            "researchers": json.dumps(["Dr. Amitabh Sengupta", "Indian Army Corps of Engineers"]),
            "hero_image": "/images/maitri.jpg",
            "hero_image_credit": "MoES",
            "milestones": json.dumps([
                {"date": "1989-01-15", "description": "Maitri Station main building construction completed."},
                {"date": "1989-03-26", "description": "Maitri officially commissioned as India's premier inland base."}
            ]),
            "source_urls": json.dumps([
                {"title": "Maitri Station Overview", "url": "https://ncpor.res.in/"},
                {"title": "Maitri Wikipedia", "url": "https://en.wikipedia.org/wiki/Maitri_(research_station)"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "SO-01",
            "name": "First Indian Southern Ocean Expedition",
            "region": "Southern Ocean",
            "dates": "2004-01-23 to 2004-03-31",
            "year": 2004,
            "status": "Completed",
            "leader_name": "Dr. N. Ananthakrishnan",
            "leader_title": "Chief Scientist",
            "vessel": "ORV Sagar Kanya",
            "summary": "India's inaugural multidisciplinary oceanographic expedition to the Southern Ocean to study biogeochemical fluxes.",
            "mission_overview": "Conducted extensive CTD profiling and water sampling across the Agulhas Return Current and Antarctic Circumpolar Current to understand physical and biogeochemical dynamics driving global thermohaline circulation.",
            "objectives": json.dumps(["Study air-sea interactions", "Map Southern Ocean biogeochemistry", "Analyze phytoplankton dynamics"]),
            "research_themes": json.dumps(["Oceanography", "Marine Biology", "Climate Science"]),
            "field_locations": json.dumps(["Southern Ocean", "Prydz Bay", "Agulhas Return Current"]),
            "researchers": json.dumps(["Dr. N. Ananthakrishnan", "NCPOR Marine Scientists"]),
            "hero_image": "/images/polar_vessel.jpg",
            "hero_image_credit": "NCPOR",
            "milestones": json.dumps([
                {"date": "2004-01-23", "description": "ORV Sagar Kanya departs from Port Louis, Mauritius."},
                {"date": "2004-02-15", "description": "Deployment of drifter buoys and XBT probes across the Subtropical Front."},
                {"date": "2004-03-31", "description": "Completion of oceanographic transects and return to port."}
            ]),
            "source_urls": json.dumps([
                {"title": "Southern Ocean Program (NCPOR)", "url": "https://ncpor.res.in/"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "ARC-01",
            "name": "First Indian Arctic Expedition & Himadri Inauguration",
            "region": "Arctic",
            "dates": "2008-06-15 to 2008-08-10",
            "year": 2008,
            "status": "Completed",
            "leader_name": "Dr. Rasik Ravindra",
            "leader_title": "Director, NCPOR",
            "vessel": "Flight / Field Camp",
            "summary": "Inaugurated Himadri, India's first permanent Arctic research station located at Ny-Ålesund, Svalbard.",
            "mission_overview": "Expanded India's polar presence to the northern hemisphere by inaugurating the Himadri station in the international research village of Ny-Ålesund. The team initiated long-term monitoring of Arctic glaciers and fjord ecosystems.",
            "objectives": json.dumps(["Inaugurate Himadri Station", "Initiate Arctic fjord ecosystem studies", "Monitor Svalbard glaciers"]),
            "research_themes": json.dumps(["Arctic Climate", "Marine Ecosystems", "Glaciology"]),
            "field_locations": json.dumps(["Ny-Ålesund", "Kongsfjorden", "Svalbard"]),
            "researchers": json.dumps(["Dr. Rasik Ravindra", "Dr. S. Rajan"]),
            "hero_image": "/images/arctic.jpg",
            "hero_image_credit": "NCPOR",
            "milestones": json.dumps([
                {"date": "2008-07-01", "description": "Himadri Station officially inaugurated at Ny-Ålesund."},
                {"date": "2008-07-15", "description": "First marine sampling conducted in Kongsfjorden."}
            ]),
            "source_urls": json.dumps([
                {"title": "Arctic Program (NCPOR)", "url": "https://ncpor.res.in/"},
                {"title": "Himadri Station Wikipedia", "url": "https://en.wikipedia.org/wiki/Himadri_(research_station)"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "EXP-31",
            "name": "31st Indian Scientific Expedition to Antarctica (Bharati)",
            "region": "Antarctica",
            "dates": "2011-10-26 to 2012-04-10",
            "year": 2012,
            "status": "Completed",
            "leader_name": "Dr. Rajesh Asthana",
            "leader_title": "Expedition Leader",
            "vessel": "Ivan Papanin",
            "summary": "Commissioned India's third Antarctic research facility, Bharati, in the Larsemann Hills.",
            "mission_overview": "Focused primarily on the structural assembly and commissioning of Bharati station. The state-of-the-art facility was built using prefabricated shipping containers to minimize environmental footprint and support advanced oceanographic and geological research.",
            "objectives": json.dumps(["Commission Bharati Station", "Establish satellite ground station for ISRO", "Conduct coastal oceanography"]),
            "research_themes": json.dumps(["Geology", "Oceanography", "Space Science"]),
            "field_locations": json.dumps(["Larsemann Hills", "Prydz Bay"]),
            "researchers": json.dumps(["Dr. Rajesh Asthana", "ISRO Engineers"]),
            "hero_image": "/images/bharati.jpg",
            "hero_image_credit": "NCPOR",
            "milestones": json.dumps([
                {"date": "2012-03-18", "description": "Bharati Station officially inaugurated."},
                {"date": "2012-03-25", "description": "ISRO ground station antenna successfully activated."}
            ]),
            "source_urls": json.dumps([
                {"title": "Bharati Station Wikipedia", "url": "https://en.wikipedia.org/wiki/Bharati_(research_station)"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "HIM-01",
            "name": "Establishment of Himansh High-Altitude Station",
            "region": "Himalaya",
            "dates": "2016-08-01 to 2016-10-15",
            "year": 2016,
            "status": "Completed",
            "leader_name": "Dr. Thamban Meloth",
            "leader_title": "Project Director",
            "vessel": "Field Logistics",
            "summary": "Established 'Himansh', India's highest glaciological research station at 4,080m in Spiti, Himachal Pradesh.",
            "mission_overview": "To study the dynamics of Himalayan glaciers and their impact on river basins, NCPOR established Himansh in the remote Chandra basin. The station is equipped with automatic weather stations, water level recorders, and ground-penetrating radar.",
            "objectives": json.dumps(["Establish high-altitude glaciological lab", "Monitor mass balance of Chandra basin glaciers"]),
            "research_themes": json.dumps(["Glaciology", "Hydrology", "Climate Change"]),
            "field_locations": json.dumps(["Spiti Valley", "Chandra Basin", "Sutri Dhaka Glacier"]),
            "researchers": json.dumps(["Dr. Thamban Meloth", "Dr. Bhanu Pratap"]),
            "hero_image": "/images/himansh.jpg",
            "hero_image_credit": "MoES",
            "milestones": json.dumps([
                {"date": "2016-10-09", "description": "Himansh station officially inaugurated by MoES officials."}
            ]),
            "source_urls": json.dumps([
                {"title": "Himansh Station Overview", "url": "https://ncpor.res.in/"},
                {"title": "Himansh Wikipedia", "url": "https://en.wikipedia.org/wiki/Himansh"}
            ])
        },
        {
            "id": str(uuid.uuid4()),
            "code": "EXP-45",
            "name": "45th Indian Scientific Expedition to Antarctica",
            "region": "Antarctica",
            "dates": "2024-11-15 to 2025-04-30",
            "year": 2025,
            "status": "Active",
            "leader_name": "Dr. Shailendra Saini",
            "leader_title": "Chief Scientist",
            "vessel": "MV Vasiliy Golovnin",
            "summary": "Active flagship deployment to Antarctica focusing on paleo-climate ice core drilling and deep-sea mooring recoveries.",
            "mission_overview": "The 45th ISEA continues India's legacy with a heavy focus on recovering ice cores from the central Antarctic plateau and conducting comprehensive surveys of the Southern Ocean. It also supports the modernization of Maitri station.",
            "objectives": json.dumps(["Paleoclimate reconstruction via ice cores", "Southern Ocean mooring recovery", "Maitri station modernization"]),
            "research_themes": json.dumps(["Paleoclimatology", "Ocean Dynamics", "Engineering"]),
            "field_locations": json.dumps(["Maitri", "Bharati", "Prydz Bay"]),
            "researchers": json.dumps(["Dr. Shailendra Saini", "Over 45 multidisciplinary scientists"]),
            "hero_image": "/images/polar_vessel.jpg",
            "hero_image_credit": "NCPOR",
            "milestones": json.dumps([
                {"date": "2024-11-15", "description": "Expedition departs from Cape Town, South Africa."},
                {"date": "2024-12-20", "description": "Successful ice core drilling commences at 100m depth."}
            ]),
            "source_urls": json.dumps([
                {"title": "MoES Live Updates", "url": "https://moes.gov.in/"}
            ])
        }
    ]

    for ex in milestones_expeditions:
        # Check if already exists to avoid duplicates
        existing = cursor.execute("SELECT id FROM expeditions WHERE code = ?", (ex["code"],)).fetchone()
        if not existing:
            cursor.execute("""
                INSERT INTO expeditions (id, code, name, region, dates, year, status, leader_name, leader_title, vessel, summary, mission_overview, objectives, research_themes, field_locations, researchers, hero_image, hero_image_credit, milestones, source_urls, connected_datasets, connected_publications, connected_media)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]')
            """, (
                ex["id"], ex["code"], ex["name"], ex["region"], ex["dates"], ex["year"], ex["status"], ex["leader_name"], ex["leader_title"], ex.get("vessel"), ex["summary"], ex["mission_overview"], ex["objectives"], ex["research_themes"], ex["field_locations"], ex["researchers"], ex["hero_image"], ex["hero_image_credit"], ex["milestones"], ex["source_urls"]
            ))
            print(f"Inserted milestone expedition: {ex['code']}")
        else:
            print(f"Skipped {ex['code']} (already exists)")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_milestones()
