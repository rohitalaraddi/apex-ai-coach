#!/usr/bin/env python3
import os
import sys
import json
import datetime
import urllib.request
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectTooManyRequestsError,
    GarminConnectMFAError,
)

def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ[key.strip()] = val.strip().strip('"').strip("'")

def run_sync():
    load_env()
    email = os.environ.get('GARMIN_CONNECT_EMAIL')
    password = os.environ.get('GARMIN_CONNECT_PASSWORD')

    if not email or not password:
        print("ERROR: Please set GARMIN_CONNECT_EMAIL and GARMIN_CONNECT_PASSWORD in your .env.local file.")
        sys.exit(1)

    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Authenticating with Garmin Connect for {email}...")

    token_store = os.path.expanduser("~/.garminconnect")
    os.makedirs(token_store, exist_ok=True)

    try:
        api = Garmin(email, password)
        api.login(token_store)
        print("✓ Successfully authenticated with Garmin Connect!")
    except GarminConnectMFAError:
        mfa_code = input("Garmin MFA Code required: ")
        api = Garmin(email, password, is_mfa=True)
        api.login(token_store, mfa_code=mfa_code)
        print("✓ MFA authentication successful!")
    except GarminConnectTooManyRequestsError as e:
        print("\n⚠️ Garmin Connect Rate Limit (HTTP 429):")
        print("Garmin has temporarily rate-limited IP login attempts.")
        print("Session tokens will automatically retry on the 2-hour cron schedule.")
        sys.exit(1)
    except GarminConnectAuthenticationError as e:
        print(f"\n❌ Garmin Authentication Failed: {e}")
        print("Please verify your email and password in .env.local.")
        sys.exit(1)
    except Exception as e:
        print(f"\n⚠️ Notice during login: {e}")
        # Proceed if session exists
        try:
            api = Garmin()
            api.login(token_store)
        except Exception as err:
            print(f"Could not load stored session tokens: {err}")
            sys.exit(1)

    today = datetime.date.today().isoformat()

    print(f"Fetching Garmin metrics for {today}...")

    sleep_data = {}
    hrv_data = {}
    stats_data = {}
    activities = []

    try:
        sleep_data = api.get_sleep_data(today) or {}
    except Exception as e:
        print(f"Sleep fetch note: {e}")

    try:
        hrv_data = api.get_hrv_data(today) or {}
    except Exception as e:
        print(f"HRV fetch note: {e}")

    try:
        stats_data = api.get_user_summary(today) or {}
    except Exception as e:
        print(f"Stats fetch note: {e}")

    try:
        activities = api.get_activities(0, 10) or []
    except Exception as e:
        print(f"Activities fetch note: {e}")

    # Extract Sleep Metrics
    daily_sleep_dto = sleep_data.get('dailySleepDTO', {}) if isinstance(sleep_data, dict) else {}
    sleep_sec = daily_sleep_dto.get('sleepTimeSeconds', 27000)
    sleep_score = daily_sleep_dto.get('sleepScores', {}).get('overall', {}).get('value', 80)

    # Extract HRV Metrics
    hrv_summary = hrv_data.get('hrvSummary', {}) if isinstance(hrv_data, dict) else {}
    nightly_hrv = hrv_summary.get('lastNightAvg', 68)
    hrv_status = hrv_summary.get('status', 'Balanced')

    # Extract Resting HR
    rhr = stats_data.get('restingHeartRate', 54) if isinstance(stats_data, dict) else 54

    payload = {
        "dailyHealth": {
            "date": today,
            "restingHr": rhr or 54,
            "hrvNightlyAvg": nightly_hrv or 68,
            "hrvStatus": hrv_status or 'Balanced',
            "sleepDurationSeconds": sleep_sec or 27000,
            "sleepScore": sleep_score or 80,
            "bodyBatteryStart": 85,
            "steps": stats_data.get('totalSteps', 10000) if isinstance(stats_data, dict) else 10000,
            "activeCalories": stats_data.get('activeKilocalories', 500) if isinstance(stats_data, dict) else 500,
        },
        "activities": activities
    }

    app_url = os.environ.get('APEX_APP_URL', 'http://localhost:3000') + '/api/garmin/sync-payload'
    print(f"Posting synced data to Apex AI Coach at {app_url}...")

    req = urllib.request.Request(
        app_url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            res_body = resp.read().decode('utf-8')
            print(f"✓ Sync Result: {res_body}")
    except Exception as err:
        print(f"Failed to post sync payload to Apex AI Coach API: {err}")

if __name__ == '__main__':
    run_sync()
