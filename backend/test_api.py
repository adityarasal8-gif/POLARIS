from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert data["entities"]["stations"] >= 4
    assert data["entities"]["expeditions"] >= 1
    assert data["uptime_seconds"] >= 0

def test_get_stats():
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["stations"] == 4
    assert data["expeditions"] > 0
    assert data["datasets"] > 0
    assert data["publications"] > 0

def test_list_stations():
    response = client.get("/api/stations")
    assert response.status_code == 200
    stations = response.json()
    assert len(stations) == 4
    station_ids = [s["id"] for s in stations]
    assert "maitri" in station_ids
    assert "bharati" in station_ids
    assert "himadri" in station_ids
    assert "himansh" in station_ids

def test_get_station_detail():
    response = client.get("/api/stations/maitri")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "maitri"
    assert data["region"] == "Antarctica"
    assert len(data["research_themes"]) > 0

def test_get_station_not_found():
    response = client.get("/api/stations/non_existent_station")
    assert response.status_code == 404

def test_live_observatory():
    response = client.get("/api/observatory/live")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    for item in data:
        assert "temperature_c" in item
        assert "wind_speed_kmh" in item
        assert "surface_pressure_hpa" in item
        assert item["status"] in ["live", "cached", "fallback"]

def test_station_telemetry_history():
    response = client.get("/api/observatory/history/maitri")
    assert response.status_code == 200
    data = response.json()
    assert data["station_id"] == "maitri"
    assert len(data["readings"]) == 24
    assert "summary" in data
    assert "min_temperature_c" in data["summary"]
    assert len(data["sensors"]) >= 4
    assert "operational" in data
    assert "uplink_carrier" in data["operational"]

def test_station_telemetry_export_csv():
    response = client.get("/api/observatory/export/maitri")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    csv_text = response.text
    assert "# NATIONAL POLAR DATA CENTER" in csv_text
    assert "Timestamp_UTC,Hour_Label,Temperature_C" in csv_text
    assert len(csv_text.splitlines()) >= 25

def test_list_expeditions_and_filters():
    response = client.get("/api/expeditions")
    assert response.status_code == 200
    exps = response.json()
    assert len(exps) > 0

    # Filter by region
    res_antarctica = client.get("/api/expeditions?region=Antarctica")
    assert res_antarctica.status_code == 200
    for e in res_antarctica.json():
        assert e["region"] == "Antarctica"

def test_expedition_overview_stats():
    response = client.get("/api/expeditions/stats/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_expeditions"] > 0
    assert "Antarctica" in data["by_region"]

