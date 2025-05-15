// Hugging Face API token
const HF_API_TOKEN = process.env.HF_API_TOKEN || '';

function switchTab(tab) {
    const contentTab = document.getElementById('contentTab');
    const urlTab = document.getElementById('urlTab');
    const contentInput = document.getElementById('contentInput');
    const urlInput = document.getElementById('urlInput');

    if (tab === 'content') {
        contentTab.classList.add('tab-active');
        urlTab.classList.remove('tab-active');
        contentInput.classList.remove('hidden');
        urlInput.classList.add('hidden');
    } else {
        contentTab.classList.remove('tab-active');
        urlTab.classList.add('tab-active');
        contentInput.classList.add('hidden');
        urlInput.classList.remove('hidden');
    }
}

async function fetchContentFromUrl(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Create a temporary div to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get the main content
        // First try to find the main content area
        let content = '';
        
        // Try common content selectors
        const contentSelectors = [
            'article',
            'main',
            '.content',
            '#content',
            '.post-content',
            '.entry-content',
            '.article-content'
        ];
        
        for (const selector of contentSelectors) {
            const element = doc.querySelector(selector);
            if (element) {
                content = element.textContent;
                break;
            }
        }
        
        // If no content found, get all paragraph text
        if (!content) {
            const paragraphs = doc.querySelectorAll('p');
            content = Array.from(paragraphs)
                .map(p => p.textContent)
                .join('\n');
        }
        
        return content.trim();
    } catch (error) {
        console.error('Error fetching URL:', error);
        throw new Error('Failed to fetch content from URL');
    }
}

async function generateContent() {
    const contentTab = document.getElementById('contentTab');
    const isContentTab = contentTab.classList.contains('tab-active');
    
    let content;
    
    if (isContentTab) {
        content = document.getElementById('content').value.trim();
        if (!content) {
            alert('Please enter some content first!');
            return;
        }
    } else {
        const url = document.getElementById('url').value.trim();
        if (!url) {
            alert('Please enter a URL!');
            return;
        }
        try {
            content = await fetchContentFromUrl(url);
            if (!content) {
                alert('No content found on the page!');
                return;
            }
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    // Show loading spinner
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').classList.add('hidden');

    try {
        // Generate title
        const titleResponse = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Generate a compelling title for this content: ${content}`,
                parameters: {
                    max_length: 100,
                    min_length: 10,
                    num_return_sequences: 1
                }
            })
        });

        // Generate meta description
        const metaResponse = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Generate a meta description for this content: ${content}`,
                parameters: {
                    max_length: 160,
                    min_length: 50,
                    num_return_sequences: 1
                }
            })
        });

        const titleData = await titleResponse.json();
        const metaData = await metaResponse.json();

        // Display results
        document.getElementById('generatedTitle').textContent = titleData[0].generated_text;
        document.getElementById('generatedMeta').textContent = metaData[0].generated_text;
        document.getElementById('results').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating content. Please try again.');
    } finally {
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
    }
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
} 
