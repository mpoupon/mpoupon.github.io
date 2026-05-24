#!/usr/bin/env python3
"""Dev server with no-cache headers — prevents stale .jsx/.css files in browser."""
import http.server

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # silence request logs

if __name__ == "__main__":
    http.server.test(HandlerClass=NoCacheHandler, port=8765, bind="")
