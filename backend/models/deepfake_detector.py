import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import torchvision.transforms as transforms
from datasets import load_dataset
from transformers import AutoModelForImageClassification
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from tqdm import tqdm
import os

class DeepfakeDataset(Dataset):
    def __init__(self, hf_dataset, transform=None):
        self.dataset = hf_dataset
        self.transform = transform
        self.labels = [sample['label'] for sample in hf_dataset]

        self.le = LabelEncoder()
        self.le.fit(self.labels)

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        sample = self.dataset[idx]
        image = sample['image']
        label = sample['label']

        label = self.le.transform([label])[0]

        if isinstance(image, torch.Tensor):
            image = transforms.ToPILImage()(image)
        image = image.convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label

class DeepfakeDetector:
    def __init__(self, model_name="buildborderless/CommunityForensics-DeepfakeDet-ViT", device=None):
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = AutoModelForImageClassification.from_pretrained(model_name, num_labels=2)
        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((384, 384)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

        self.id2label = {0: "real", 1: "deepfake"}

    def train(self, train_loader, test_loader=None, epochs=1, lr=5e-5):
        optimizer = optim.AdamW(self.model.parameters(), lr=lr)

        self.model.train()
        for epoch in range(epochs):
            total_loss, correct, total = 0, 0, 0
            for images, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}"):
                images, labels = images.to(self.device), labels.to(self.device)
                optimizer.zero_grad()
                outputs = self.model(pixel_values=images, labels=labels)
                loss = outputs.loss
                loss.backward()
                optimizer.step()

                total_loss += loss.item()
                _, preds = torch.max(outputs.logits, 1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)

            print(f"Epoch {epoch+1} | Loss: {total_loss/len(train_loader):.4f} | Accuracy: {100*correct/total:.2f}%")

            if test_loader:
                self.evaluate(test_loader)

    def evaluate(self, loader):
        self.model.eval()
        all_preds, all_labels = [], []
        with torch.no_grad():
            for images, labels in tqdm(loader, desc="Evaluating"):
                images, labels = images.to(self.device), labels.to(self.device)
                outputs = self.model(pixel_values=images)
                _, preds = torch.max(outputs.logits, 1)
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

        acc = accuracy_score(all_labels, all_preds)
        print(f"Test Accuracy: {acc*100:.2f}%")
        return acc

    def predict_image(self, image_file, threshold=0.6):
        image = Image.open(image_file).convert("RGB")
        image = self.transform(image).unsqueeze(0).to(self.device)

        self.model.eval()
        with torch.no_grad():
            outputs = self.model(pixel_values=image)
            probs = torch.softmax(outputs.logits, dim=1)

            deepfake_prob = probs[0, 1].item()

            if deepfake_prob >= threshold:
                prediction = "deepfake"
            else:
                prediction = "real"

            print(f"Prediction: {prediction} | Deepfake prob: {deepfake_prob:.4f}")

        return {"prediction": prediction}

if __name__ == "__main__":
    ds = load_dataset("JamieWithofs/Deepfake-and-real-images-validation")
    full_dataset = ds['validation']

    split_idx = int(0.8 * len(full_dataset))
    train_data = full_dataset.select(range(split_idx))
    test_data = full_dataset.select(range(split_idx, len(full_dataset)))
    
    '''
    train_dataset = DeepfakeDataset(train_data)
    test_dataset = DeepfakeDataset(test_data)

    train_loader = DataLoader(train_dataset, batch_size=2, shuffle=True, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False, num_workers=0)
   
    detector = DeepfakeDetector()

    detector.train(train_loader, test_loader, epochs=1)

    model_dir = '/Users/Delisha/Documents/identity-guard-deepfake/'
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'identity_guard_deepfake_model.pth')
    torch.save(detector.model.state_dict(), model_path)
    print(f"Model saved at: {model_path}")
    '''

    detector = DeepfakeDetector()

    test_dataset = DeepfakeDataset(test_data, transform=detector.transform)
    test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False)

    detector.model.load_state_dict(
        torch.load(
            "/Users/Delisha/Documents/identity-guard-deepfake/identity_guard_deepfake_model.pth",
            map_location=detector.device
        )
    )

    detector.evaluate(test_loader)