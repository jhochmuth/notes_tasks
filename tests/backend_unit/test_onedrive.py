import onedrivesdk_fork as onedrivesdk

from utils.onedrive_authentication import client
from api.document import Document
from api.note import Note


n = Note.from_file("/Users/juliushochmuth/Documents/Textbooks/Clean Architecture.pdf", id="123")
print(n.id)
