import requests

from bs4 import BeautifulSoup

from api.old_note import Note


class Task:

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
