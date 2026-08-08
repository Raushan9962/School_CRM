import urllib.request, json, re

# Login
req = urllib.request.Request(
    'http://localhost:8000/api/auth/login',
    data=json.dumps({'email': 'raushanitwork7@gmail.com', 'password': 'DRCC@1234'}).encode(),
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
data = json.loads(res.read().decode())
token = data['token']
headers = {'Authorization': f'Bearer {token}'}

# Check students error in detail
req2 = urllib.request.Request('http://localhost:8000/api/students/', headers=headers)
try:
    urllib.request.urlopen(req2)
except urllib.error.HTTPError as e:
    html = e.read().decode()
    # Extract exception value
    match = re.search(r'<pre class="exception_value">(.+?)</pre>', html, re.DOTALL)
    if match:
        print("Exception:", match.group(1).strip())
    # Extract traceback lines
    frames = re.findall(r'<code class="fname">(.+?)</code>.*?<pre>(.+?)</pre>', html, re.DOTALL)
    for fname, code in frames[-3:]:
        print(f"\nFile: {fname.strip()}")
        print(f"Code: {code.strip()[:200]}")