def test_expedition_detail():
    exps = client.get("/api/expeditions").json()
    exp_id = exps[0]["id"]
    response = client.get(f"/api/expeditions/{exp_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == exp_id
    assert "datasets_detail" in data
    assert "publications_detail" in data
    assert "media_detail" in data

def test_list_datasets_and_detail():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    datasets = response.json()
    assert len(datasets) > 0

    ds_id = datasets[0]["id"]
    detail = client.get(f"/api/datasets/{ds_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == ds_id

def test_dataset_sample_export():
    datasets = client.get("/api/datasets").json()
    ds_id = datasets[0]["id"]

    # JSON export
    res_json = client.get(f"/api/datasets/{ds_id}/export?format=json")
    assert res_json.status_code == 200
    assert "records" in res_json.json()

    # CSV export
    res_csv = client.get(f"/api/datasets/{ds_id}/export?format=csv")
    assert res_csv.status_code == 200

def test_publications():
    response = client.get("/api/publications")
    assert response.status_code == 200
    pubs = response.json()
    assert len(pubs) > 0

    pub_id = pubs[0]["id"]
    detail = client.get(f"/api/publications/{pub_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == pub_id

def test_media_assets():
    response = client.get("/api/media")
    assert response.status_code == 200
    media = response.json()
    assert len(media) > 0

    med_id = media[0]["id"]
    detail = client.get(f"/api/media/{med_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == med_id

def test_activities():
    response = client.get("/api/activities")
    assert response.status_code == 200
    acts = response.json()
    assert len(acts) > 0

def test_researchers_and_topics():
    res_res = client.get("/api/researchers")
    assert res_res.status_code == 200
    assert len(res_res.json()) > 0

    res_top = client.get("/api/topics")
    assert res_top.status_code == 200
    assert len(res_top.json()) > 0

def test_unified_search():
    response = client.get("/api/search?q=Maitri")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Maitri"
    assert data["total_results"] > 0
    assert len(data["results_by_type"]["stations"]) > 0

def test_content_draft_lifecycle():
    exps = client.get("/api/expeditions").json()
    exp_id = exps[0]["id"]

    # 1. Generate Draft
    gen_payload = {
        "source_type": "expedition",
        "source_id": exp_id,
        "tone": "Scientific Outreach",
        "target_audience": "Students"
    }
    gen_res = client.post("/api/content/generate", json=gen_payload)
    assert gen_res.status_code == 200
    draft = gen_res.json()
    draft_id = draft["id"]
    assert draft["status"] == "Draft"
    assert len(draft["website_article"]) > 50

    # 2. Get Single Draft
    single_res = client.get(f"/api/content/drafts/{draft_id}")
    assert single_res.status_code == 200
    assert single_res.json()["id"] == draft_id

    # 3. Update Draft
    update_payload = {
        "title": "Updated Title for Verification",
        "status": "Review",
        "reviewer": "Chief Editor"
    }
    put_res = client.put(f"/api/content/drafts/{draft_id}", json=update_payload)
    assert put_res.status_code == 200
    assert put_res.json()["title"] == "Updated Title for Verification"
    assert put_res.json()["status"] == "Review"

    # 4. Review / Schedule Draft
    review_payload = {
        "draft_id": draft_id,
        "action": "schedule",
        "reviewer": "Senior Scientist",
        "scheduled_for": "2026-10-15 10:00 UTC"
    }
    rev_res = client.post("/api/content/review", json=review_payload)
    assert rev_res.status_code == 200
    assert rev_res.json()["status"] == "Scheduled"

    # 5. Check Calendar
    cal_res = client.get("/api/content/calendar")
    assert cal_res.status_code == 200
    cal_ids = [c["id"] for c in cal_res.json()]
    assert draft_id in cal_ids

    # 6. Delete Draft
    del_res = client.delete(f"/api/content/drafts/{draft_id}")
    assert del_res.status_code == 200

    # Verify deleted
    get_after_del = client.get(f"/api/content/drafts/{draft_id}")
    assert get_after_del.status_code == 404

def test_knowledge_graph():
    response = client.get("/api/knowledge-graph")
    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) > 0
    assert len(data["links"]) > 0

    # Test filtered knowledge graph
    res_filtered = client.get("/api/knowledge-graph?region=Antarctica")
    assert res_filtered.status_code == 200
    assert len(res_filtered.json()["nodes"]) > 0

if __name__ == "__main__":
    tests = [
        test_health_check,
        test_get_stats,
        test_list_stations,
        test_get_station_detail,
        test_get_station_not_found,
        test_live_observatory,
        test_station_telemetry_history,
        test_station_telemetry_export_csv,
        test_list_expeditions_and_filters,
        test_expedition_overview_stats,
        test_expedition_detail,
        test_list_datasets_and_detail,
        test_dataset_sample_export,
        test_publications,
        test_media_assets,
        test_activities,
        test_researchers_and_topics,
        test_unified_search,
        test_content_draft_lifecycle,
        test_knowledge_graph
    ]
    passed = 0
    failed = 0
    print(f"\n================ Running {len(tests)} API Suite Tests ================\n")
    for t in tests:
        try:
            t()
            passed += 1
            print(f" [PASS] {t.__name__}")
        except Exception as e:
            failed += 1
            print(f" [FAIL] {t.__name__}: {e}")
            import traceback
            traceback.print_exc()
    print(f"\nResult: {passed} passed, {failed} failed out of {len(tests)} tests\n")
    if failed > 0:
        exit(1)

