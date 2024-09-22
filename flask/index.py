import chromadb
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db = chromadb.chromadb.PersistentClient(path="/chroma")

collection = db.get_or_create_collection('data')

def upload_document(document, source, chunk_size=200, overlap=50):
    chunks = [document[i:i + chunk_size] 
              for i in range(0, len(document) - chunk_size + 1, chunk_size - overlap)]
    collection.upsert(
        documents=chunks,
        ids=[str(i) for i in range(len(chunks))],
        metadatas=[{'source': source} for _ in range(len(chunks))]
    )

def query(query_string, top_k=1):
    if not query_string:
        return []
    response = collection.query(query_texts=[query_string], n_results=top_k)
    documents = [d for d in response['documents'][0]]
    sources = [s['source'] for s in response['metadatas'][0]]
    return [{'source': source, 'content': document} for source, document in zip(sources, documents)]


@app.route('/upload', methods=['PUT'])
def upload():
    data = request.get_json()
    docs = data.get('document', '')
    source = data.get('source', '')
    upload_document(docs, source)
    return jsonify({"status": "success"}), 200

@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    s = data.get('query', '')
    return jsonify(query(s))


if collection.count() == 0:
    with open('data/cleveland_clinic.txt', 'r') as file:
        contents = file.read()
        upload_document(contents, 'Cleveland Clinic')
    
if __name__ == '__main__':
    app.run()