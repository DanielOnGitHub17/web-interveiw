import json
from datetime import datetime

import google.generativeai as genai


with open("../config.json") as file:
    genai.configure(api_key=json.load(file)["GOOGLE_API_KEY"])

# make all a class later

interview_model = genai.GenerativeModel("gemini-pro")
more_queries = "your response should be straightforward. "\
                "Do not go too broad. "\
                "the questions should not be 'WH' questions. "\
                "Give the answer in json array of strings. "\
                "{questions: [...]}. "\
                "add nothing else to the answer. "\
                "be a bit interactive."

def get_config():
    with open("../config.json") as file:
        return json.load(file)
    
def save_config(config, **kwargs):
    for prop in kwargs:
        config[prop] = kwargs[prop]
    with open("../config.json", 'w') as file:
        return json.dump(config, file)
    

def can_use():
    config = get_config()
    now, last_used = datetime.now().timestamp(), config["last_used"]
    time_past = now - last_used
    # used in the past 40 seconds
    if time_past < 40 or config["usage"] >= 40:
        return False
    elif datetime.fromtimestamp(last_used).date() != datetime.now().date():
        # reset usage
        save_config(config, usage=0)
    # reset last_used as last called
    config["usage"] += 1
    save_config(config, last_used=datetime.now().timestamp())
    return True
    

def questions_from_topic(topic, number):
    if can_use():
        return interview_model.generate_content(
            f"Generate {number} questions on the topic '{topic}'" + more_queries
        ).text
    else:
        return "false"

def questions_from_text(text, number):
    if can_use():
        return interview_model.generate_content(
            f"Generate {number} questions on this text: {text}" + more_queries
        ).text
    else:
        return "false"

def rewrite(question, number):
    if can_use():
        return interview_model.generate_content(
            f"rewrite '{question}' in {number} different ways, keeping it's meaning" + more_queries
        ).text
    else:
        return "false"
