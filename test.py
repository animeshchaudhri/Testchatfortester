import requests
import threading
import time

# Define the base URL of your Express app
BASE_URL = "http://localhost:4000/"  # Adjust to your route

# Number of threads to simulate concurrent requests
NUM_REQUESTS = 1100  # For example, testing for 1100 requests

# Rate limiting test function
def test_rate_limiting(thread_id):
    response = requests.get(BASE_URL)
    if response.status_code == 429:
        print(f"Thread-{thread_id}: Rate limit exceeded (429 Too Many Requests)")
    else:
        print(f"Thread-{thread_id}: Request successful (Status: {response.status_code})")

# Function to perform the rate limiting test using multiple threads
def perform_rate_limiting_test():
    threads = []

    # Create and start threads to simulate multiple requests
    for i in range(NUM_REQUESTS):
        thread = threading.Thread(target=test_rate_limiting, args=(i,))
        threads.append(thread)
        thread.start()

    # Wait for all threads to finish
    for thread in threads:
        thread.join()

if __name__ == "__main__":
    print("Starting rate limiting test...")
    perform_rate_limiting_test()
    print("Rate limiting test completed.")
