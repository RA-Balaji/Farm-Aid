import requests

def check_incomplete(uid):

    url = "127.0.0.1:5010/fetchtasks?userid=" + uid
    r = requests.get(url = url)
    data = r.json()

    print(data)