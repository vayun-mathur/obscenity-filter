import numpy as np
import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel
from tqdm import tqdm

class BertClassifier(nn.Module):
    
    def __init__(self, bert: BertModel, num_classes: int):
        super().__init__()
        self.bert = bert
        self.classifier = nn.Linear(bert.config.hidden_size, num_classes)
        
    def forward(self, input_ids, attention_mask=None, token_type_ids=None, position_ids=None, head_mask=None, labels=None):
        outputs = self.bert(input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids, position_ids=position_ids, head_mask=head_mask)
        cls_output = outputs[1] # batch, hidden
        cls_output = self.classifier(cls_output) # batch, 6
        cls_output = torch.sigmoid(cls_output)
        criterion = nn.BCELoss()
        loss = 0
        if labels is not None:
            loss = criterion(cls_output, labels)
        return loss, cls_output

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = BertClassifier(BertModel.from_pretrained('bert-base-cased'), 6)
model.load_state_dict(torch.load('model.pth', map_location=device))
model = model.to(device)
model.eval()

tokenizer = BertTokenizer.from_pretrained('bert-base-cased')

def evaluate(model, iterator):
    pred = []
    with torch.no_grad():
        for text in tqdm(iterator):
            tokens = tokenizer.encode(text, add_special_tokens=True)
            if len(tokens) > 120:
                tokens = tokens[:119] + [tokens[-1]]
            x = torch.LongTensor([tokens])
            mask = (x != 0).float()
            _, outputs = model(x, attention_mask=mask)
            pred += outputs.cpu().numpy().tolist()
    return pred

def get_descriptors(model, iterator):
    pred = evaluate(model, iterator)
    pred = np.array(pred)
    pred = np.where(pred > 0.5, 1, 0)
    results = []
    categories = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
    for i in range(len(pred)):
        for j, cat in enumerate(reversed(categories)):
            j = len(categories) - 1 - j
            if pred[i][j] == 1:
                results.append(cat)
                break
        if(np.sum(pred[i]) == 0):
            results.append('normal')
    return results

from flask import Flask, jsonify, request

app = Flask(__name__)
from flask_cors import CORS, cross_origin
cors = CORS(app)

@app.route('/api', methods=['POST'])
@cross_origin(origin='*')
def api():
    data = request.get_json()
    texts = data["texts"]
    print(len(texts))
    results = get_descriptors(model, texts)
    print(len(results))
    # process the data
    return jsonify({'status': 'success', 'results': results}), 200

if __name__ == '__main__':
    app.run(port=5000)