# AI Title & Meta Description Generator

A simple web-based tool that uses Hugging Face's AI models to generate SEO-friendly titles and meta descriptions from your content.

## Features

- Clean, modern UI built with Tailwind CSS
- Generates titles and meta descriptions using AI
- Copy to clipboard functionality
- Loading indicators
- Mobile-responsive design

## Setup

1. Get a Hugging Face API token:
   - Go to [Hugging Face](https://huggingface.co/)
   - Create an account or sign in
   - Go to your profile settings
   - Navigate to "Access Tokens"
   - Create a new token

2. Add your API token:
   - Open `script.js`
   - Replace `YOUR_HUGGING_FACE_API_TOKEN` with your actual token

3. Deploy to WordPress:
   - Create a new page in WordPress
   - Switch to the "Text" or "Code" editor
   - Copy and paste the contents of `index.html`
   - Save and publish

## Usage

1. Paste your content into the text area
2. Click "Generate Title & Meta Description"
3. Wait for the AI to generate results
4. Copy the generated title or meta description using the copy button

## Notes

- The generator uses the `facebook/bart-large-cnn` model from Hugging Face
- Title generation is limited to 100 characters
- Meta description generation is limited to 160 characters
- The API is free to use with a Hugging Face account

## Security

For better security in a production environment, consider:
- Using environment variables for the API token
- Implementing rate limiting
- Adding CORS protection
- Using a backend proxy for API calls 