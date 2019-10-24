import requests

from bs4 import BeautifulSoup
#import keras
#import numpy as np

from api.note import Note


class Task:
    """
    def train_model(self, feature_attr, target_attr, notes, model):
        pass

    def attr_analysis(self, feature_attr, output_label, notes, model_file):
        model = keras.models.load_model(model_file)

        x = [note.attributes[feature_attr] for note in notes]
        x = np.array(x)
        predictions = model.predict(x)

        for note, prediction in zip(notes, predictions):
            note.attributes[output_label] = prediction
    """
    def web_scrape(self, target_url, location_tag, location_attrs=None):
        response = requests.get(target_url)
        soup = BeautifulSoup(response.text, "html.parser")
        data = list()

        for node in soup.find_all(location_tag, location_attrs):
            children = node.contents
            current_data = list()
            for c in children:
                if c.string is not None:
                    current_data.append(c.string)
            data.append(current_data)

        return data

    def create_notes_from_web_data(self, data, indices_dict):
        notes = list()
        for node in data:
            title = ""
            for ind in indices_dict["title"]:
                title += node[ind]

            text = ""
            for ind in indices_dict["text"]:
                text += node[ind]

            attributes = dict()
            for attr, val in indices_dict["attrs"].items():
                attr_text = ""
                for ind in val:
                    attr_text += node[ind]
                attributes[attr] = attr_text

            notes.append(Note(title=title, text=text, attrs=attributes))

        return notes
