import time
from collections import defaultdict

class AnomalyDetector:
    def __init__(self):
        self.failed_attempts = defaultdict(int)
        self.request_log = defaultdict(list)
        self.blocked_users = {}
        self.MAX_FAILS = 5
        self.RATE_LIMIT = 10        # max requests
        self.TIME_WINDOW = 10       # seconds
        self.BLOCK_TIME = 60        # seconds

    def is_blocked(self, user):
        if user in self.blocked_users:
            if time.time() < self.blocked_users[user]:
                return True
            else:
                del self.blocked_users[user]
        return False

    def register_request(self, user, payload_size=0):
        now = time.time()

        # Store request timestamps
        self.request_log[user].append(now)

        # Keep only recent timestamps
        self.request_log[user] = [
            t for t in self.request_log[user]
            if now - t <= self.TIME_WINDOW
        ]

        # Rate limit check
        if len(self.request_log[user]) > self.RATE_LIMIT:
            self.block_user(user, "Rate limit exceeded")
            return False

        return True

    def register_failure(self, user):
        self.failed_attempts[user] += 1
        if self.failed_attempts[user] >= self.MAX_FAILS:
            self.block_user(user, "Too many failures")

    def block_user(self, user, reason):
        self.blocked_users[user] = time.time() + self.BLOCK_TIME
        print(f"[SECURITY] User '{user}' blocked → {reason}")

    def status(self, user):
        return {
            "blocked": user in self.blocked_users,
            "failures": self.failed_attempts.get(user, 0),
            "requests": len(self.request_log.get(user, []))
        }
