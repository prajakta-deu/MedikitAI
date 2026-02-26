import requests
import json

# Ollama configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "tinyllama"

def call_tinyllama(user_prompt):
    """Send prompt to TinyLlama and get response"""
    
    # Create the prompt with health assistant context
    full_prompt = f"You are an emergency health assistant. Provide clear first aid advice.\n\nUser: {user_prompt}\n\nAssistant:"
    
    payload = {
        "model": MODEL_NAME,
        "prompt": full_prompt,
        "stream": False
    }
    
    try:
        print("\n🤖 TinyLlama is thinking...")
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        
        result = response.json()
        ai_response = result.get("response", "").strip()
        return ai_response
        
    except requests.exceptions.ConnectionError:
        return "❌ Error: Cannot connect to Ollama. Make sure Ollama is running (ollama serve)"
    except requests.exceptions.Timeout:
        return "❌ Error: Request timed out. TinyLlama took too long to respond."
    except Exception as e:
        return f"❌ Error: {str(e)}"

def main():
    """Terminal demo - Interactive chat with TinyLlama"""
    
    print("=" * 60)
    print("🏥 AI-Powered Emergency Health Assistant - Terminal Demo")
    print("=" * 60)
    print("Type your health emergency query below.")
    print("Type 'quit' or 'exit' to stop.\n")
    
    while True:
        # Get user input
        user_query = input("👤 You: ").strip()
        
        # Exit condition
        if user_query.lower() in ['quit', 'exit', 'q']:
            print("\n👋 Goodbye! Stay safe!")
            break
        
        # Skip empty input
        if not user_query:
            print("⚠️  Please enter a query.\n")
            continue
        
        # Call TinyLlama
        ai_response = call_tinyllama(user_query)
        
        # Display response
        print(f"\n🤖 TinyLlama: {ai_response}\n")
        print("-" * 60)

if __name__ == "__main__":
    main()