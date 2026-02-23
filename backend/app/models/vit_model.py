"""
Vision Transformer model for autism facial analysis.
Based on ViT (Vision Transformer) architecture.
"""
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os
from transformers import ViTForImageClassification

# Model configuration
# Default model path (will be resolved in load_vit_model if not provided)
MODEL_SAVE_PATH = "backend/models/vitasd_model.pth"
IMAGE_SIZE = 224
BATCH_SIZE = 32


class ViTASDModel(nn.Module):
    """
    Vision Transformer model fine-tuned for autism spectrum disorder detection.
    """
    def __init__(self, num_classes=2, pretrained=True):
        super(ViTASDModel, self).__init__()
        # Load pretrained ViT base model
        self.vit = ViTForImageClassification.from_pretrained(
            "google/vit-base-patch16-224",
            num_labels=num_classes,
            ignore_mismatched_sizes=True
        )
    
    def forward(self, x):
        return self.vit(x)


# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def load_vit_model(model_path: str = None):
    """
    Load the trained ViT model from backend/models/vitasd_model.pth.
    If model doesn't exist, returns a placeholder model.
    """
    if model_path is None:
        model_path = MODEL_SAVE_PATH
    
    # Convert to absolute path if relative
    if not os.path.isabs(model_path):
        # Get the backend directory (go up from app/models/ to backend/)
        # __file__ is in backend/app/models/vit_model.py
        # os.path.dirname(__file__) = backend/app/models/
        # os.path.dirname(dirname) = backend/app/
        # os.path.dirname(dirname(dirname)) = backend/
        current_file_dir = os.path.dirname(os.path.abspath(__file__))  # backend/app/models/
        app_dir = os.path.dirname(current_file_dir)                     # backend/app/
        backend_dir = os.path.dirname(app_dir)                          # backend/
        model_path = os.path.join(backend_dir, "models", "vitasd_model.pth")
    
    print(f"Attempting to load model from: {model_path}")
    
    if os.path.exists(model_path):
        try:
            model = ViTASDModel(num_classes=2, pretrained=False)
            model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            model.eval()
            print(f"Successfully loaded trained model from {model_path}")
            return model
        except Exception as e:
            print(f"Error loading model: {e}. Using pretrained model as fallback.")
            model = ViTASDModel(num_classes=2, pretrained=True)
            model.eval()
            return model
    else:
        # Return pretrained model as fallback (not fine-tuned)
        print(f"Warning: Trained model not found at {model_path}. Using pretrained model.")
        model = ViTASDModel(num_classes=2, pretrained=True)
        model.eval()
        return model


def predict_autism_risk(model, image: Image.Image, device: torch.device) -> tuple[float, float]:
    """
    Predict autism risk from a facial image.
    Returns: (probability of autism, confidence)
    """
    model.to(device)
    model.eval()
    
    # Preprocess image
    img_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model(img_tensor)
        logits = outputs.logits if hasattr(outputs, 'logits') else outputs
        probabilities = torch.nn.functional.softmax(logits, dim=1)
        
        # Get probability of autism class (assuming class 1 is autism)
        autism_prob = probabilities[0][1].item()
        
        # Calculate confidence as the difference between max and second max probabilities
        sorted_probs = torch.sort(probabilities[0], descending=True)[0]
        confidence = (sorted_probs[0] - sorted_probs[1]).item()
    
    return autism_prob, confidence

