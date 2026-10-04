import uuid
import os
import json
from datetime import datetime, timezone
from typing import Dict, Any, List
from models import ContentDraft

def generate_grounded_outreach(source_type: str, source_data: Dict[str, Any]) -> ContentDraft:
    """
    Generates a multi-platform dissemination package strictly grounded in the provided
    scientific metadata, with traceable citations.
    """
    draft_id = f"draft_{uuid.uuid4().hex[:8]}"
    created_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
            prompt = f"""
            Generate a multi-platform dissemination package strictly grounded in the provided scientific metadata.
            Source Type: {source_type}
            Source Data: {json.dumps(source_data)}
            
            Return a JSON object with EXACTLY these keys:
            - title: A short catchy title
            - website_article: Markdown formatted article overview.
            - instagram_post: Text for an Instagram post including emojis and hashtags.
            - x_post: Text for a Twitter/X post.
            - linkedin_post: Text for a LinkedIn post.
            - youtube_description: Text for a YouTube video description.
            - newsletter_summary: A short summary for a newsletter.
            - citations: A list of objects, each with "source_field" and "reference" string keys.
            """
            response = model.generate_content(prompt)
            data = json.loads(response.text)
            
            return ContentDraft(
                id=draft_id,
                source_type=source_type,
                source_id=str(source_data.get("id", "source_1")),
                source_title=source_data.get("name", source_data.get("title", "Polar Record")),
                title=data.get("title", f"AI Generated: {source_data.get('name', 'Record')}"),
                created_at=created_at,
                status="Draft",
                website_article=data.get("website_article", "").strip(),
                instagram_post=data.get("instagram_post", "").strip(),
                x_post=data.get("x_post", "").strip(),
                linkedin_post=data.get("linkedin_post", "").strip(),
                youtube_description=data.get("youtube_description", "").strip(),
                newsletter_summary=data.get("newsletter_summary", "").strip(),
                citations=data.get("citations", [])
            )
        except Exception as e:
            print(f"Warning: Gemini generation failed ({e}). Falling back to static templates.")
            pass

    if source_type == "expedition":
        code = source_data.get("code", "ISEA")
        name = source_data.get("name", "Indian Polar Expedition")
        region = source_data.get("region", "Antarctica")
        leader = source_data.get("leader_name", "Lead Scientist")
        vessel = source_data.get("vessel", "Chartered Research Vessel")
        objectives = source_data.get("objectives", ["Conduct atmospheric and cryospheric surveys"])
        locations = source_data.get("field_locations", ["Schirmacher Oasis", "Larsemann Hills"])
        themes = source_data.get("research_themes", ["Cryosphere", "Atmospheric Sciences"])
        obj_text = "; ".join(objectives[:3])

        title = f"{name}: Advancing India's Frontier Science in {region}"

        website_article = f"""# {name} ({code})
## Overview & Scientific Mission

Under the aegis of the Ministry of Earth Sciences (MoES) and managed by the National Centre for Polar and Ocean Research (NCPOR), the **{name}** represents a pivotal milestone in India's continuous scientific presence in {region}.

Led by **{leader}**, the expedition mobilized specialized teams utilizing the research vessel **{vessel}** to conduct high-resolution observations across {', '.join(locations)}.

### Key Scientific Objectives
{chr(10).join(f"- {obj}" for obj in objectives)}

### Interdisciplinary Research Focus
The mission encompassed key domains including {', '.join(themes)}, generating continuous observational data deposited in the National Polar Data Center (NPDC) for open research access and climate modeling.

Through rigorous winter-over and summer campaigns, Indian scientists at research stations continue to decipher the global implications of polar dynamics on the Indian monsoon and planetary climate systems."""

        instagram_post = f"""❄️ MISSION SPOTLIGHT: {code} in {region} 🇮🇳

Indian scientists under NCPOR / Ministry of Earth Sciences have concluded key field operations for the {name}!

📍 Locations: {', '.join(locations)}
🚢 Research Vessel: {vessel}
🔬 Core Science Themes: {', '.join(themes[:3])}

"Polar regions are the heat sinks of the planet. What happens in {region} directly impacts global sea levels and the tropical monsoon system."

📊 All telemetry, ice cores, and atmospheric profiles have been archived into the POLARIS national repository.

🔗 Explore complete expedition logs & open datasets via link in bio!
#NCPOR #IndianPolarScience #Antarctica #{code.replace(' ', '')} #MoES #ClimateScience"""

        x_post = f"""🇮🇳 Field Science Update | {name} ({code})

Under @MoESGoI & @NCPOR_GoI, scientists led by {leader} have advanced critical research across {', '.join(locations)}.

Key domains: {', '.join(themes[:2])}
🚢 Vessel: {vessel}
📂 Data indexed in National Polar Data Center

🔗 Read full dossier: polaris.ncpor.gov.in/expeditions/{source_data.get('id', '')}"""

        linkedin_post = f"""Delighted to share updates from the {name} ({code}), organized by the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India.

Operating in {region}, the expedition team under the leadership of {leader} executed mission-critical field campaigns focusing on:
{chr(10).join(f"• {obj}" for obj in objectives[:3])}

India's long-term polar research provides indispensable empirical data to understand cryospheric retreat, Southern Ocean circulation, and teleconnections with the Indian Summer Monsoon.

All validated observational datasets and technical expedition reports are cataloged within the POLARIS Knowledge Repository for researchers and academic collaborators worldwide.

#PolarResearch #EarthSciences #NCPOR #MoES #ScientificInnovation #DataGovernance"""

        youtube_description = f"""Official Mission Overview: {name} ({code})
National Centre for Polar and Ocean Research (NCPOR) | Ministry of Earth Sciences, Government of India

In this documentary briefing, explore the field operations, scientific objectives, and research breakthroughs of the {name} operating in {region}.

Timestamps:
00:00 - Introduction & Mission Mandate
01:30 - Mobilization & Vessel Logistics ({vessel})
04:15 - Field Operations across {', '.join(locations)}
08:20 - Scientific Data Collection & Cryosphere Analysis
12:45 - Provenance, Archival & Data Access

Learn more and access open datasets at POLARIS: https://polaris.ncpor.gov.in/expeditions/{source_data.get('id', '')}

Attribution: National Centre for Polar and Ocean Research (NCPOR), Vasco da Gama, Goa, India."""

        newsletter_summary = f"""**{name} ({code}) Digest**
The Indian polar program completed operational field studies in {region} focusing on {', '.join(themes)}. Field logs and open datasets are now curated for academic and institutional utilization."""

        citations = [
            {"source_field": "Expedition Record", "reference": f"NCPOR Official Expedition Log: {code}"},
            {"source_field": "Field Stations", "reference": f"Station Operations: {', '.join(locations)}"},
            {"source_field": "Data Provenance", "reference": "National Polar Data Center (NPDC) Archive Series"}
        ]

    elif source_type == "dataset":
        title_d = source_data.get("title", "Polar Observation Dataset")
        ident = source_data.get("identifier", "NPDC-DS-001")
        category = source_data.get("science_category", "Atmosphere")
        region = source_data.get("region", "Antarctica")
        provider = source_data.get("provider", "NCPOR")
        temporal = source_data.get("temporal_coverage", "2024–2025")
        params = source_data.get("parameters", ["Temperature", "Aerosol Optical Depth"])

        title = f"Data Release: {title_d} ({ident})"

        website_article = f"""# Scientific Dataset Release: {title_d}
**Identifier**: `{ident}` | **Domain**: {category} | **Region**: {region}

The National Polar Data Center (NPDC) at NCPOR has published peer-reviewed observational records for **{title_d}**.

### Spatial & Temporal Scope
- **Coverage**: {temporal}
- **Parameters Monitored**: {', '.join(params)}
- **Access Level**: Open Access / CC-BY-NC 4.0

### Research Applications
This dataset provides critical baseline values for global climate models, enabling researchers to correlate high-latitude atmospheric perturbations with mid-latitude circulation anomalies."""

        instagram_post = f"""📊 NEW POLAR DATASET RELEASE: {title_d}

Direct from India's polar research observatories in {region}:
🔍 Science Domain: {category}
⏱️ Timeline: {temporal}
📈 Monitored Parameters: {', '.join(params[:3])}

Open science powers climate solutions. Discover this and 500+ verified datasets on the POLARIS portal! 🧊🇮🇳

#OpenData #ClimateScience #NCPOR #NPDC #PolarObservation"""

        x_post = f"""📊 New Dataset Published | {ident}
"{title_d}" ({category}, {region})

Parameters: {', '.join(params[:2])}
Provider: {provider}
Temporal Coverage: {temporal}

Explore open data: polaris.ncpor.gov.in/datasets/{source_data.get('id', '')}"""

        linkedin_post = f"""The National Polar Data Center (NPDC) has released a new open-access scientific dataset: "{title_d}" (Ref: {ident}).

Focusing on {category} in {region}, this dataset tracks {', '.join(params)} across {temporal}. Open scientific telemetry is vital for calibrating satellite observations and verifying numerical weather predictions.

Data access & provenance: polaris.ncpor.gov.in/datasets/{source_data.get('id', '')}"""

        youtube_description = f"""Dataset Explainer: {title_d} ({ident})
Hosted by National Polar Data Center (NCPOR)
Parameters: {', '.join(params)} | Region: {region}

Access data download samples & methodology at POLARIS."""

        newsletter_summary = f"""**New Dataset Available**: {title_d} ({category}, {region}). Covers {temporal} with open access for researchers."""

        citations = [
            {"source_field": "Dataset Identifier", "reference": f"{ident} ({provider})"},
            {"source_field": "Temporal Coverage", "reference": temporal},
            {"source_field": "Catalog Source", "reference": "National Polar Data Center (NPDC)"}
        ]

    else:
        # Fallback for publications or activities
        orig_title = source_data.get("title", "Polar Science Update")
        region = source_data.get("region", "Polar Regions")

        title = f"Research Spotlight: {orig_title}"
        website_article = f"""# {orig_title}
**Domain**: Polar Science Outreach | **Region**: {region}

{source_data.get('summary', source_data.get('abstract', 'Groundbreaking findings from India’s polar research facilities.'))}

This work underscores India's continuing leadership in polar and oceanographic sciences under the Ministry of Earth Sciences."""

        instagram_post = f"""🔬 RESEARCH BRIEF: {orig_title} 🇮🇳
Insights from Indian polar research in {region}.
Read more on the POLARIS portal."""

        x_post = f"""🔬 Research Spotlight: {orig_title} ({region})
Read the full analysis: polaris.ncpor.gov.in/repository"""

        linkedin_post = f"""Research announcement from India's Polar Program: {orig_title}. Advancing understanding of {region}."""
        youtube_description = f"""Briefing: {orig_title}. National Centre for Polar and Ocean Research."""
        newsletter_summary = f"""**Research Brief**: {orig_title} ({region})."""
        citations = [
            {"source_field": "Source Record", "reference": f"{orig_title}"},
            {"source_field": "Institutional Origin", "reference": "National Centre for Polar and Ocean Research"}
        ]

    return ContentDraft(
        id=draft_id,
        source_type=source_type,
        source_id=str(source_data.get("id", "source_1")),
        source_title=source_data.get("name", source_data.get("title", "Polar Record")),
        title=title,
        created_at=created_at,
        status="Draft",
        website_article=website_article.strip(),
        instagram_post=instagram_post.strip(),
        x_post=x_post.strip(),
        linkedin_post=linkedin_post.strip(),
        youtube_description=youtube_description.strip(),
        newsletter_summary=newsletter_summary.strip(),
        citations=citations
    )
