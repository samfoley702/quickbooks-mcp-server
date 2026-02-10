#!/usr/bin/env python3
"""Helper script to obtain QuickBooks OAuth refresh token."""

import urllib.parse
import requests
from requests.auth import HTTPBasicAuth
from http.server import HTTPServer, BaseHTTPRequestHandler
import webbrowser
from environment import Environment

CLIENT_ID = Environment.get('QUICKBOOKS_CLIENT_ID')
CLIENT_SECRET = Environment.get('QUICKBOOKS_CLIENT_SECRET')
REDIRECT_URI = "http://localhost:8080/callback"
SCOPE = "com.intuit.quickbooks.accounting"

AUTH_URL = "https://appcenter.intuit.com/connect/oauth2"
TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"

class OAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/callback'):
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)

            if 'code' in params:
                code = params['code'][0]
                realm_id = params.get('realmId', [''])[0]

                # Exchange code for tokens
                data = {
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': REDIRECT_URI
                }
                response = requests.post(
                    TOKEN_URL,
                    data=data,
                    auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET),
                    headers={'Accept': 'application/json'}
                )

                if response.status_code == 200:
                    tokens = response.json()
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()

                    html = f"""
                    <html><body style="font-family: sans-serif; padding: 40px;">
                    <h1>Success!</h1>
                    <p>Update your <code>.env</code> file with these values:</p>
                    <pre style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
QUICKBOOKS_REFRESH_TOKEN={tokens['refresh_token']}
QUICKBOOKS_COMPANY_ID={realm_id}
                    </pre>
                    <p>You can close this window.</p>
                    </body></html>
                    """
                    self.wfile.write(html.encode())

                    print("\n" + "="*50)
                    print("SUCCESS! Update your .env file:")
                    print("="*50)
                    print(f"QUICKBOOKS_REFRESH_TOKEN={tokens['refresh_token']}")
                    print(f"QUICKBOOKS_COMPANY_ID={realm_id}")
                    print("="*50 + "\n")
                else:
                    self.send_response(400)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    self.wfile.write(f"<html><body><h1>Error</h1><pre>{response.text}</pre></body></html>".encode())
                    print(f"Error: {response.status_code} {response.text}")
            else:
                error = params.get('error', ['Unknown error'])[0]
                self.send_response(400)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f"<html><body><h1>Error</h1><p>{error}</p></body></html>".encode())

    def log_message(self, format, *args):
        pass  # Suppress default logging

def main():
    # Build authorization URL
    auth_params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': SCOPE,
        'redirect_uri': REDIRECT_URI,
        'state': 'security_token'
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(auth_params)}"

    print("\n" + "="*50)
    print("QuickBooks OAuth Authorization")
    print("="*50)
    print("\nOpening browser for authorization...")
    print(f"\nIf browser doesn't open, visit:\n{auth_url}\n")

    # Open browser
    webbrowser.open(auth_url)

    # Start local server to receive callback
    print("Waiting for authorization callback on http://localhost:8080/callback ...")
    server = HTTPServer(('localhost', 8080), OAuthHandler)
    server.handle_request()  # Handle single request then exit

if __name__ == '__main__':
    main()
